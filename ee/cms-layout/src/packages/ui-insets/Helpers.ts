import { isNonNegativeNumber } from '../assert-types'
import { px } from '../css-utilities'
import { maybe } from '../functional'
import type { ContainerInsets, ContainerOffsets } from './Types'
import { ElementRect } from './Types'

export function diffContainerInsetsFromElementRects(
	outerRect: ElementRect,
	innerRect: ElementRect,
): ContainerInsets {
	return {
		top: Math.max(0, innerRect.top - outerRect.top),
		left: Math.max(0, innerRect.left - outerRect.left),
		right: Math.max(0, outerRect.right - innerRect.right),
		bottom: Math.max(0, outerRect.bottom - innerRect.bottom),
	}
}

export function combineElementInsets(...insets: Array<Partial<ContainerInsets> | null | undefined>): ContainerInsets {
	return insets.reduce(
		(outer: ContainerInsets, inner: Partial<ContainerInsets> | null | undefined) => ({
			bottom: Math.max(0, inner?.bottom ?? 0, outer?.bottom ?? 0),
			left: Math.max(0, inner?.left ?? 0, outer?.left ?? 0),
			right: Math.max(0, inner?.right ?? 0, outer?.right ?? 0),
			top: Math.max(0, inner?.top ?? 0, outer?.top ?? 0),
		}), { bottom: 0, left: 0, right: 0, top: 0 })
}

function clampElementInsets(containerInsets: ContainerInsets | null | undefined, elementInsets: ContainerInsets): ContainerInsets {
	return {
		bottom: maybe(containerInsets?.bottom, isNonNegativeNumber, bottom => elementInsets.bottom > bottom ? bottom : elementInsets.bottom, 0),
		left: maybe(containerInsets?.left, isNonNegativeNumber, left => elementInsets.left > left ? left : elementInsets.left, 0),
		right: maybe(containerInsets?.right, isNonNegativeNumber, right => elementInsets.right > right ? right : elementInsets.right, 0),
		top: maybe(containerInsets?.top, isNonNegativeNumber, top => elementInsets.top > top ? top : elementInsets.top, 0),
	}
}

export function getElementInsets(containerInsets: ContainerInsets | null | undefined, elementOffsets: ContainerOffsets | null | undefined): ContainerInsets {
	return clampElementInsets(containerInsets, {
		bottom: maybe(containerInsets?.bottom, isNonNegativeNumber, input => Math.max(0, input - (elementOffsets?.offsetBottom ?? 0)), 0),
		left: maybe(containerInsets?.left, isNonNegativeNumber, input => Math.max(0, input - (elementOffsets?.offsetLeft ?? 0)), 0),
		right: maybe(containerInsets?.right, isNonNegativeNumber, input => Math.max(0, input - (elementOffsets?.offsetRight ?? 0)), 0),
		top: maybe(containerInsets?.top, isNonNegativeNumber, input => Math.max(0, input - (elementOffsets?.offsetTop ?? 0)), 0),
	})
}

export function getScreenInnerBoundingRect(): ElementRect {
	const { innerHeight, innerWidth } = window

	return {
		bottom: innerHeight,
		height: innerHeight,
		left: 0,
		right: innerWidth,
		top: 0,
		width: innerWidth,
		x: 0,
		y: 0,
	}
}

export function screenInsetsToCSSCustomProperties<
	P extends string,
	T extends Readonly<Record<string, number | null>>,
>(value: T, prefix: P): {
		[K in keyof T as `${P}${string & K}`]: `${T[K]}px`
	} {
	const entries = Object.entries(value).map(
		([key, value]) => [prefix + key, px(value)],
	)

	return Object.fromEntries(entries)
}
