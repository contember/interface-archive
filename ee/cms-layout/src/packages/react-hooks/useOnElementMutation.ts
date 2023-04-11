import deepEqual from 'deep-equal'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useConsole } from '../ui-debug-context'
import { RefObjectOrElement, maybeRef } from './maybeRef'

export function useOnElementMutation(
	refOrElement: RefObjectOrElement<HTMLElement | undefined>,
	callback: MutationCallback,
	options: MutationObserverInit = { attributes: true, childList: true, subtree: true },
) {
	const console = useConsole('useOnElementMutation')
	const consoleRef = useRef(console); consoleRef.current = console

	const callbackRef = useRef(callback); callbackRef.current = callback
	const optionsRef = useRef<MutationObserverInit>(options); optionsRef.current = options

	const [optionsState, setOptionsState] = useState<MutationObserverInit>(options)

	useEffect(() => {
		if (!deepEqual(optionsRef.current, options)) {
			setOptionsState(options)
		}
	}, [options])

	useLayoutEffect(() => {
		const element = maybeRef(refOrElement)

		if (element) {
			function handler(mutations: MutationRecord[], observer: MutationObserver) {
				consoleRef.current.logged('element.mutations', mutations)
				callbackRef.current(mutations, observer)
			}

			const observer = new MutationObserver(handler)

			observer.observe(element, optionsState)

			return () => {
				observer.disconnect()
			}
		}
	}, [optionsState, refOrElement])
}
