import { px, useClassNameFactory } from '@contember/utilities'
import { ReactNode, memo, useEffect, useRef, useState } from 'react'
import { SectionTabs, TitleBar, TitleBarProps, useSectionTabs } from '../../components'
import { toEnumClass, toSchemeClass, toThemeClass } from '../../utils'
import { LayoutPageAside } from './LayoutPageAside'
import { LayoutPageContent, LayoutPageContentProps } from './LayoutPageContent'
import { useThemeScheme } from './ThemeSchemeContext'
import { ThemeScheme } from './Types'
import { useElementTopOffset } from './useElementTopOffset'

/** @deprecated Use `LayoutKit` from `@contember/layout` instead. */
export interface LayoutPageProps extends Omit<TitleBarProps, 'after' | 'children'>, ThemeScheme {
	afterTitle?: TitleBarProps['after']
	children?: ReactNode
	fit?: 'content' | 'none'
	pageContentLayout?: LayoutPageContentProps['pageContentLayout']
	side?: ReactNode
	title?: ReactNode
}

/**
 * @group Layout UI
 * @deprecated Use `LayoutKit` from `@contember/layout` instead.
 */
export const LayoutPage = memo(({
	actions,
	afterTitle,
	children,
	fit = 'content',
	navigation,
	pageContentLayout,
	side,
	title,
	...props
}: LayoutPageProps) => {
	const componentClassName = useClassNameFactory('layout-page')
	const {
		scheme,
		theme,
		themeContent,
		themeControls,
	} = useThemeScheme(props)

	const contentRef = useRef<HTMLDivElement>(null)
	const contentOffsetTop = useElementTopOffset(contentRef)
	const hasTabs = Object.keys(useSectionTabs()).length > 0

	const [showDivider, setShowDivider] = useState<boolean>(false)

	useEffect(() => {
		if (!document?.body?.parentElement) {
			return
		}

		const container = document.body.parentElement

		const scrollHandler = () => {
			const visibleWidth = container.offsetWidth
			const contentWidth = container.scrollWidth
			const scrollLeft = container.scrollLeft

			setShowDivider(contentWidth > visibleWidth && scrollLeft + visibleWidth < contentWidth)
		}

		scrollHandler()

		window.addEventListener('scroll', scrollHandler, { passive: true })

		return () => {
			window.removeEventListener('scroll', scrollHandler)
		}
	}, [])

	return (
		<div className={componentClassName(null, [
			toThemeClass(themeContent ?? theme, themeControls ?? theme),
			toSchemeClass(scheme),
		])}>
			<style>{`.cui-layout-chrome { --cui-content-offset-top: ${px(contentOffsetTop)};}`}</style>
			{(title || actions) && <TitleBar after={afterTitle === undefined ? hasTabs ? <SectionTabs /> : undefined : afterTitle} navigation={navigation} actions={actions}>
				{title}
			</TitleBar>}
			<div
				ref={contentRef}
				className={componentClassName('content-wrap', [
					toEnumClass('fit-', fit),
					showDivider ? 'view-aside-divider' : undefined,
				])}
			>
				<LayoutPageContent pageContentLayout={pageContentLayout}>
					{children}
				</LayoutPageContent>
				{side && <LayoutPageAside>{side}</LayoutPageAside>}
			</div>
		</div>
	)
})

LayoutPage.displayName = 'LayoutPage'
