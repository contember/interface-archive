import { BindingError, RemovalType } from '@contember/binding'
import { RepeaterItemContainer, RepeaterItemContainerProps } from '@contember/ui'
import { memo } from 'react'
import { DeleteEntityButton } from '../helpers'

export interface RepeaterItemProps {
	canBeRemoved: boolean
	children: RepeaterItemContainerProps['children']
	className?: RepeaterItemContainerProps['className']
	dragHandleComponent?: RepeaterItemContainerProps['dragHandleComponent']
	label: RepeaterItemContainerProps['label']
	removalType?: RemovalType
}

export const RepeaterItem = memo(
	({ children, className, canBeRemoved, label, removalType, dragHandleComponent }: RepeaterItemProps) => {
		if (removalType !== 'delete') {
			throw new BindingError(
				`As a temporary limitation, <Repeater /> can currently only delete its items, not disconnect them. ` +
				`This restriction is planned to be lifted sometime in future.`,
			)
		}
		return (
			<RepeaterItemContainer
				className={className}
				dragHandleComponent={dragHandleComponent}
				label={label}
				actions={canBeRemoved ? <DeleteEntityButton /> : undefined}
			>
				{children}
			</RepeaterItemContainer>
		)
	},
)
RepeaterItem.displayName = 'RepeaterItem'
