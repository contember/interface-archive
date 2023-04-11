import { memo, ReactNode, useLayoutEffect, useRef } from 'react'
import { useRenderToSlotPortalContext } from './Contexts'

export type LayoutSlotProps = { children: ReactNode, target: string }

export const LayoutSlotPortal = memo<LayoutSlotProps>(({ target, children }) => {
	const {
		createLayoutSlotPortal,
		registerLayoutSlotPortal,
		unregisterLayoutSlotPortal,
	} = useRenderToSlotPortalContext()

	const instanceId = useRef(Math.random().toString(36).substring(2, 9))

	useLayoutEffect(() => {
		const id = instanceId.current
		registerLayoutSlotPortal(id, target)

		return () => unregisterLayoutSlotPortal(id, target)
	}, [target, registerLayoutSlotPortal, unregisterLayoutSlotPortal])

	return <>
		{createLayoutSlotPortal(target, children)}
	</>
})
LayoutSlotPortal.displayName = 'SlotPortal'
