import { Layout as bare } from './Layout.bare'
import { Layout as cms } from './Layout.cms'
import { Layout as legacy } from './Layout.legacy'
import { Layout as _default } from './Layout.singleColumn'

export const Layouts = {
	bare,
	cms,
	legacy,
	default: _default,
} as const

export const layoutTypeList = Object.keys(Layouts) as ReadonlyArray<keyof typeof Layouts>

export type LayoutType = typeof layoutTypeList[number]
