import { memo, useLayoutEffect, useRef } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { NativeProps } from '../../types'
import { useSectionTabsRegistration } from '../SectionTabs'
import { Stack } from '../Stack'

const metaTabPositionCache: { [key: string]: CSSStyleDeclaration['position'] } = {}

function isMetaTabSticky (element: HTMLDivElement): boolean {
	const offsetTop = element.offsetTop
	const offsetHeight = element.offsetHeight

	const layoutHash = `${offsetTop}:${offsetHeight}`

	if (!metaTabPositionCache[layoutHash]) {
		metaTabPositionCache[layoutHash] = getComputedStyle(element).position
	}

	return metaTabPositionCache[layoutHash] === 'sticky'
}

const metaTab = {
	id: 'meta-section-aside',
	label: 'Meta',
	isMeta: true,
}

export const LayoutPageAside = memo(({ children }: NativeProps<HTMLDivElement>) => {
	const componentClassName = `${useClassNamePrefix()}layout-page-aside`
	const [registerTab, unregisterTab] = useSectionTabsRegistration()
	const element = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		const tabRegistration = () => {
			if (element.current) {
				if (!isMetaTabSticky(element.current)) {
					registerTab(metaTab)
				} else {
					unregisterTab(metaTab)
				}
			} else {
				console.error('Missing element')
			}
		}

		window.addEventListener('resize', tabRegistration)
		tabRegistration()

		return () => {
			unregisterTab(metaTab)
			window.removeEventListener('resize', tabRegistration)
		}
	})

	return <div ref={element} id={metaTab.id} className={componentClassName}>
		<Stack gap="large" direction="vertical" className={`${componentClassName}-content`}>
			{children}
		</Stack>
	</div>
})
LayoutPageAside.displayName = 'LayoutPageAside'
