import { memo, useLayoutEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { usePortalsRegistryContext, useTargetOverride } from './contexts'
import { SourcePortalProps } from './types'

export const Source = memo<SourcePortalProps>(({ name, children }) => {
	const override = useTargetOverride()

	const { getTarget, registerSlotSource, unregisterSlotSource } = usePortalsRegistryContext()

	const instanceId = useMemo(() => Math.random().toString(36).substring(2, 9), [])
	const instanceIdRef = useRef(instanceId)
	instanceIdRef.current = instanceId

	useLayoutEffect(() => {
		if (registerSlotSource && unregisterSlotSource) {
			const id = instanceIdRef.current
			registerSlotSource(id, name)

			return () => unregisterSlotSource(id, name)
		}
	}, [name, registerSlotSource, unregisterSlotSource])

	// There is a parent Slot context to provide a targets for slots...
	if (getTarget) {
		const target = getTarget?.(override ?? name)

		// ...and in case we have target we render children into it.
		if (target) {
			return createPortal(children, target)
		} else {
			// However, if there is no target, it means that the slot is either
			// not being rendered in the DOM at all or it is being temporarily
			// missing because of the re-rendering of the DOM tree but we cannot
			// tell which one is the case.
			//
			// One way to avoid this is to keep list of all slots supported
			// by the layout in the userland and check if the slot is in the list.
			//
			// Also in development mode we can at least warn about this, but
			// it can cause false positives in case of the re-rendering.
			if (import.meta.env.DEV) {
				console.warn(`There is no slot target named "${override ?? name}" in the layout. Make sure it is being rendered in the DOM.`)
			}

			return null
		}
	} else {
		if (import.meta.env.DEV) {
			console.warn(`I seems like you are trying to redirect slots into a slot override "${override}" without providing a <Slots.Provider />.`)
		}

		return <>{children}</>
	}
})
Source.displayName = 'Interface.Slots.Source'
