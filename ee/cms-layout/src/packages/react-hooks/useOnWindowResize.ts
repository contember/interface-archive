import { useLayoutEffect, useRef } from 'react'
import { useConsole } from '../ui-debug-context'

export function useOnWindowResize(
	callback: (event: Event) => void,
	interval: number = 300,
) {
	const console = useConsole('useOnWindowResize')
	const consoleRef = useRef(console); consoleRef.current = console

	const callbackRef = useRef(callback); callbackRef.current = callback
	const lastTimeStamp = useRef<number>(0)

	useLayoutEffect(() => {
		let timeoutID: number | undefined = undefined

		function debouncedHandler(event: Event) {
			clearTimeout(timeoutID)

			const delta = event.timeStamp - lastTimeStamp.current
			consoleRef.current.logged('window.resize:delta', delta)

			if (delta > interval) {
				consoleRef.current.warned('event:window.resize:immediately', null)
				callbackRef.current(event)
				lastTimeStamp.current = event.timeStamp
			} else {
				timeoutID = setTimeout(() => {
					consoleRef.current.warned('event:window.resize:debounced', null)
					lastTimeStamp.current = event.timeStamp
					callbackRef.current(event)
				}, interval)
			}
		}

		window.addEventListener('resize', debouncedHandler)

		return () => {
			clearTimeout(timeoutID)
			window.removeEventListener('resize', debouncedHandler)
		}
	}, [callbackRef, interval])
}
