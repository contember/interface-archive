export * from './Contexts'
export * from './LayoutSlotsProvider'
export * from './createLayoutSlotComponent'
export * from './createLayoutSlotTargetComponent'

import { LayoutSlotPortal as Portal } from './LayoutSlotPortal'
import { LayoutSlotTarget as Target } from './LayoutSlotTarget'

export const LayoutSlot = {
	Portal,
	Target,
}
