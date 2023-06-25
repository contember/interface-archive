import { useOnElementResize, useReferentiallyStableCallback, useScopedConsoleRef } from '@contember/react-utils'
import { assert, getSizeFromResizeObserverEntryFactory, isHTMLElement, pick } from '@contember/utilities'
import { CSSProperties, RefObject, useEffect, useMemo, useState } from 'react'
import { useContainerInsetsContext } from './Contexts'
import { getElementInsets } from './Helpers'
import { ContainerInsets, ContainerOffsets } from './Types'

const box = 'content-box'
const dimensionsFromEntry = getSizeFromResizeObserverEntryFactory(box)

export function useElementInsets(elementRef: RefObject<HTMLElement>) {
	const { log, logged } = useScopedConsoleRef('useElementInsets').current

	const containerInsets = useContainerInsetsContext()
	const [containerOffsets, setContainerOffsets] = useState<ContainerOffsets>()

	const updateContainerOffsets = useReferentiallyStableCallback((dimensions?: ReturnType<typeof dimensionsFromEntry>) => {
		if (elementRef.current) {
			const { width, height } = dimensions ?? {
				width: elementRef.current?.offsetWidth,
				height: elementRef.current?.offsetHeight,
			}

			if (height && width) {
				const element = logged('element', elementRef.current)
				const parentElement = logged('parentElement', element.parentElement)

				if (parentElement) {
					log('window', pick(window, ['innerWidth', 'innerHeight', 'scrollX', 'scrollY']))
					log('parentElement', parentElement, pick(parentElement, ['offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop']))
					log('element', element, pick(element, ['offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop']))

					const parentProps = logged('Parent props:', pickLayoutProperties(parentElement))
					const elementProps = logged('elementProps', pickLayoutProperties(element, parentProps.position as CSSProperties['position']))

					if (parentProps.display === 'flex') {
						const previous = logged('Previous element sibling with layout:', getPreviousElementSiblingWithLayout(element))
						const next = logged('Next element sibling with layout:', getNextElementSiblingWithLayout(element))

						let offsets = logged('calculated offsets', parentProps.position === 'static' ? {
							offsetBottom: Math.max(0, parentProps.scrollHeight - (parentProps.offsetTop - elementProps.offsetTop) - elementProps.offsetHeight),
							offsetLeft: Math.max(0, elementProps.offsetLeft - parentProps.offsetLeft),
							offsetRight: Math.max(0, parentProps.scrollWidth - (parentProps.offsetLeft - elementProps.offsetLeft) - elementProps.offsetWidth),
							offsetTop: Math.max(0, elementProps.offsetTop - parentProps.offsetTop),
						} : {
							offsetBottom: Math.max(0, parentProps.scrollHeight - elementProps.offsetTop - elementProps.offsetHeight),
							offsetLeft: Math.max(0, elementProps.offsetLeft),
							offsetRight: Math.max(0, parentProps.offsetWidth - elementProps.offsetLeft - elementProps.offsetWidth),
							offsetTop: Math.max(0, elementProps.offsetTop),
						})

						switch (parentProps.flexDirection) {
							case 'row':
								setContainerOffsets(logged('setContainerOffsets: flexDirection:row', {
									offsetLeft: previous ? offsets.offsetLeft : 0,
									offsetBottom: offsets.offsetBottom,
									offsetTop: offsets.offsetTop,
									offsetRight: next ? offsets.offsetRight : 0,
								}))
								break

							case 'column':
								setContainerOffsets(logged('setContainerOffsets: flexDirection:column', {
									offsetTop: previous ? offsets.offsetTop : 0,
									offsetLeft: offsets.offsetLeft,
									offsetRight: offsets.offsetRight,
									offsetBottom: next ? offsets.offsetBottom : 0,
								}))
								break

							default:
								throw new Error(`Not implemented flex-direction: ${parentProps.flexDirection}`)
						}
					} else {
						if (import.meta.env.DEV) {
							console?.error('Cannot use insets unless parent element uses Flex box layout', {
								element,
								parentElement,
							})
						}

						setContainerOffsets(undefined)
					}
				} else {
					setContainerOffsets(undefined)
				}
			}
		}
	})

	useOnElementResize(elementRef, entry => {
		updateContainerOffsets(dimensionsFromEntry(entry))
	}, { box })

	useEffect(() => {
		updateContainerOffsets()
	}, [updateContainerOffsets])

	const elementInsets: ContainerInsets = useMemo(() => {
		if (containerOffsets) {
			return getElementInsets(
				containerInsets,
				containerOffsets,
			)
		} else {
			return containerInsets
		}
	}, [containerInsets, containerOffsets])

	log('before return', elementRef.current, 'containerOffsets', containerOffsets)
	log('before return', elementRef.current, 'containerInsets', containerInsets)

	return logged('elementInsets', elementInsets)
}

function getPreviousElementSiblingWithLayout(element: HTMLElement): HTMLElement | null {
	const sibling = element.previousElementSibling

	if (sibling) {
		assert('sibling is isHTMLElement', sibling, isHTMLElement)

		const { offsetWidth, offsetHeight } = sibling

		if (offsetWidth && offsetHeight && sibling.offsetParent) {
			return sibling
		} else {
			return getPreviousElementSiblingWithLayout(sibling)
		}
	} else {
		return null
	}
}

function getNextElementSiblingWithLayout(element: HTMLElement): HTMLElement | null {
	const sibling = element.nextElementSibling

	if (sibling) {
		assert('sibling is isHTMLElement', sibling, isHTMLElement)

		const { offsetWidth, offsetHeight } = sibling

		if (offsetWidth && offsetHeight && sibling.offsetParent) {
			return sibling
		} else {
			return getNextElementSiblingWithLayout(sibling)
		}
	} else {
		return null
	}
}

function pickLayoutProperties(element: HTMLElement, parentPosition?: CSSProperties['position']) {
	const { display, flexDirection, position } = getComputedStyle(element)

	return {
		display,
		flexDirection,
		position,
		...(position === 'sticky' && (!parentPosition || parentPosition === 'static') ? stickyPositionOffsets(element) : pick(element, [
			'offsetHeight',
			'offsetLeft',
			'offsetParent',
			'offsetTop',
			'offsetWidth',
		])),
		...pick(element, [
			'scrollHeight',
			'scrollWidth',
		]),
	}
}

function stickyPositionOffsets(element: HTMLElement) {
	const properties = pick(element, [
		'offsetHeight',
		'offsetLeft',
		'offsetParent',
		'offsetTop',
		'offsetWidth',
	])

	return {
		...properties,
		offsetTop: properties.offsetTop - window.scrollY,
		offsetLeft: properties.offsetLeft - window.scrollX,
	}
}
