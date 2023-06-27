import { useClassName } from '@contember/utilities'
import { ReactNode, memo } from 'react'
import type { Size } from '../../types'
import { toEnumViewClass } from '../../utils'

/** @deprecated use new logo from `@contember/brand` package */
export interface LogoSymbolProps {
	className?: string
	children: ReactNode
	size?: Size | number
}

/**
 * @group UI
 * @deprecated use new logo from `@contember/brand` package
 */
export const LogoSymbol = memo(({ className, children, size }: LogoSymbolProps) => {
	return (
		<div
			className={useClassName('logo-symbol', [
				typeof size === 'string' ? toEnumViewClass(size) : undefined,
				className,
			])}
			style={typeof size === 'number' ? { fontSize: `${size >= 0 ? size : 1}em` } : undefined}
		>
			{children}
		</div>
	)
})

LogoSymbol.displayName = 'LogoSymbol'
