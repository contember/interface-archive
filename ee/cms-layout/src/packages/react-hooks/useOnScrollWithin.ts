import { useLayoutEffect, useRef } from 'react'
import { useConsole } from '../ui-debug-context'
import { RefObjectOrElement, maybeRef } from './maybeRef'

/**
 * Invokes callback on scroll event within the scroll container
 *
 * @param refOrElement Scroll container
 * @param callback Callback that is invoked on scroll event
 * @param interval Specifies how often should scroll event invoke callback
 */
export function useOnScrollWithin(
	refOrElement: RefObjectOrElement<HTMLElement | null> | null,
	callback: (event: Event) => void,
	interval: number = 1000 / 60,
) {
	const console = useConsole('useOnScrollWithin')
	const consoleRef = useRef(console); consoleRef.current = console

	const callbackRef = useRef(callback); callbackRef.current = callback
	const lastTimeStamp = useRef<number>(0)

	const element = maybeRef(refOrElement)

	useLayoutEffect(() => {
		let timeoutID: number | undefined = undefined

		function debouncedHandler(event: Event) {
			clearTimeout(timeoutID)

			const delta = event.timeStamp - lastTimeStamp.current
			consoleRef.current.logged('event:element.scroll:delta', delta)

			if (delta > interval) {
				consoleRef.current.warned('event:element.scroll:immediately', event)
				callbackRef.current(event)
				lastTimeStamp.current = event.timeStamp
			} else {
				timeoutID = setTimeout(() => {
					consoleRef.current.warned('event:element.scroll:debounced', event)
					lastTimeStamp.current = event.timeStamp
					callbackRef.current(event)
				}, interval)
			}
		}

		if (element && element instanceof HTMLElement) {
			if (element instanceof HTMLBodyElement || element instanceof HTMLHtmlElement) {
				window.addEventListener('scroll', debouncedHandler, { capture: true, passive: true })
				window.addEventListener('resize', debouncedHandler)

				return () => {
					window.removeEventListener('scroll', debouncedHandler)
					window.removeEventListener('resize', debouncedHandler)
				}
			} else {
				element.addEventListener('scroll', debouncedHandler, { passive: true, capture: true })

				return () => {
					element.removeEventListener('scroll', debouncedHandler)
				}
			}
		} else if (element) {
			throw new Error('Exhaustive error: Expecting element to be instance of HTMLElement')
		}

	}, [element, interval])
}
