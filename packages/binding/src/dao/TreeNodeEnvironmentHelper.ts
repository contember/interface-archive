import { Environment } from './Environment'
import {
	HasOneRelation,
	SugaredRelativeEntityList,
	SugaredRelativeSingleEntity,
	SugaredRelativeSingleField,
} from '../treeParameters'
import { QueryLanguage } from '../queryLanguage'
import { BindingError } from '../BindingError'

export class TreeNodeEnvironmentHelper {
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
		TreeNodeEnvironmentHelper.assertRelationType(hasOneEnvironment, hasManyField, 'many', false)

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
		return hasOneEnvironment.withTreeChild({ field: relativeSingleField.field })
	}

	private static traverseHasOnePath(
		environment: Environment,
		hasOneRelationPath: HasOneRelation[],
	): Environment {
		for (const field of hasOneRelationPath) {
			TreeNodeEnvironmentHelper.assertRelationType(environment, field.field, 'one', !!field.reducedBy)
			environment = environment.withTreeChild({ field: field.field })
		}
		return environment
	}

	private static assertRelationType(environment: Environment, field: string, type: 'many' | 'one', isReduced: boolean) {
		const schema = environment.getSchema()
		const relation = schema.getEntityField(environment.getSubtreeLocation().entity, field)
		const treeLocation = environment.getSubtreeLocation()
		if (!relation) {
			throw new BindingError(`Field ${field} does not exist on entity ${treeLocation.entity} in path ${[...treeLocation.path].join('.')}.`)
		}

		if (type === 'one' && (relation.type !== 'OneHasOne' && relation.type !== 'ManyHasOne') && !isReduced) {
			throw new BindingError() // todo
		} else if (type === 'many' && (relation.type !== 'OneHasMany' && relation.type !== 'ManyHasMany')) {
			throw new BindingError() // todo
		}
	}
}
