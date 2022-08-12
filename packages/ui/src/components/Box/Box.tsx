import { forwardRef, memo, ReactNode } from 'react'
import type { BoxDistinction, Default, Intent, NativeProps, Size } from '../../types'
import { toThemeClass } from '../../utils'
import { Stack, StackProps } from '../Stack'
import { ComponentStyleSheet, SubComponentsStyleSheet, useResolveStyleSheet } from '../StyleSheet'
import { Label } from '../Typography/Label'

export interface BoxOwnProps {
	actions?: ReactNode
	children?: ReactNode
	distinction?: BoxDistinction
	direction?: StackProps['direction']
	gap?: Size | 'none'
	heading?: ReactNode
	isActive?: boolean
	intent?: Intent
	padding?: Default | 'no-padding' | 'with-padding'
}

export interface BoxProps extends BoxOwnProps, Omit<NativeProps<HTMLDivElement>, 'children'> { }

export const Box = memo(
	forwardRef<HTMLDivElement, BoxProps>(
		({
			actions,
			children,
			className: classNameProp,
			direction = 'vertical',
			distinction,
			gap = 'small',
			heading,
			intent,
			isActive,
			padding,
			...divProps
		}: BoxProps, ref) => {
			const [className, styleSheet] = useResolveStyleSheet(boxStyleSheet, {
				$active: isActive,
				$distinction: distinction,
				$intent: toThemeClass(intent, intent),
				$padding: padding,
			}, classNameProp)

			return (
				<div
					{...divProps}
					className={className}
					ref={ref}
				>
					<Stack className={styleSheet.inner} gap={gap} direction={direction}>
						{(heading || actions) && (
							<div className={styleSheet.header}>
								{heading && <Label className={styleSheet.heading}>{heading}</Label>}
								{actions && (
									<div className={styleSheet.actions} contentEditable={false}>
										{actions}
									</div>
								)}
							</div>
						)}
						{children}
					</Stack>
				</div>
			)
		},
	),
)
Box.displayName = 'Box'

type BoxStyleSheet = ComponentStyleSheet<SubComponentsStyleSheet<'inner' | 'header' | 'heading' | 'actions'>> & Partial<{
	$prefix: string
	$name: string
	$componentClassName: string
	$activeClassName: string
	$distinctionClassName: string
	$intentClassName: string
	$paddingClassName: string
	$active: boolean
	$distinction: BoxDistinction
	$intent: string
	$padding: Default | 'no-padding' | 'with-padding'
}>

const boxStyleSheet: BoxStyleSheet = {
	$componentClassName: '$prefix$name',
	$activeClassName: 'is-$active',
	$distinctionClassName: 'view-$distinction',
	$intentClassName: '$intent',
	$paddingClassName: 'view-$padding',
	$: [
		'$componentClassName',
		'$activeClassName',
		'$distinctionClassName',
		'$intentClassName',
		'$paddingClassName',
	],
	$prefix: 'cui-',
	$name: 'box',
	inner: '$componentClassName-inner',
	header: '$componentClassName-header',
	heading: '$componentClassName-heading',
	actions: '$componentClassName-actions',
}
