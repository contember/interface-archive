import { useLayoutEffect, useRef } from 'react'
import { useConsole } from '../ui-debug-context'
import { RefObjectOrElement, maybeRef } from './maybeRef'

export function useOnElementResize(
	refOrElement: RefObjectOrElement<HTMLElement | null> | null,
	callback: (entries: ResizeObserverEntry) => void,
	options: ResizeObserverOptions = {},
	timeout: number = 300,
): void {
	const console = useConsole('useOnElementResize')
	const consoleRef = useRef(console); consoleRef.current = console

	const { box = 'border-box' } = options
	const element = maybeRef(refOrElement)
	const callbackRef = useRef(callback); callbackRef.current = callback
	const lastTimeStamp = useRef<number>(0)

	useLayoutEffect(() => {
		let timeoutID: number | undefined = undefined

		function debouncedOnChange([entry]: ResizeObserverEntry[]) {
			const timeStamp = Date.now()
			const delta = timeStamp - lastTimeStamp.current

			if (delta > timeout) {
				consoleRef.current.warned('element.resize:immediate', null)
				callbackRef.current(entry)
				lastTimeStamp.current = timeStamp
			} else {
				clearTimeout(timeoutID)
				timeoutID = setTimeout(() => {
					consoleRef.current.warned('element.resize:debounced', null)
					callbackRef.current(entry)
					lastTimeStamp.current = timeStamp
				}, timeout)
			}
		}

		if (element instanceof HTMLElement) {
			const resizeObserver = new ResizeObserver(debouncedOnChange)

			resizeObserver.observe(element, { box })

			return () => {
				clearTimeout(timeoutID)
				resizeObserver.unobserve(element)
			}
		} else if (element) {
			throw new Error('Exhaustive error: Expecting element to be instance of HTMLElement')
		}
	}, [element, box, timeout])
}
