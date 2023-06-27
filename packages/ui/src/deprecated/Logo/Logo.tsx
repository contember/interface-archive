import { useClassName } from '@contember/utilities'
import type { ReactNode } from 'react'
import type { Size } from '../../types'
import { LogoLabel } from './LogoLabel'
import { LogoSymbol } from './LogoSymbol'

/** @deprecated use new logo from `@contember/brand` package */
export interface LogoProps {
	children?: ReactNode
	image?: ReactNode
	size?: Size | number
}

/**
 * @group UI
 * @deprecated use new logo from `@contember/brand` package
*/
export function Logo({ children, image, size }: LogoProps) {
	return (
		<div className={useClassName('logo')}>
			{image && <LogoSymbol size={size}>{image}</LogoSymbol>}
			{children && <LogoLabel size={size}>{children}</LogoLabel>}
		</div>
	)
}
Logo.displayName = 'Logo'
