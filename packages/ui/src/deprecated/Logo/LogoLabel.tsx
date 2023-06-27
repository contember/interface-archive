import { useClassName } from '@contember/utilities'
import { ReactNode, memo } from 'react'
import { Size } from '../../types'
import { toEnumViewClass } from '../../utils'

/** @deprecated use new logo from `@contember/brand` package */
export interface LogoLabelProps {
	className?: string
	children: ReactNode
	size?: Size | number
}

/**
 * @group UI
 * @deprecated use new logo from `@contember/brand` package
 */
export const LogoLabel = memo(({ className, children, size }: LogoLabelProps) => {
	return (
		<div
			className={useClassName('logo-label', [
				typeof size === 'string' ? toEnumViewClass(size) : undefined,
				className,
			])}
			style={typeof size === 'number' ? { fontSize: `${size >= 0 ? size : 1}em` } : undefined}
		>{children}</div>
	)
})
