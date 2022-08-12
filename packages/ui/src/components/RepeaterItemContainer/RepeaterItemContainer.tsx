import { ComponentType, memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { Size } from '../../types'
import { Box } from '../Box'
import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { ComponentStyleSheet, PropsWithClassName, SubComponentsStyleSheet, useResolveStyleSheet } from '../StyleSheet'
import { Label } from '../Typography/Label'
export interface RepeaterItemContainerProps extends PropsWithClassName<RepeaterItemContainerStyleSheet> {
	gap?: Size
	label?: ReactNode
	actions?: ReactNode
	children: ReactNode
	dragHandleComponent?: ComponentType<{ children: ReactNode }>
}

export const RepeaterItemContainer = memo(({ actions, className: classNameProp, children, gap, label, dragHandleComponent: Handle }: RepeaterItemContainerProps) => {
	const [className, styleSheet] = useResolveStyleSheet(repeaterItemContainerStyleSheet, {
		$prefix: useClassNamePrefix(),
		$sortable: !!Handle,
	}, classNameProp)

	return (
		<Box
			gap={gap}
			className={className}
		>
			{Handle && (
				<div className={styleSheet.handle}>
					<Handle>
						<Icon blueprintIcon="drag-handle-vertical" />
					</Handle>
				</div>
			)}
			{(label || actions) && <div className={styleSheet.header}>
				{label && (
					<div className={styleSheet.label}>
						<Label>
							{label}
						</Label>
					</div>
				)}
				{actions && <div className={styleSheet.actions}>{actions}</div>}
			</div>}
			<Stack
				className={styleSheet.content}
				direction="vertical"
				gap={gap}
			>
				{children}
			</Stack>
		</Box>
	)
})
RepeaterItemContainer.displayName = 'RepeaterItemContainer'

export type RepeaterItemContainerStyleSheet = ComponentStyleSheet<SubComponentsStyleSheet<
	| 'handle'
	| 'header'
	| 'label'
	| 'actions'
	| 'content'
>> & Partial<{
	'$componentClassName': string
	$prefix: string
	$name: string
	$sortable: boolean
}>

const repeaterItemContainerStyleSheet: RepeaterItemContainerStyleSheet = {
	$sortableClassName: 'sortable:$sortable',
	$componentClassName: '$prefix$name',
	$: '$componentClassName $sortableClassName',
	$prefix: 'cui-',
	$name: 'repeater-item-container',
	$sortable: undefined,
	handle: '$componentClassName-handle',
	header: '$componentClassName-header',
	label: '$componentClassName-label',
	actions: '$componentClassName-actions',
	content: '$componentClassName-content',
}
