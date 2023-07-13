import { createNonNullableContextFactory, noop } from '@contember/react-utils'
import { ElementType, Fragment, ReactNode, RefObject, createElement, useCallback } from 'react'
import { SlotSourceComponentsRecord } from './types'

export type SlotsRefMap = Map<string, RefObject<HTMLElement>>
export type RegisterSlotTarget = (id: string, name: string, ref: RefObject<HTMLElement>) => void;
export type UnregisterSlotTarget = (id: string, name: string) => void;

export type ActiveSlotPortalsContextType = Set<string>;
export const [ActiveSlotPortalsContext, useActiveSlotPortalsContext] = createNonNullableContextFactory<ActiveSlotPortalsContextType>('ActiveSlotPortalsContext', new Set())

export function useHasActiveSlotsFactory<T extends SlotSourceComponentsRecord<string>>(SlotTargets: T) {
	const activeSlotPortals = useActiveSlotPortalsContext()

	return useCallback((...slots: ReadonlyArray<keyof T & string>) => {
		return slots.some(slot => activeSlotPortals.has(slot))
	}, [activeSlotPortals])
}

export function useTargetsIfActiveFactory<T extends SlotSourceComponentsRecord<string>>(SlotTargets: T) {
	const activeSlotPortals = useActiveSlotPortalsContext()

	return useCallback(function targetsIfActive<Children extends ReactNode | ((...args: any[]) => ReactNode)>(slots: ReadonlyArray<keyof T & string>, children?: Children) {
		if (slots.some(slot => activeSlotPortals.has(slot))) {
			if (children) {
				return children
			} else {
				return createElement(Fragment, {}, ...slots.map(slot => {
					if (slot in SlotTargets) {
						const Target = (SlotTargets as Record<keyof T, ElementType>)[slot]

						return createElement(Target, {
							key: `multi-element:${slot}`,
						})
					} else {
						throw new Error(`Slot target "${slot}" was not found within the targets passed to factory.`)
					}
				}))
			}
		} else {
			return null
		}
	}, [SlotTargets, activeSlotPortals])
}

export type SlotTargetsRegistryContextType = {
	registerSlotTarget: RegisterSlotTarget;
	unregisterSlotTarget: UnregisterSlotTarget;
}
export const [TargetsRegistryContext, useTargetsRegistryContext] = createNonNullableContextFactory<SlotTargetsRegistryContextType>('Interface.Slots.TargetsRegistryContext', {
	registerSlotTarget: noop,
	unregisterSlotTarget: noop,
})

export type RenderToSlotPortalContextType = {
	getTarget: undefined | ((slot: string) => HTMLElement | null | undefined);
	/** @deprecated Use `getTarget` instead */
	createSlotPortal?: never;
	registerSlotSource: undefined | ((id: string, slot: string) => void);
	unregisterSlotSource: undefined | ((id: string, slot: string) => void);
}

export const [PortalsRegistryContext, usePortalsRegistryContext] = createNonNullableContextFactory<RenderToSlotPortalContextType>('Interface.Slots.PortalsRegistryContext', {
	getTarget: undefined,
	registerSlotSource: undefined,
	unregisterSlotSource: undefined,
})
