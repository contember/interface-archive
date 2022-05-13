import { Environment } from './Environment'
import {
	HasOneRelation,
	SugaredRelativeEntityList,
	SugaredRelativeSingleEntity,
	SugaredRelativeSingleField,
} from '../treeParameters'
import { QueryLanguage } from '../queryLanguage'
import { BindingError } from '../BindingError'
import { Schema } from '../core/schema'

export class TreeNodeEnvironmentHelper {
	public static createEnvironmentForEntityList(
		sugaredRelativeEntityList: string | SugaredRelativeEntityList,
		environment: Environment,
	): Environment {
		const relativeEntityList = QueryLanguage.desugarRelativeEntityList(sugaredRelativeEntityList, environment)
		const schema = environment.getSchema()
		const treePosition = environment.getTreePosition()
		let [entityName, path] = TreeNodeEnvironmentHelper.traverseHasOnePath(
			relativeEntityList.hasOneRelationPath,
			schema,
			treePosition.nodeEntity,
		)
		const hasManyField = relativeEntityList.hasManyRelation.field
		const relation = schema.getEntityField(entityName, hasManyField)
		if (!relation) {
			throw new BindingError(`Field ${hasManyField} does not exist on entity ${entityName} in path ${[...treePosition.nodePath, ...path].join('.')}.`)
		}
		if (relation.__typename !== '_Relation' || (relation.type !== 'OneHasMany' && relation.type !== 'ManyHasMany')) {
			throw new BindingError() // todo
		}
		entityName = relation.targetEntity
		path.push(relativeEntityList.hasManyRelation.field)

		return environment.withTreeNode({
			nodeEntity: entityName,
			nodeType: 'list',
		}, path)
	}

	public static createEnvironmentForEntity(
		sugaredRelativeSingleEntity: string | SugaredRelativeSingleEntity,
		environment: Environment,
	) {
		const relativeSingleEntity = QueryLanguage.desugarRelativeSingleEntity(sugaredRelativeSingleEntity, environment)
		const [entityName, path] = TreeNodeEnvironmentHelper.traverseHasOnePath(
			relativeSingleEntity.hasOneRelationPath,
			environment.getSchema(),
			environment.getTreePosition().nodeEntity,
		)

		return environment.withTreeNode({
			nodeEntity: entityName,
			nodeType: 'entity',
		}, path)
	}


	public static createEnvironmentForField(
		sugaredRelativeSingleField: string | SugaredRelativeSingleField,
		environment: Environment,
	) {
		const relativeSingleField = QueryLanguage.desugarRelativeSingleField(sugaredRelativeSingleField, environment)
		const [entityName, path] = TreeNodeEnvironmentHelper.traverseHasOnePath(
			relativeSingleField.hasOneRelationPath,
			environment.getSchema(),
			environment.getTreePosition().nodeEntity,
		)

		return environment.withTreeNode({
			nodeEntity: entityName,
			nodeType: 'entity',
		}, path)
	}

	private static traverseHasOnePath(
		hasOneRelationPath: HasOneRelation[],
		schema: Schema,
		entityName: string,
	): [string, string[]] {
		const path = []
		for (const field of hasOneRelationPath) {
			const relation = schema.getEntityField(entityName, field.field)
			if (!relation) {
				throw new BindingError() // todo
			}
			if (relation.__typename !== '_Relation' || (relation.type !== 'OneHasOne' && relation.type !== 'ManyHasOne')) {
				throw new BindingError() // todo
			}
			entityName = relation.targetEntity
			path.push(field.field)
		}
		return [entityName, path]
	}
}
