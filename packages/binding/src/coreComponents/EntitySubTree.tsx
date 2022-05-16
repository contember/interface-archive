import { whereToFilter } from '@contember/client'
import { useConstantValueInvariant } from '@contember/react-utils'
import { ReactElement, ReactNode, useCallback } from 'react'
import { useAccessorUpdateSubscription, useEntitySubTreeParameters, useGetEntitySubTree } from '../accessorPropagation'
import { SetOrderFieldOnCreate, SetOrderFieldOnCreateOwnProps } from '../accessorSorting'
import { NIL_UUID, PRIMARY_KEY_NAME } from '../bindingTypes'
import { Environment } from '../dao'
import { MarkerFactory, QueryLanguage } from '../queryLanguage'
import type {
	SugaredQualifiedSingleEntity,
	SugaredUnconstrainedQualifiedSingleEntity,
	TreeRootId,
} from '../treeParameters'
import { Component } from './Component'
import { Entity } from './Entity'
import { Field } from './Field'

export interface EntitySubTreeAdditionalProps {
	variables?: Environment.ValuesMapWithFactory
}

export type EntitySubTreeAdditionalCreationProps = {} | SetOrderFieldOnCreateOwnProps

export type EntitySubTreeProps<EntityProps> =
	& {
		treeRootId?: TreeRootId
		children?: ReactNode
	}
	& EntitySubTreeAdditionalProps
	& (
		| SugaredQualifiedSingleEntity
		| (SugaredUnconstrainedQualifiedSingleEntity & EntitySubTreeAdditionalCreationProps)
	)

export const EntitySubTree = Component(
	<EntityProps extends {}>(props: EntitySubTreeProps<EntityProps>) => {
		useConstantValueInvariant(props.isCreating, 'EntitySubTree: cannot update isCreating')

		const getSubTree = useGetEntitySubTree()
		const parameters = useEntitySubTreeParameters(props)
		const getAccessor = useCallback(
			() => getSubTree(parameters, props.treeRootId),
			[getSubTree, parameters, props.treeRootId],
		)
		const accessor = useAccessorUpdateSubscription(getAccessor)

		// TODO revive top-level hasOneRelationPath
		// {parameters.value.hasOneRelationPath.length ? (
		// 	<HasOne field={parameters.value.hasOneRelationPath}>{props.children}</HasOne>
		// ) : (
		// 	props.children
		// )}
		return <Entity {...props} accessor={accessor} />
	},
	{
		generateBranchMarker: (props, fields, environment) => {
			if ('isCreating' in props && props.isCreating) {
				return MarkerFactory.createUnconstrainedEntitySubTreeMarker(props, fields, environment)
			}
			return MarkerFactory.createEntitySubTreeMarker(props, fields, environment)
		},
		staticRender: props => (
			<>
				<Entity {...props} accessor={0 as any}>
					<Field field={PRIMARY_KEY_NAME} />
					{props.children}
				</Entity>
				{props.isCreating && 'orderField' in props && (
					<SetOrderFieldOnCreate
						orderField={props.orderField}
						newOrderFieldValue={props.newOrderFieldValue}
						entity={props.entity}
					/>
				)}
			</>
		),
		generateEnvironment: (props, oldEnvironment) => {
			const newEnvironment = oldEnvironment.withVariables(props.variables)

			if (props.isCreating) {
				const rootWhere = { id: NIL_UUID } as const
				const qualifiedSingleEntity = QueryLanguage.desugarUnconstrainedQualifiedSingleEntity(props, newEnvironment)
				return newEnvironment.withSubtree({
					filter: whereToFilter(rootWhere),
					expectedCardinality: 'zero',
					entity: qualifiedSingleEntity.entityName,
					type: 'entity',
				})
			}
			const qualifiedSingleEntity = QueryLanguage.desugarQualifiedSingleEntity(props, newEnvironment, { missingSetOnCreate: 'fill' })
			return newEnvironment.withSubtree({
				filter: whereToFilter(qualifiedSingleEntity.where),
				expectedCardinality: qualifiedSingleEntity.setOnCreate ? 'zero-or-one' : 'one',
				entity: qualifiedSingleEntity.entityName,
				type: 'entity',
			})
		},
	},
	'EntitySubTree',
) as <EntityProps>(pros: EntitySubTreeProps<EntityProps>) => ReactElement
