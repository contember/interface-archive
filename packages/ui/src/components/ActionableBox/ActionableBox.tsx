import { useClassNameFactory } from '@contember/utilities'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { MouseEvent as ReactMouseEvent, ReactNode, memo, useMemo } from 'react'
import { HTMLDivElementProps } from '../../types'
import { Box } from '../Box'
import { Dropdown, DropdownProps } from '../Dropdown/Dropdown'
import { Button, ButtonOwnProps } from '../Forms'

export type ActionableBoxProps =
	& {
		editContents?: ReactNode
		onRemove?: (e: ReactMouseEvent<HTMLButtonElement>) => void
		children: ReactNode
	}
	& HTMLDivElementProps

const commonButtonProps: ButtonOwnProps = {
	size: 'small',
	flow: 'circular',
}

/**
 * @group UI
 */
export const ActionableBox = memo<ActionableBoxProps>(({
	className,
	children,
	editContents,
	onRemove,
	...divProps
}) => {
	const buttonProps: DropdownProps['buttonProps'] = useMemo(() => ({
		...commonButtonProps,
		children: <PencilIcon />,
	}), [])

	const componentClassName = useClassNameFactory('actionableBox')

	if (editContents === undefined && onRemove === undefined) {
		return <>{children}</>
	}

	return (
		<Box
			{...divProps}
			className={componentClassName(null, className)}
		>
			<div className={componentClassName('contents')}>{children}</div>
			<ul className={componentClassName('actions')} contentEditable={false}>
				{editContents && (
					<li className={componentClassName('action')}>
						<Dropdown buttonProps={buttonProps}>
							<>{editContents}</>
						</Dropdown>
					</li>
				)}
				{onRemove && (
					<li className={componentClassName('action')}>
						<Button intent="danger" {...commonButtonProps} onClick={onRemove}>
							<Trash2Icon />
						</Button>
					</li>
				)}
			</ul>
		</Box>
	)
})
ActionableBox.displayName = 'ActionableBox'
