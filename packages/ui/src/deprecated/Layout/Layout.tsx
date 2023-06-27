import { useClassName } from '@contember/utilities'
import { memo } from 'react'
import { LayoutChrome, LayoutChromeProps } from './LayoutChrome'

/** @deprecated Use `LayoutKit` from `@contember/layout` instead. */
export interface LayoutProps extends LayoutChromeProps {
	className?: string
}

/**
 * The `Layout` component is a component that builds main layout of the admin.
 *
 * @example
 * ```
 * <Layout
 *   sidebarHeader="Project name"
 *   navigation={
 *     <Menu>
 *       <Menu.Item title="Articles" to="articleList"/>
 *     </Menu>
 *   }
 * />
 * ```
 *
 * @group Layout UI
 * @deprecated Use `LayoutKit` from `@contember/layout` instead.
 */
export const Layout = memo(({
	className: classNameProp,
	children,
	sidebarHeader,
	sidebarFooter,
	switchers,
	navigation,
	scheme,
	theme,
	themeContent,
	themeControls,
	pageScheme,
	pageTheme,
	pageThemeContent,
	pageThemeControls,
	titleScheme,
	titleTheme,
	titleThemeContent,
	titleThemeControls,
}: LayoutProps) => {
	let fallbackScheme: LayoutProps['scheme'] | undefined = undefined

	const className = useClassName(['layout', 'legacy-layout'], classNameProp)

	const classNameDefinesTheme = className?.match(/cui-theme/) && className.match(/theme-\w+-\w+/)
	const classNameDefinesScheme = className?.match(/scheme-\w+/)

	if (classNameDefinesTheme && classNameDefinesScheme) {
		fallbackScheme = undefined
	} else {
		if (import.meta.env.DEV && (classNameDefinesScheme || classNameDefinesTheme)) {
			// throw new Error('Layout: className must define both scheme and theme or neither of them.')
		}

		fallbackScheme = 'light'
	}

	return (
		<div className={className}>
			<LayoutChrome
				sidebarHeader={sidebarHeader}
				sidebarFooter={sidebarFooter}
				navigation={navigation}
				switchers={switchers}
				scheme={scheme}
				theme={theme}
				themeContent={themeContent}
				themeControls={themeControls}
				pageScheme={pageScheme}
				pageTheme={pageTheme}
				pageThemeContent={pageThemeContent}
				pageThemeControls={pageThemeControls}
				titleScheme={titleScheme}
				titleTheme={titleTheme}
				titleThemeContent={titleThemeContent}
				titleThemeControls={titleThemeControls}
			>
				{children}
			</LayoutChrome>
		</div>
	)
})
