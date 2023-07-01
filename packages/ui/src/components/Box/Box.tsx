import { useClassNameFactory } from '@contember/utilities'
import { forwardRef, memo, ReactNode } from 'react'
import type { BoxDistinction, Default, HTMLDivElementProps, Intent, Size } from '../../types'
import { toEnumViewClass, toStateClass, toThemeClass } from '../../utils'
import { Stack, StackProps } from '../Stack'
import { Label } from '../Typography/Label'
import { deprecate } from '@contember/utilities'

export interface BoxOwnProps {
	actions?: ReactNode
	children?: ReactNode
	distinction?: BoxDistinction
	direction?: StackProps['direction']
	footer?: ReactNode
	gap?: Size | 'none'
	/** @deprecated use `header` instead and wrap your content in `Label` as `header` is not fully backward compatible */
	heading?: ReactNode
	header?: ReactNode
	isActive?: boolean
	intent?: Intent
	padding?: Default | 'no-padding' | 'with-padding'
}

export type BoxProps =
	& BoxOwnProps
	& HTMLDivElementProps

/**
 * The `Box` component is a container that can be used to wrap other components.
 *
 * @example
 * ```
 * <Box />
 * ```
 *
 * @group UI
 */
export const Box = memo(forwardRef<HTMLDivElement, BoxProps>(({
	actions,
	children,
	className,
	direction = 'vertical',
	distinction,
	gap = 'small',
	heading,
	header,
	footer,
	intent,
	isActive,
	padding,
	...divProps
}: BoxProps, ref) => {
	header = deprecate('1.3.0', '`Box.heading` prop', '`Box.header` prop', heading && <Label>{heading}</Label>, header)

	const componentClassName = useClassNameFactory('box')

	return (
		<div
			{...divProps}
			className={componentClassName(null, [
				toStateClass('active', isActive),
				toEnumViewClass(distinction),
				toThemeClass(intent, intent),
				toEnumViewClass(padding),
				className,
			])}
			ref={ref}
		>
			<Stack gap={gap} direction={direction}>
				{(header || actions) && (
					<div className={componentClassName('header')}>
						{header}
						{actions && (
							<div className={componentClassName('actions')} contentEditable={false}>
								{actions}
							</div>
						)}
					</div>
				)}
				{children}
				{footer && (
					<div className={componentClassName('footer')}>
						{footer}
					</div>
				)}
			</Stack>
		</div>
	)
}))
Box.displayName = 'Box'
