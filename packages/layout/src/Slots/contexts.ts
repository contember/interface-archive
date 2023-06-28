import { createNonNullableContextFactory, noop } from '@contember/react-utils'
import { ElementType, Fragment, RefObject, createContext, createElement, useCallback, useContext } from 'react'
import { SlotSourceComponentsRecord } from './types'

export type SlotsRefMap = Map<string, RefObject<HTMLElement>>
export type RegisterSlot = (name: string, ref: RefObject<HTMLElement>) => void;
export type UpdateSlotTarget = (name: string, ref: RefObject<HTMLElement>) => void;
export type UnregisterSlot = (name: string) => void;

export type ActiveSlotPortalsContextType = Set<string>;
export const [ActiveSlotPortalsContext, useActiveSlotPortalsContext] = createNonNullableContextFactory<ActiveSlotPortalsContextType>('ActiveSlotPortalsContext', new Set())

export function useHasActiveSlotsFactory<T extends SlotSourceComponentsRecord<string>>(SlotTargets: T) {
	const activeSlotPortals = useActiveSlotPortalsContext()

	return useCallback((...slots: ReadonlyArray<keyof T & string>) => {
		return slots.some(slot => activeSlotPortals.has(slot))
	}, [activeSlotPortals])
}

export function useRenderToActiveSlotsFactory<T extends SlotSourceComponentsRecord<string>>(SlotTargets: T) {
	const activeSlotPortals = useActiveSlotPortalsContext()

	return useCallback((...slots: ReadonlyArray<keyof T & string>) => (
		slots.some(slot => activeSlotPortals.has(slot))
			? createElement(Fragment, {}, ...slots.map(slot => {
				if (slot in SlotTargets) {
					const Target = (SlotTargets as Record<keyof T, ElementType>)[slot]

					return createElement(Target, {
						key: `multi-element:${slot}`,
					})
				} else {
					return null
				}
			}))
			: null
	), [SlotTargets, activeSlotPortals])
}

export type SlotTargetsRegistryContextType = {
	registerSlotTarget: UpdateSlotTarget;
	unregisterSlotTarget: UnregisterSlot;
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

export const TargetOverrideContext = createContext<string | null | undefined>(undefined)
TargetOverrideContext.displayName = 'Interface.Slots.TargetOverride'
export const useTargetOverride = () => useContext(TargetOverrideContext) || null

export const [PortalsRegistryContext, usePortalsRegistryContext] = createNonNullableContextFactory<RenderToSlotPortalContextType>('Interface.Slots.PortalsRegistryContext', {
	getTarget: undefined,
	registerSlotSource: undefined,
	unregisterSlotSource: undefined,
})
