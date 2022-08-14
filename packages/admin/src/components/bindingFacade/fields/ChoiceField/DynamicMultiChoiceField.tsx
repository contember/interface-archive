import { Component, EntityAccessor, HasMany, HasOne, SugaredField } from '@contember/binding'
import type { FunctionComponent } from 'react'
import type { ChoiceFieldData } from './ChoiceFieldData'
import { DynamicMultipleChoiceFieldProps, useDynamicMultipleChoiceField } from './hooks/useDynamicMultipleChoiceField'
import { renderDynamicChoiceFieldStatic } from './renderDynamicChoiceFieldStatic'
import { useDynamicMultipleChoiceWithConnectingEntityField } from './hooks/useDynamicMultipleChoiceWithConnectingEntityField'

export const DynamicMultiChoiceField: FunctionComponent<DynamicMultipleChoiceFieldProps & ChoiceFieldData.MultiChoiceFieldProps<EntityAccessor>> =
	Component(
		props => {
			const choiceFieldMetadata = 'connectingEntityField' in props && props.connectingEntityField
				? useDynamicMultipleChoiceWithConnectingEntityField(props)
				: useDynamicMultipleChoiceField(props)
			return props.children(choiceFieldMetadata)
		},
		(props, environment) => {
			let { subTree, renderedOption } = renderDynamicChoiceFieldStatic(props, environment)

			if ('connectingEntityField' in props && props.connectingEntityField) {
				const hasOneProps = typeof props.connectingEntityField === 'string'
					? { field: props.connectingEntityField }
					: props.connectingEntityField

				renderedOption = <>
					<HasOne {...hasOneProps}>
						{renderedOption}
					</HasOne>
				</>
			}

			return (
				<>
					{subTree}
					<HasMany field={props.field} expectedMutation="connectOrDisconnect" initialEntityCount={0}>
						{props.sortableBy && <SugaredField field={props.sortableBy} />}
						{renderedOption}
					</HasMany>
				</>
			)
		},
		'DynamicMultiChoiceField',
	)
