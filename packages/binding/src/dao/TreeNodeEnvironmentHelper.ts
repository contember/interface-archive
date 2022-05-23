import { Environment } from './Environment'
import {
	HasOneRelation,
	SugaredQualifiedEntityList,
	SugaredQualifiedSingleEntity,
	SugaredRelativeEntityList,
	SugaredRelativeSingleEntity,
	SugaredRelativeSingleField,
	SugaredUnconstrainedQualifiedEntityList,
	SugaredUnconstrainedQualifiedSingleEntity,
} from '../treeParameters'
import { QueryLanguage } from '../queryLanguage'
import { BindingError } from '../BindingError'
import { NIL_UUID } from '../bindingTypes'
import { whereToFilter } from '@contember/client'
import { Schema, SchemaField } from '../core/schema'
import levenshtein from 'js-levenshtein'

export class TreeNodeEnvironmentHelper {
	public static createEnvironmentForEntityListSubtree(
		sugaredEntityList: SugaredQualifiedEntityList | SugaredUnconstrainedQualifiedEntityList,
		environment: Environment,
	): Environment {
		let entityList
		let rootWhere
		if (sugaredEntityList.isCreating) {
			rootWhere = { id: { eq: NIL_UUID } } as const
			entityList = QueryLanguage.desugarUnconstrainedQualifiedEntityList(sugaredEntityList, environment)
		} else {
			entityList = QueryLanguage.desugarQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = entityList.filter ?? {}
		}
		this.assertEntityExists(environment.getSchema(), entityList.entityName, 'entity list')

		return environment
			.withSubtree({
				entity: entityList.entityName,
				expectedCardinality: 'many',
				type: 'list',
				filter: rootWhere,
			})
	}

	public static createEnvironmentForEntitySubtree(
		sugaredEntityList: | SugaredQualifiedSingleEntity | SugaredUnconstrainedQualifiedSingleEntity,
		environment: Environment,
	): Environment {
		if (sugaredEntityList.isCreating) {
			const rootWhere = { id: { eq: NIL_UUID } } as const
			const qualifiedSingleEntity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(sugaredEntityList, environment)
			this.assertEntityExists(environment.getSchema(), qualifiedSingleEntity.entityName, 'entity')
			return environment.withSubtree({
				filter: rootWhere,
				expectedCardinality: 'zero',
				entity: qualifiedSingleEntity.entityName,
				type: 'entity',
			})
		}
		const qualifiedSingleEntity = QueryLanguage.desugarQualifiedSingleEntity(sugaredEntityList, environment, { missingSetOnCreate: 'fill' })
		this.assertEntityExists(environment.getSchema(), qualifiedSingleEntity.entityName, 'entity')
		return environment.withSubtree({
			filter: whereToFilter(qualifiedSingleEntity.where),
			expectedCardinality: qualifiedSingleEntity.setOnCreate ? 'zero-or-one' : 'one',
			entity: qualifiedSingleEntity.entityName,
			type: 'entity',
		})
	}

	public static createEnvironmentForEntityList(
		sugaredRelativeEntityList: string | SugaredRelativeEntityList,
		environment: Environment,
	): Environment {
		const relativeEntityList = QueryLanguage.desugarRelativeEntityList(sugaredRelativeEntityList, environment)
		const hasOneEnvironment = TreeNodeEnvironmentHelper.traverseHasOnePath(
			environment,
			relativeEntityList.hasOneRelationPath,
		)
		const hasManyField = relativeEntityList.hasManyRelation.field
		TreeNodeEnvironmentHelper.assertRelationValid(hasOneEnvironment, hasManyField, 'many', false)

		return hasOneEnvironment.withTreeChild({ field: hasManyField })
	}

	public static createEnvironmentForEntity(
		sugaredRelativeSingleEntity: string | SugaredRelativeSingleEntity,
		environment: Environment,
	) {
		const relativeSingleEntity = QueryLanguage.desugarRelativeSingleEntity(sugaredRelativeSingleEntity, environment)
		return TreeNodeEnvironmentHelper.traverseHasOnePath(
			environment,
			relativeSingleEntity.hasOneRelationPath,
		)
	}

	public static createEnvironmentForField(
		sugaredRelativeSingleField: string | SugaredRelativeSingleField,
		environment: Environment,
	) {
		const relativeSingleField = QueryLanguage.desugarRelativeSingleField(sugaredRelativeSingleField, environment)
		const hasOneEnvironment = TreeNodeEnvironmentHelper.traverseHasOnePath(
			environment,
			relativeSingleField.hasOneRelationPath,
		)
		this.assertColumnValid(hasOneEnvironment, relativeSingleField.field)

		return hasOneEnvironment.withTreeChild({ field: relativeSingleField.field })
	}

	private static traverseHasOnePath(
		environment: Environment,
		hasOneRelationPath: HasOneRelation[],
	): Environment {
		for (const field of hasOneRelationPath) {
			TreeNodeEnvironmentHelper.assertRelationValid(environment, field.field, 'one', !!field.reducedBy)
			environment = environment.withTreeChild({ field: field.field })
		}
		return environment
	}

	private static assertRelationValid(environment: Environment, field: string, type: 'many' | 'one', isReduced: boolean) {
		const treeLocation = environment.getSubtreeLocation()
		const relation = this.getField(environment, field, field => {
			if (field.__typename !== '_Relation') {
				return false
			}
			if (type === 'many' || (type === 'one' && isReduced)) {
				return field.type === 'OneHasMany' || field.type === 'ManyHasMany'
			}
			return field.type === 'OneHasOne' || field.type === 'ManyHasOne'
		})
		if (relation.__typename === '_Column') {
			throw new BindingError(
				`Invalid field: the name '${field}' on ${this.describeLocation(treeLocation)} ` +
				`refers to an ordinary scalar field but is being used as a has-${type} relation.`,
			)
		}

		if (type === 'one' && (relation.type !== 'OneHasOne' && relation.type !== 'ManyHasOne') && !isReduced) {
			throw new BindingError(`Invalid has-one relation: the name '${field}' on ${this.describeLocation(treeLocation)} ` +
				`refers to a has-many relation but is being used as a has-one.`)
		} else if (type === 'many' && (relation.type !== 'OneHasMany' && relation.type !== 'ManyHasMany')) {
			throw new BindingError(`Invalid has-one relation: the name '${field}' on ${this.describeLocation(treeLocation)} ` +
				`refers to a has-one relation but is being used as a has-many.`) // todo
		}
	}

	private static assertEntityExists(schema: Schema, entityName: string, type: 'entity' | 'entity list') {
		const entity = schema.getEntity(entityName)
		if (!entity) {
			const alternative = this.recommendAlternative(entityName, schema.store.entities.keys())
			const didYouMean = alternative ? `Did you mean '${alternative}'?` : ''
			throw new BindingError(`Invalid ${type} sub tree: Entity '${entityName}' doesn't exist. ${didYouMean}`)
		}
	}

	private static assertColumnValid(environment: Environment, fieldName: string) {
		const field = this.getField(environment, fieldName, field => field.__typename === '_Column')
		if (field.__typename === '_Relation') {
			const treeLocation = environment.getSubtreeLocation()
			throw new BindingError(
				`Invalid field: the name '${fieldName}' on ${this.describeLocation(treeLocation)}` +
				`refers to a has-${
					field.type === 'OneHasOne' || field.type === 'ManyHasOne' ? 'one' : 'many'
				} relation but is being used as a field.`,
			)
		}
		// TODO check that defaultValue matches the type
		// TODO run custom validators
	}

	private static getField(environment: Environment, fieldName: string, alternativeFilter: (field: SchemaField) => boolean): SchemaField {
		const schema = environment.getSchema()
		const treeLocation = environment.getSubtreeLocation()
		const field = schema.getEntityField(treeLocation.entity, fieldName)
		if (field) {
			return field
		}
		const entity = schema.getEntity(treeLocation.entity)
		if (!entity) {
			throw new BindingError(`Entity ${treeLocation.entity} not found.`)
		}
		const alternative = this.recommendAlternative(
			fieldName,
			Array.from(entity.fields)
				.filter(([, field]) => alternativeFilter(field))
				.map(([fieldName]) => fieldName),
		)
		const didYouMean = alternative ? `Did you mean '${alternative}'?` : ''
		throw new BindingError(`Field '${fieldName}' doesn't exist on ${this.describeLocation(treeLocation)}. ${didYouMean}`)
	}


	private static describeLocation(subtreeLocation: Environment.SubtreeLocation): string {
		if (subtreeLocation.path.length === 0) {
			return `entity '${subtreeLocation.entity}'`
		}
		return `entity '${subtreeLocation.entity}' in path '${[...subtreeLocation.path].join('.')}'`
	}

	public static recommendAlternative(original: string, possibleAlternatives: Iterable<string>): string | undefined {
		let bestAlternative: string | undefined = undefined
		let bestAlternativeDistance = Number.MAX_SAFE_INTEGER

		for (const alternative of possibleAlternatives) {
			const distance = levenshtein(original, alternative)

			if (distance < bestAlternativeDistance) {
				bestAlternative = alternative
				bestAlternativeDistance = distance
			}
		}
		return bestAlternative
	}
}
