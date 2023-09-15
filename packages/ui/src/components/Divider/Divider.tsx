import { useClassName } from '@contember/react-utils'
import { ComponentClassNameProps, dataAttribute, deprecate, fallback } from '@contember/utilities'
import { memo } from 'react'
import { useSeparator } from 'react-aria'
import { HTMLDivElementProps, Size } from '../../types'
import { StackOwnProps } from '../Stack'

/** @deprecated Use other prop values */
export type DeprecatedDividerSize = Size | 'xlarge' | 'none'

export interface DividerOwnProps extends ComponentClassNameProps {
	/**
	 * A divider adds gap between siblings by default. Set to `false` to disable this behavior or change the gap size with the `gap` prop.
	 */
	gap?: StackOwnProps['gap']
	padding?: StackOwnProps['gap']
}

/** @deprecated Use `DividerOwnProps` instead */
export interface DeprecatedDividerProps {
	gap?: DividerOwnProps['gap'] | DeprecatedDividerSize
}

export type DividerProps =
	& Omit<HTMLDivElementProps, keyof DividerOwnProps | keyof DeprecatedDividerProps>
	& Omit<DividerOwnProps, keyof DeprecatedDividerProps>
	& DeprecatedDividerProps

/**
 * @group UI
 *
 * @example
 *
 * ```tsx
 * <Button>One</Button>
 * <Divider />
 * <Button>two</Button>
 * ```
 *
 * @example
 * Divider without a gap:
 * ```tsx
 * <Button>One</Button>
 * <Divider gap={false} />
 * <Button>two</Button>
 * ```
 *
 */
export const Divider = memo(({ className, componentClassName = 'divider', gap = true, padding, ...rest }: DividerProps) => {
	deprecate('1.3.0', gap === 'none', '`gap="none"`', '`gap={false}`')
	gap = fallback(gap, gap === 'none', false)

	deprecate('1.3.0', gap === 'small', '`gap="small"`', '`gap="gap"`')
	gap = fallback(gap, gap === 'small', 'gap')

	deprecate('1.3.0', gap === 'xlarge', '`gap="xlarge"`', '`gap="larger"`')
	gap = fallback(gap, gap === 'xlarge', 'larger')

	deprecate('1.3.0', gap === 'default', '`gap="default"`', 'omit the `gap` prop')
	gap = fallback(gap, gap === 'default', true)

	return (
		<div
			{...useSeparator(separatorConfigProps).separatorProps}
			{...rest}
			data-gap={dataAttribute(gap)}
			data-padding={dataAttribute(padding)}
			className={useClassName(componentClassName, className)}
		/>
	)
})
Divider.displayName = 'Interface.Divider'

// NOTE:
// 1. We don't use `orientation` prop because we adapt to the parent's
//    container orientation and we don't know it here. We could use
//    `useLayoutEffect` or React context to get the orientation
//    of the parent, but that might be a little bit unnecessary.
// 2. We hardcode the `elementType` to `div` because we don't use
//    polymorphic component here.
const separatorConfigProps = { elementType: 'div', orientation: undefined }
