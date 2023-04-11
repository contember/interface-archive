import { ElementType, forwardRef, memo, useRef } from 'react'
import { classNameForFactory } from '../packages/class-name'
import { useComposeRef, useEvent } from '../packages/react-hooks'
import { PolymorphicRef } from '../packages/typescript-utilities'
import { Layout, LayoutPanelState, useClosePanelOnEscape, useGetLayoutPanelsStateContext, useSetLayoutPanelsStateContext } from '../packages/ui-layout'
import { MenuAutoCloseProvider } from '../packages/ui-menu-auto-close-provider'
import { CMSLayoutSidebarComponentType, CMSLayoutSidebarProps } from './Types'

export const Sidebar: CMSLayoutSidebarComponentType = memo(forwardRef(
	<C extends ElementType = 'section'>({
		as,
		children,
		className,
		componentClassName = 'cms-sidebar',
		keepVisible = false,
		panelName,
		width,
		priority,
	}: CMSLayoutSidebarProps<C>, forwardedRef: PolymorphicRef<C>) => {
		const classNameFor = classNameForFactory(componentClassName, className)

		const keepVisibleBehavior = useEvent(({ behavior }: LayoutPanelState) => {
			if (behavior !== 'modal') {
				return { visibility: 'visible' } as const
			}
		})

		const onEscapePress = useClosePanelOnEscape()

		const { hide } = useSetLayoutPanelsStateContext()
		const panelState = useGetLayoutPanelsStateContext().panels.get(panelName)

		const visibility = panelState?.visibility
		const behavior = panelState?.behavior

		const hideModal = useEvent(() => {
			if (behavior === 'modal' && visibility === 'visible') {
				hide(panelName)
			}
		})

		const elementRef = useRef<HTMLElement>(null)
		const composeRef = useComposeRef(forwardedRef, elementRef)

		return (
			<Layout.Panel
				as={as as any}
				ref={composeRef}
				basis={width}
				minWidth={width}
				maxWidth={width}
				className={classNameFor()}
				defaultBehavior="collapsible"
				defaultVisibility="visible"
				name={panelName}
				onBehaviorChange={keepVisible ? keepVisibleBehavior : undefined}
				onKeyPress={onEscapePress}
				onVisibilityChange={undefined}
				priority={priority}
			>
				<MenuAutoCloseProvider onAutoClose={hideModal}>
					{children}
				</MenuAutoCloseProvider>
			</Layout.Panel>
		)
	},
))
Sidebar.displayName = 'CMSLayout.Sidebar'
