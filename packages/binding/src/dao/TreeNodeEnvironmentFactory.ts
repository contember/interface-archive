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
		let expectedCardinality: Environment.Subtree['expectedCardinality']

		if (sugaredEntityList.isCreating) {
			entityList = QueryLanguage.desugarUnconstrainedQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = { id: { eq: NIL_UUID } } as const
			expectedCardinality = 'zero'

		} else {
			entityList = QueryLanguage.desugarQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = entityList.filter ?? {}
			expectedCardinality = 'zero-to-many'
		}

		this.assertEntityExists(environment.getSchema(), entityList.entityName, 'entity list')

		return environment.withSubtree({
			entity: entityList.entityName,
			expectedCardinality,
			type: 'list',
			filter: rootWhere,
		})
	}

	public static createEnvironmentForEntitySubtree(
		environment: Environment,
		sugaredEntityList: SugaredQualifiedSingleEntity | SugaredUnconstrainedQualifiedSingleEntity,
	): Environment {
		let entity
		let rootWhere
		let expectedCardinality: Environment.Subtree['expectedCardinality']

		if (sugaredEntityList.isCreating) {
			rootWhere = { id: { eq: NIL_UUID } } as const
			expectedCardinality = 'zero'
			entity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(sugaredEntityList, environment)

		} else {
			entity = QueryLanguage.desugarQualifiedSingleEntity(sugaredEntityList, environment, { missingSetOnCreate: 'fill' })
			rootWhere = whereToFilter(entity.where)
			expectedCardinality = entity.setOnCreate ? 'zero-or-one' : 'one'
		}

		this.assertEntityExists(environment.getSchema(), entity.entityName, 'entity')

		return environment.withSubtree({
			entity: entity.entityName,
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

		return hasOneEnvironment.withSubtreeChild(hasManyField)
	}

	public static createEnvironmentForEntity(
		environment: Environment,
		sugaredRelativeSingleEntity: string | SugaredRelativeSingleEntity,
	) {
		const relativeSingleEntity = QueryLanguage.desugarRelativeSingleEntity(sugaredRelativeSingleEntity, environment)

		return this.traverseHasOnePath(environment, relativeSingleEntity.hasOneRelationPath)
	}

	public static createEnvironmentForField(
		environment: Environment,
		sugaredRelativeSingleField: string | SugaredRelativeSingleField,
	) {
		const relativeSingleField = QueryLanguage.desugarRelativeSingleField(sugaredRelativeSingleField, environment)
		const hasOneEnvironment = this.traverseHasOnePath(environment, relativeSingleField.hasOneRelationPath)

		this.assertColumnValid(hasOneEnvironment, relativeSingleField.field)

		return hasOneEnvironment.withSubtreeChild(relativeSingleField.field)
	}

	private static traverseHasOnePath(
		environment: Environment,
		hasOneRelationPath: HasOneRelation[],
	): Environment {
		for (const field of hasOneRelationPath) {
			this.assertHasOneRelationValid(environment, field.field, !!field.reducedBy)
			environment = environment.withSubtreeChild(field.field)
		}
		return environment
	}

	private static assertHasOneRelationValid(environment: Environment, field: string, isReduced: boolean) {
		if (isReduced) {
			return this.assertRelationValid(environment, field, 'reduced has-one relation', ['ManyHasMany', 'OneHasMany'])
		}
		return this.assertRelationValid(environment, field, 'a has-one relation', ['ManyHasOne', 'OneHasOne'])
	}

	private static assertHasManyRelationValid(environment: Environment, field: string) {
		return this.assertRelationValid(environment, field, 'a has-many relation', ['ManyHasMany', 'OneHasMany'])
	}


	private static assertRelationValid(environment: Environment, field: string, relationDescription: string, expectedRelationType: BaseRelation['type'][]) {
		this.assertFieldValid(environment, field, field => {
			return field.__typename === '_Relation' && expectedRelationType.includes(field.type)
		}, relationDescription)
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
		this.assertFieldValid(environment, fieldName, field => field.__typename === '_Column', 'an ordinary field')
		// TODO check that defaultValue matches the type
		// TODO run custom validators
	}

	private static assertFieldValid(environment: Environment, fieldName: string, matcher: (field: SchemaField) => boolean, expectedDescription: string): void {
		const schema = environment.getSchema()
		const treeLocation = environment.getSubtreeLocation()
		const field = schema.getEntityField(treeLocation.entity, fieldName)
		if (field) {
			if (!matcher(field)) {
				const actual = field.__typename === '_Column' ? 'an ordinary field' : `a ${field.type} relation`
				throw new BindingError(
					`Invalid field: the name '${field.name}' on ${this.describeLocation(environment.getSubtreeLocation())} ` +
					`refers to an ${actual} but is being used as a ${expectedDescription}.`,
				)
			}
			return
		}
		const entity = schema.getEntity(treeLocation.entity)
		if (!entity) {
			throw new BindingError(`Entity ${treeLocation.entity} not found.`)
		}
		const alternative = this.recommendAlternative(
			fieldName,
			Array.from(entity.fields)
				.filter(([, field]) => matcher(field))
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
