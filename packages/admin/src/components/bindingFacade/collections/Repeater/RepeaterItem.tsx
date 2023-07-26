import { BindingError, RemovalType } from '@contember/binding'
import { RepeaterItemContainer, RepeaterItemContainerProps } from '@contember/ui'
import { memo, ReactNode } from 'react'
import { DeleteEntityButton } from '../helpers'

export interface RepeaterItemProps extends Omit<RepeaterItemContainerProps, 'children' | 'index' | 'label'> {
	label: ReactNode
	children: ReactNode
	canBeRemoved: boolean
	index: number
	dragHandleComponent?: RepeaterItemContainerProps['dragHandleComponent']
	removalType: RemovalType
}

export const RepeaterItem = memo(
	({ children, canBeRemoved, label, removalType, dragHandleComponent, index, ...rest }: RepeaterItemProps) => {
		if (removalType !== 'delete') {
			throw new BindingError(
				`As a temporary limitation, <Repeater /> can currently only delete its items, not disconnect them. ` +
				`This restriction is planned to be lifted sometime in future.`,
			)
		}

		return (
			<RepeaterItemContainer
				dragHandleComponent={dragHandleComponent}
				label={label}
				index={index}
				actions={canBeRemoved && <DeleteEntityButton inset />}
				{...rest}
			>
				{children}
			</RepeaterItemContainer>
		)
	},
)
RepeaterItem.displayName = 'RepeaterItem'
