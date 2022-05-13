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
import { BaseRelation, Schema, SchemaColumn, SchemaEntity, SchemaField, SchemaRelation } from '../core/schema'
import levenshtein from 'js-levenshtein'

export class TreeNodeEnvironmentFactory {

	public static createEnvironmentForEntityListSubtree(
		environment: Environment,
		sugaredEntityList: SugaredQualifiedEntityList | SugaredUnconstrainedQualifiedEntityList,
	): Environment {
		let entityList
		let rootWhere
		let expectedCardinality: Environment.SubtreeNode['expectedCardinality']

		if (sugaredEntityList.isCreating) {
			entityList = QueryLanguage.desugarUnconstrainedQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = { id: { eq: NIL_UUID } } as const
			expectedCardinality = 'zero'

		} else {
			entityList = QueryLanguage.desugarQualifiedEntityList(sugaredEntityList, environment)
			rootWhere = entityList.filter ?? {}
			expectedCardinality = 'zero-to-many'
		}

		const entitySchema = this.assertEntityExists(environment.getSchema(), entityList.entityName, 'entity list')

		return environment.withSubtree({
			type: 'subtree-entity-list',
			entity: entitySchema,
			expectedCardinality,
			filter: rootWhere,
		})
	}

	public static createEnvironmentForEntitySubtree(
		environment: Environment,
		sugaredEntityList: SugaredQualifiedSingleEntity | SugaredUnconstrainedQualifiedSingleEntity,
	): Environment {
		let entity
		let rootWhere
		let expectedCardinality: Environment.SubtreeNode['expectedCardinality']

		if (sugaredEntityList.isCreating) {
			rootWhere = { id: { eq: NIL_UUID } } as const
			expectedCardinality = 'zero'
			entity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(sugaredEntityList, environment)

		} else {
			entity = QueryLanguage.desugarQualifiedSingleEntity(sugaredEntityList, environment, { missingSetOnCreate: 'fill' })
			rootWhere = whereToFilter(entity.where)
			expectedCardinality = entity.setOnCreate ? 'zero-or-one' : 'one'
		}

		const entitySchema = this.assertEntityExists(environment.getSchema(), entity.entityName, 'entity')

		return environment.withSubtree({
			type: 'subtree-entity',
			entity: entitySchema,
			expectedCardinality: expectedCardinality,
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

		const field = this.assertHasManyRelationValid(hasOneEnvironment, hasManyField)

		const targetEntity = environment.getSchema().getEntity(field.targetEntity)
		if (!targetEntity) {
			throw new BindingError('should not happen')
		}
		return hasOneEnvironment.withSubtreeChild({
			type: 'entity-list',
			field,
			entity: targetEntity,
		})
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

		const field = this.assertColumnValid(hasOneEnvironment, relativeSingleField.field)

		return hasOneEnvironment.withSubtreeChild({
			type: 'column',
			entity: environment.getTreeNode().entity,
			field,
		})
	}

	private static traverseHasOnePath(
		environment: Environment,
		hasOneRelationPath: HasOneRelation[],
	): Environment {
		for (const pathItem of hasOneRelationPath) {
			const field = this.assertHasOneRelationValid(environment, pathItem.field, !!pathItem.reducedBy)
			const targetEntity = environment.getSchema().getEntity(field.targetEntity)
			if (!targetEntity) {
				throw new BindingError('should not happen')
			}
			environment = environment.withSubtreeChild({
				type: 'entity',
				field,
				entity: targetEntity,
			})
		}
		return environment
	}

	private static assertHasOneRelationValid(environment: Environment, field: string, isReduced: boolean) {
		if (isReduced) {
			return this.assertRelationValid(environment, field, 'reduced has-one relation', ['ManyHasMany', 'OneHasMany'])
		}
		return this.assertRelationValid(environment, field, 'a has-one relation', ['ManyHasOne', 'OneHasOne'])
	}

	private static assertHasManyRelationValid(environment: Environment, field: string): SchemaRelation {
		return this.assertRelationValid(environment, field, 'a has-many relation', ['ManyHasMany', 'OneHasMany'])
	}


	private static assertRelationValid(environment: Environment, field: string, relationDescription: string, expectedRelationType: BaseRelation['type'][]): SchemaRelation {
		return this.assertFieldValid(environment, field, (field): field is SchemaRelation => {
			return field.__typename === '_Relation' && expectedRelationType.includes(field.type)
		}, relationDescription)
	}

	private static assertEntityExists(schema: Schema, entityName: string, type: 'entity' | 'entity list'): SchemaEntity {
		const entity = schema.getEntity(entityName)
		if (!entity) {
			const alternative = this.recommendAlternative(entityName, schema.store.entities.keys())
			const didYouMean = alternative ? `Did you mean '${alternative}'?` : ''
			throw new BindingError(`Invalid ${type} sub tree: Entity '${entityName}' doesn't exist. ${didYouMean}`)
		}
		return entity
	}

	private static assertColumnValid(environment: Environment, fieldName: string): SchemaColumn {
		return this.assertFieldValid(environment, fieldName, (field): field is SchemaColumn => field.__typename === '_Column', 'an ordinary field')
		// TODO check that defaultValue matches the type
		// TODO run custom validators
	}

	private static assertFieldValid<T extends SchemaField>(environment: Environment, fieldName: string, matcher: (field: SchemaField) => field is T, expectedDescription: string): T {
		const treeLocation = environment.getTreeNode()
		const entity = treeLocation.entity
		const field = entity.fields.get(fieldName)
		if (!field) {
			const alternative = this.recommendAlternative(
				fieldName,
				Array.from(entity.fields)
					.filter(([, field]) => matcher(field))
					.map(([fieldName]) => fieldName),
			)
			const didYouMean = alternative ? `Did you mean '${alternative}'?` : ''
			throw new BindingError(`Field '${fieldName}' doesn't exist on ${this.describeLocation(environment)}. ${didYouMean}`)
		}
		if (!matcher(field)) {
			const actual = field.__typename === '_Column' ? 'an ordinary field' : `a ${field.type} relation`
			throw new BindingError(
				`Invalid field: the name '${field.name}' on ${this.describeLocation(environment)} ` +
				`refers to ${actual} but is being used as a ${expectedDescription}.`,
			)
		}
		return field
	}

	private static describeLocation(environment: Environment): string {
		const path = []
		for (let env = environment;; env = env.getParent()) {
			const node = env.getTreeNode()
			if (node.type === 'subtree-entity' || node.type === 'subtree-entity-list') {
				const pathText = path.length ? ` in path ${path.join('.')}` : ''
				return `entity '${node.entity.name}'${pathText}`
			}
			path.push(node.field.name)
		}
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
