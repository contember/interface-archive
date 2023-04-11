import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { isNotNullish } from '../assert-types'
import { getSizeFromResizeObserverEntryFactory } from '../dom'
import { maybe } from '../functional'
import { useConsole } from '../ui-debug-context'
import { RefObjectOrElement, maybeRef } from './maybeRef'
import { useOnElementResize } from './useOnElementResize'

function getElementWidth(element: HTMLElement) {
	return element.offsetWidth
}

function getElementHeight(element: HTMLElement) {
	return element.offsetHeight
}

/**
 * Measure HTMLElement
 *
 * @param refOrElement HTMLElement passed directly or indirectly as RefObject
 * @returns Size vector consisting of width and height properties
 */
export function useElementSize(
	refOrElement: RefObjectOrElement<HTMLElement>,
	options: ResizeObserverOptions = {},
	timeout: number = 300,
): { height: number | undefined, width: number | undefined } {
	const { logged } = useConsole('useElementSize')

	const { box = 'border-box' } = options
	const getSizeFromResizeObserverEntry = useMemo(() => getSizeFromResizeObserverEntryFactory(box), [box])

	const [width, setWidth] = useState<number | undefined>(maybe(maybeRef(refOrElement), isNotNullish, getElementWidth, undefined))
	const [height, setHeight] = useState<number | undefined>(maybe(maybeRef(refOrElement), isNotNullish, getElementHeight, undefined))

	logged('dimensions', { width, height })

	useOnElementResize(refOrElement, entry => {
		const dimensions = logged('useOnElementResize => entry:dimensions', getSizeFromResizeObserverEntry(entry))

		if (width !== dimensions.width) {
			setWidth(dimensions.width)
		}
		if (height !== dimensions.height) {
			setHeight(dimensions.height)
		}
	}, { box }, timeout)

	// INTENTIONAL AVOID OF ESLint ERROR: We need measure on every Layout side-effect
	// otherwise the browser will paint and cause layout shifts.
	//
	// React Hook useLayoutEffect contains a call to 'setWidth'. Without a list of dependencies,
	// this can lead to an infinite chain of updates. To fix this, pass [element] as a second argument
	// to the useLayoutEffect Hook.
	//
	// Seems like only pure function lets us measure before the browser has a chance to paint
	const measure = useRef((element: HTMLElement | null) => {
		logged('measure(element)', element)

		if (element instanceof HTMLElement) {
			setWidth(logged('getElementWidth(element):', getElementWidth(element)))
			setHeight(logged('getElementHeight(element):', getElementHeight(element)))
		} else if (element) {
			throw new Error('Exhaustive error: Expecting element to be instance of HTMLElement or Window')
		}
	})

	useLayoutEffect(() => {
		const element = maybeRef(refOrElement)
		logged('useLayoutEffect => measure', measure.current(element))
	})

	return { height, width }
}
