import { FieldAccessor } from '../accessors'
import { FieldValue } from './primitives'

type Events<Value extends FieldValue = FieldValue> = FieldAccessor.FieldEventListenerMap<Value>

export interface DesugaredFieldEventListeners {}

export interface FieldEventListenerStore
	extends Map<keyof Events, { [E in keyof Events]: Set<Events[E]> }[keyof Events]> {
	// Unfortunately, we have to enumerate these because otherwise, TS just can't handle the polymorphism.
	get(key: 'beforeUpdate'): Set<Events['beforeUpdate']> | undefined
	get(key: 'update'): Set<Events['update']> | undefined
	get<K extends keyof Events>(key: K): { [E in keyof Events]: Set<Events[E]> }[K] | undefined

	set<K extends keyof Events>(key: K, value: Set<Events[K]>): this
}

export interface FieldEventListeners {
	eventListeners: FieldEventListenerStore | undefined
}

export interface SugarableFieldEventListeners {}

export type UnsugarableFieldEventListeners<
	Persisted extends FieldValue = FieldValue,
	Produced extends Persisted = Persisted
> = {
	[EventName in keyof Events & string as `on${Capitalize<EventName>}`]?: Events[EventName] | Set<Events[EventName]>
}
