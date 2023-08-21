import { useClassName } from '@contember/react-utils'
import { Stack } from '@contember/ui'
import { stateDataAttributes } from '@contember/utilities'
import { forwardRef, memo, useMemo } from 'react'
import { HorizontalMenuItem } from './HorizontalMenuItem'
import { HorizontalMenuContext, defaultHorizontalMenuProps, useHorizontalMenuContext } from './contexts'
import { HorizontalMenuContainerProps } from './types'

const HorizontalMenuContainer = memo(forwardRef<HTMLDivElement, HorizontalMenuContainerProps>((props, forwardedRef) => {
	const horizontalMenuContext = useHorizontalMenuContext()
	const mergedProps = { ...defaultHorizontalMenuProps, ...horizontalMenuContext, ...props }

	const {
		children,
		className,
		componentClassName,
		horizontal,
		itemsContentHorizontal,
		itemsIconsScale,
		itemsSizeEvenly,
		compact,
		style,
		hover,
		...rest
	} = mergedProps

	return (
		<HorizontalMenuContext.Provider value={mergedProps}>
			<Stack
				ref={forwardedRef}
				{...stateDataAttributes({ compact, itemsSizeEvenly, itemsIconsScale, itemsContentHorizontal, hover })}
				className={useClassName(componentClassName, className)}
				horizontal={horizontal}
				gap="gap"
				style={useMemo(() => ({
					...style,
					'--cui-horizontal-menu--icons-scale': itemsIconsScale,
				}), [itemsIconsScale, style])}
				{...rest}
			>
				{children}
			</Stack>
		</HorizontalMenuContext.Provider>
	)
}))
HorizontalMenuContainer.displayName = 'Menu'

export const Menu = Object.assign(HorizontalMenuContainer, {
	Item: HorizontalMenuItem,
})
