import { useExpectSameValueReference } from '@contember/react-utils'
import { px, useClassName } from '@contember/utilities'
import { CSSProperties, ReactNode, memo, useMemo } from 'react'
import { HTMLDivElementProps } from '../../types'

export type StickyContainerProps =
	& {
		bottom?: number;
		children?: ReactNode;
		left?: number;
		right?: number;
		top?: number;
	}
	& HTMLDivElementProps

export const StickyContainer = memo(({
	bottom,
	className: classNameProp,
	children,
	left,
	right,
	style: styleProp,
	top,
	...rest
}: StickyContainerProps) => {
	useExpectSameValueReference(styleProp)

	const style: CSSProperties = useMemo(() => ({
		'--cui-sticky-container-left': px(left),
		'--cui-sticky-container-right': px(right),
		'--cui-sticky-container-bottom': px(bottom),
		'--cui-sticky-container-top': px(top),
		...styleProp,
	}), [bottom, left, right, styleProp, top])

	return (
		<div
			{...rest}
			className={useClassName('sticky-container', classNameProp)}
			style={style}
		>
			{children}
		</div>
	)
})
StickyContainer.displayName = 'Interface.StickyContainer'
