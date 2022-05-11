import classNames from 'classnames'
import { memo, MouseEvent, ReactNode } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { NativeProps } from '../../types'
import { toEnumViewClass, toFeatureClass } from '../../utils'
import { VisuallyDependentControlProps } from '../Forms'
import { useInputClassName } from '../Forms/useInputClassName'
import { Label } from '../Typography'

const CardInner = ({
	className,
	children,
	src,
}: {
	className: string,
	children: ReactNode,
	src?: string | null,
}) => (
	<div className={`${className}-inner`}>
		<div
			className={`${className}-thumbnail`}
			style={{ backgroundImage: src ? `url('${encodeURI(src)}')` : undefined }}
		/>
		<div className={`${className}-content`}>
			<Label>{children}</Label>
		</div>
	</div>
)

interface LinkCompatibleProps {
	active: boolean
	href: string
	onClick: (e?: MouseEvent<HTMLAnchorElement>) => void
}

export type CommonCardProps =
	& VisuallyDependentControlProps
	& {
		// onRemove?: () => void // TODO: Implement when Actionable box is enhanced
		// onEdit?: () => void // TODO: Implement when Actionable box is enhanced
		src?: string | null
		children?: ReactNode
		layout?: 'label-below' | 'label-inside'
	}

export type CardProps =
	& Omit<CommonCardProps, 'type'>
	& Omit<NativeProps<HTMLDivElement>, 'onClick'>
	& {
		href?: never
		onClick?: never
	}

export type LinkCardProps =
	& Omit<CommonCardProps, 'active' | 'type'>
	& Omit<NativeProps<HTMLAnchorElement>, 'href' | 'onClick'>
	& LinkCompatibleProps

export const LinkCard = memo<LinkCardProps>(
	({
		children,
		className: _className,
		layout = 'label-below',
		src,
		...props
	}) => {
		const componentClassName = useComponentClassName('card')
		const className = classNames(
			componentClassName,
			toEnumViewClass(layout),
			toFeatureClass('hover', true),
			toFeatureClass('press', true),
			toFeatureClass('focus', true),
			useInputClassName(props as VisuallyDependentControlProps),
			_className,
		)

		return (
			<a {...props} className={className}>
				<CardInner src={src} className={componentClassName}>{children}</CardInner>
			</a>
		)
	},
)
LinkCard.displayName = 'LinkCard'

export const Card = memo<CardProps>(
	({
		children,
		className: _className,
		layout = 'label-below',
		src,
		...props
	}) => {
		const componentClassName = useComponentClassName('card')
		const className = classNames(
			componentClassName,
			toEnumViewClass(layout),
			useInputClassName(props as VisuallyDependentControlProps),
			_className,
		)

		return (
			<div {...props} className={className}>
				<CardInner src={src} className={componentClassName}>{children}</CardInner>
			</div>
		)
	},
)
