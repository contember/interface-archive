import equal from 'fast-deep-equal/es6'
import { ReactNode, memo } from 'react'
import { useActiveSlotPortalsContext } from './contexts'

export type PropsWithChildrenProps = {
	children: ReactNode;
	slots: string[];
}

export const IfActive = memo<PropsWithChildrenProps>(
	({ children, slots }) => {
		const activeSlotPortals = useActiveSlotPortalsContext()

		return (
			slots.some(slot => activeSlotPortals.has(slot))
				? <>{children}</>
				: null
		)
	},
	(prevProps, nextProps) => equal(prevProps.slots, nextProps.slots) && prevProps.children === nextProps.children,
)
