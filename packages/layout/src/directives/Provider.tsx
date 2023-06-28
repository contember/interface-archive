import { useScopedConsoleRef } from '@contember/react-utils'
import equal from 'fast-deep-equal/es6/index.js'
import { ReactNode, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { RegistryContext, StateContext } from './contexts'
import { Directives_RegistryContextType } from './types'

type Directives_ComponentsStateMap<V> = Map<string, V>
type Directives_StateRecord<V> = Directives_ComponentsStateMap<V>
type Directives_State<T extends Record<PropertyKey, unknown>> = Map<keyof T, Directives_StateRecord<T[keyof T]>>

export type Directives_ProviderProps = { value?: Record<string, unknown>, children: ReactNode }

export const Provider = memo<Directives_ProviderProps>(({ value, children }) => {
	const [combinedState, registry] = useProviderRegistry<Record<string, unknown>>(value)
	return (
		<RegistryContext.Provider value={registry}>
			<StateContext.Provider value={combinedState}>
				{children}
			</StateContext.Provider>
		</RegistryContext.Provider>
	)
})
Provider.displayName = 'Interface.Directives.Provider'

function useProviderRegistry<T extends Record<PropertyKey, unknown>>(initialValue: Partial<T> | null | undefined): [Partial<T>, Directives_RegistryContextType<T>] {
	const [state, setState] = useState<Directives_State<T>>(new Map())
	const scopedConsole = useScopedConsoleRef('useDirectiveProviderRegistry').current

	const updateState = useCallback((
		directive: keyof T,
		updater: (previous: Directives_ComponentsStateMap<T[keyof T]>) => Directives_ComponentsStateMap<T[keyof T]>,
	) => setState(prevState => {
		const previous = prevState.get(directive) ?? new Map<string, T[keyof T]>()
		const next = updater(previous)

		scopedConsole.log('updateState', directive, { prevState, previous, next })

		if (!equal(next, previous)) {
			return new Map([...prevState, [directive, next]])
		} else {
			return prevState
		}
	}), [scopedConsole])

	const directiveRegistryApi = useMemo<Directives_RegistryContextType<T>>(() => {
		return {
			register: (directive: keyof T, component: string, value: T[keyof T]) => {
				scopedConsole.log('register', directive, component, value)
				updateState(directive, previous => {
					if (!previous.has(component)) {
						return new Map([...previous, [component, value]])
					} else {
						throw new Error(`Component "${component}" was already registered for "${String(directive)}" directive`)
					}
				})
			},
			update: (directive: keyof T, component: string, value: T[keyof T]) => {
				scopedConsole.log('update', directive, component, value)
				updateState(directive, previous => {
					if (previous.has(component)) {
						return new Map([...previous, [component, value]])
					} else {
						throw new Error(`Component "${component}" must be registered before for "${String(directive)}" directive`)
					}
				})
			},
			unregister: (directive: keyof T, component: string) => {
				scopedConsole.log('unregister', directive, component)
				updateState(directive, previous => {
					if (previous.has(component)) {
						// Allows HMR to work in dev mode
						if (import.meta.env.DEV) {
							return new Map([...previous, [component, undefined as T[keyof T]]])
						} else {
							const next = new Map(previous)
							return next.delete(component), next
						}
					} else {
						throw new Error(`Component "${component}" must be registered before for "${String(directive)}" directive`)
					}
				})
			},
		}
	}, [scopedConsole, updateState])

	const [combinedState, setCombinedState] = useState<Partial<T>>({})

	useEffect(() => {
		const nextState: Partial<T> = { ...(initialValue ?? {} as Partial<T>) }

		for (const [directive, components] of state.entries()) {
			for (const [, value] of components.entries()) {
				if (value !== undefined) {
					nextState[directive] = value
				}
			}
		}

		if (!equal(nextState, combinedState)) {
			setCombinedState(nextState)
		}
	}, [combinedState, state, initialValue])

	scopedConsole.log({ combinedState, state, initialValue })

	return [combinedState, directiveRegistryApi]
}
