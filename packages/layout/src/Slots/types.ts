import { ComponentClassNameProps, PascalCase } from '@contember/utilities'
import { ComponentType, ElementType, ReactNode } from 'react'
import { createSlotSourceComponent } from './createSlotSourceComponent'
import { createSlotTargetComponent } from './createSlotTargetComponent'

export type SlotComponentsRecords<K extends string> = Readonly<{
	readonly [P in PascalCase<K>]: ComponentType
}>

export type SlotSourceComponentsRecord<K extends string> = Readonly<{
	readonly [P in PascalCase<K>]: ReturnType<typeof createSlotSourceComponent<P>>
}>

export type SlotTargetComponentsRecord<K extends string> = Readonly<{
	readonly [P in PascalCase<K>]: ReturnType<typeof createSlotTargetComponent<P>>
}>

export type SourcePortalProps<K extends string = string> = {
	children: ReactNode;
	name: K;
}

// export type SlotNamesRecord<
// 	ComponentName extends PascalCase<string> = PascalCase<string>,
// 	SlotName extends KebabCase<string> = KebabCase<ComponentName>,
// > = Readonly<Record<
// 	ComponentName,
// 	SlotName
// >>

// if (import.meta.env.DEV) {

// }
// type _A = TypeofStringLiteral<'a'>
// //   ^?
// type _A2 = TypeofStringLiteral<string>
// //   ^?

// export type TypeofSlotNamesRecord<T> =
// 	T extends Readonly<Record<infer K, KebabCase<infer V>>>
// 	? K extends PascalCase<K>
// 	? V extends TypeofStringLiteral<V>
// 	? T
// 	: never & 'Values must be StringLiteral<V>'
// 	: never & 'Keys must be PascalCase<K>'
// 	: never & 'Must be Readonly<Record<K, KebabCase<V>>>'

// type _B = TypeofSlotNamesRecord<SlotNamesRecord<'HelloWorld'>>
// //   ^?
// type _B2 = TypeofSlotNamesRecord<{ 'a': 'a' }>
// //   ^?
// type _B3 = TypeofSlotNamesRecord<{ 'AaBB': 'a b' }>
// //   ^?
// type _B4 = TypeofSlotNamesRecord<{ 'AaBB': 'a-b' }>
// //   ^?
// type _B5 = TypeofSlotNamesRecord<{ 'MySlot': 'MySlot' }>
// //   ^?

// export type TypeofSlotPortalComponentsRecord<T> =
// 	T extends TypeofSlotNamesRecord<T>
// 	? Readonly<Record<keyof T, ReturnType<typeof createSlotSourceComponent<T[keyof T]>>>>
// 	: never & 'Must be TypeofSlotNamesRecord<T>'

// type _C1 = TypeofSlotPortalComponentsRecord<{ 'A': 'a' }>
// //   ^?
// type _C2 = TypeofSlotPortalComponentsRecord<{ 'a': 'a' }>
// //   ^?
// const _c3 = { a: 'a' }
// type _C3 = TypeofSlotPortalComponentsRecord<typeof _c3>
// //   ^?
// const _c4 = { MySlot: 'MySlot' }
// type _C4 = TypeofSlotPortalComponentsRecord<typeof _c4>
// //   ^?
// type _C5 = TypeofSlotPortalComponentsRecord<Readonly<{ MySLot: 'MySLot'; FooterActions: 'footer-actions'; }>>
// //   ^?

// export type TypeofSlotTargetComponentsRecord<T> =
// 	T extends TypeofSlotNamesRecord<T>
// 	? Readonly<Record<keyof T, ReturnType<typeof createSlotTargetComponent<T[keyof T]>>>>
// 	: never & 'Must be TypeofSlotNamesRecord<T>'

export type TargetProps<Name extends string = string> = ComponentClassNameProps & {
	/**
	 * Type of the container element, default is `div`.
	 *
	 * In case you provide custom Element, mak sure to pass component wrapped in forwardRef
	 * otherwise the ref will not be passed to the container element and the slot will not work.
	 *
	 * @example
	 * ```
	 * <Target as={forwardRef((props, ref) => <h1 {...props} ref={ref} />)} />
	 * ```
	 */
	as?: ElementType;
	children?: ReactNode;
	name: Name;
}

// export type TaggedPortalComponent<TargetName extends string | string[]> = FunctionComponent<SourcePortalProps> & { slot: TargetName }
// export type TaggedTargetComponent<TargetName extends string> = FunctionComponent<TargetProps> & { slot: TargetName }
