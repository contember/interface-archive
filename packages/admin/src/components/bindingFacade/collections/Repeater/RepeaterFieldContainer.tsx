import type { EntityAccessor, EntityListAccessor } from '@contember/binding'
import { FieldContainer, Stack } from '@contember/ui'
import { memo, ReactNode } from 'react'
import type { MessageFormatter } from '../../../../i18n'
import { AccessorErrors } from '../../errors'
import { AddEntityButtonProps, CreateNewEntityButton, EmptyMessage, EmptyMessageOuterProps } from '../helpers'
import type { RepeaterDictionary } from './repeaterDictionary'

export type RepeaterFieldContainerPublicProps =
	& EmptyMessageOuterProps
	& AddEntityButtonProps
	& {
		enableAddingNew?: boolean
	}

export interface RepeaterFieldContainerPrivateProps extends FieldContainerOwnProps {
	accessor: EntityListAccessor
	entities: EntityAccessor[]
	formatMessage: MessageFormatter<RepeaterDictionary>
	isEmpty: boolean
	/**
	 * @deprecated Use label instead
	 */
	boxLabel?: ReactNode
	createNewEntity: (initialize?: EntityAccessor.BatchUpdatesHandler) => void
}

export type RepeaterFieldContainerProps =
	& RepeaterFieldContainerPublicProps
	& RepeaterFieldContainerPrivateProps

export const RepeaterFieldContainer = memo(
	({
		accessor,
		addButtonComponent: AddButton = CreateNewEntityButton,
		addButtonComponentExtraProps,
		addButtonProps,
		addButtonText,
		boxLabel,
		children,
		createNewEntity,
		direction = 'vertical',
		emptyMessage,
		emptyMessageComponent,
		enableAddingNew = true,
		entities,
		formatMessage,
		isEmpty,
		label,
		...rest
	}: RepeaterFieldContainerProps) => (
		<FieldContainer
			{...rest}
			direction={direction}
			footer={enableAddingNew && (
				<AddButton
					{...addButtonComponentExtraProps}
					{...addButtonProps}
					createNewEntity={createNewEntity}
				>
					{addButtonText ?? label ?? formatMessage('repeater.addButton.text')}
				</AddButton>
			)}
			label={ label ?? boxLabel}
			useLabelElement={ false}
		>
			<AccessorErrors accessor={accessor} />
			{isEmpty && (
				<EmptyMessage component={emptyMessageComponent}>{formatMessage(emptyMessage, 'repeater.emptyMessage.text')}</EmptyMessage>
			)}

			{isEmpty || children}

		</FieldContainer>
	),
)
RepeaterFieldContainer.displayName = 'RepeaterFieldContainer'
