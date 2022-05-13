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
import { BaseRelation, Schema, SchemaField } from '../core/schema'
import levenshtein from 'js-levenshtein'

export class TreeNodeEnvironmentFactory {

	public static createEnvironmentForEntityListSubtree(
		environment: Environment,
		sugaredEntityList: SugaredQualifiedEntityList | SugaredUnconstrainedQualifiedEntityList,
	): Environment {
		let entityList
		let rootWhere

		if (sugaredEntityList.isCreating) {
			entityList = QueryLanguage.desugarUnconstrainedQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = { id: { eq: NIL_UUID } } as const

		} else {
			entityList = QueryLanguage.desugarQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = entityList.filter ?? {}
		}

		this.assertEntityExists(environment.getSchema(), entityList.entityName, 'entity list')

		return environment.withSubtree({
				entity: entityList.entityName,
				expectedCardinality: 'zero-to-many',
				type: 'list',
				filter: rootWhere,
			})
	}

	public static createEnvironmentForEntitySubtree(
		environment: Environment,
		sugaredEntityList: SugaredQualifiedSingleEntity | SugaredUnconstrainedQualifiedSingleEntity,
	): Environment {
		let rootWhere
		let expectedCardinality: Environment.Subtree['expectedCardinality']
		let qualifiedSingleEntity

		if (sugaredEntityList.isCreating) {
			rootWhere = { id: { eq: NIL_UUID } } as const
			expectedCardinality = 'zero'
			qualifiedSingleEntity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(sugaredEntityList, environment)

		} else {
			qualifiedSingleEntity = QueryLanguage.desugarQualifiedSingleEntity(sugaredEntityList, environment, { missingSetOnCreate: 'fill' })
			rootWhere = whereToFilter(qualifiedSingleEntity.where)
			expectedCardinality = qualifiedSingleEntity.setOnCreate ? 'zero-or-one' : 'one'
		}

		this.assertEntityExists(environment.getSchema(), qualifiedSingleEntity.entityName, 'entity')

		return environment.withSubtree({
			entity: qualifiedSingleEntity.entityName,
			expectedCardinality: expectedCardinality,
			type: 'entity',
			filter: rootWhere,
		})
	}

	public static createEnvironmentForEntityList(
		environment: Environment,
		sugaredRelativeEntityList: string | SugaredRelativeEntityList,
	): Environment {
		const relativeEntityList = QueryLanguage.desugarRelativeEntityList(sugaredRelativeEntityList, environment)
		const hasOneEnvironment = this.traverseHasOnePath(environment, relativeEntityList.hasOneRelationPath)
		const hasManyField = relativeEntityList.hasManyRelation.field

		this.assertHasManyRelationValid(hasOneEnvironment, hasManyField)

		return hasOneEnvironment.withTreeChild(hasManyField)
	}

	public static createEnvironmentForEntity(
		environment: Environment,
		sugaredRelativeSingleEntity: string | SugaredRelativeSingleEntity,
	) {
		const relativeSingleEntity = QueryLanguage.desugarRelativeSingleEntity(sugaredRelativeSingleEntity, environment)

		return this.traverseHasOnePath(
			environment,
			relativeSingleEntity.hasOneRelationPath,
		)
	}

	public static createEnvironmentForField(
		environment: Environment,
		sugaredRelativeSingleField: string | SugaredRelativeSingleField,
	) {
		const relativeSingleField = QueryLanguage.desugarRelativeSingleField(sugaredRelativeSingleField, environment)
		const hasOneEnvironment = this.traverseHasOnePath(environment, relativeSingleField.hasOneRelationPath)

		this.assertColumnValid(hasOneEnvironment, relativeSingleField.field)

		return hasOneEnvironment.withTreeChild(relativeSingleField.field)
	}

	private static traverseHasOnePath(
		environment: Environment,
		hasOneRelationPath: HasOneRelation[],
	): Environment {
		for (const field of hasOneRelationPath) {
			this.assertHasOneRelationValid(environment, field.field, !!field.reducedBy)
			environment = environment.withTreeChild(field.field)
		}
		return environment
	}

	private static assertHasOneRelationValid(environment: Environment, field: string, isReduced: boolean) {
		if (isReduced) {
			return this.assertRelationValid(environment, field, 'reduced has-one', ['ManyHasMany', 'OneHasMany'])
		}
		return this.assertRelationValid(environment, field, 'has-one', ['ManyHasOne', 'OneHasOne'])
	}

	private static assertHasManyRelationValid(environment: Environment, field: string) {
		return this.assertRelationValid(environment, field, 'has-many', ['ManyHasMany', 'OneHasMany'])
	}


	private static assertRelationValid(environment: Environment, field: string, relationDescription: string, expectedRelationType: BaseRelation['type'][]) {
		const treeLocation = environment.getSubtreeLocation()
		const relation = this.getField(environment, field, field => {
			if (field.__typename !== '_Relation') {
				return false
			}
			return expectedRelationType.includes(field.type)
		})
		if (relation.__typename === '_Column') {
			throw new BindingError(
				`Invalid field: the name '${field}' on ${this.describeLocation(treeLocation)} ` +
				`refers to an ordinary scalar field but is being used as a ${relationDescription} relation.`,
			)
		}
		if (!expectedRelationType.includes(relation.type)) {
			throw new BindingError(`Invalid relation: the name '${field}' on ${this.describeLocation(treeLocation)} ` +
				`refers to a ${relation.type} relation but is being used as a ${relationDescription}.`)
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
