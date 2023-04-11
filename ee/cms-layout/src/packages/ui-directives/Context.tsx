import { useReferentiallyStableCallback } from '@contember/react-utils'
import { ReactNode, createContext, memo, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { assert, isNonEmptyTrimmedString, isPlainObject } from '../assert-types'
import { useConsole } from '../ui-debug-context'
import { DirectiveProps, KeyValuePair, RequiredDeepPlainObject, SetDirectiveContextType } from './Types'

function getId(name: string) {
	return `Directive(${name}):${Math.random().toString(36).substring(2, 9)}`
}

export function useDirectiveProviderRegistry<T extends Record<string, unknown>>(value: T): [SetDirectiveContextType<T>, T] {
	const [state, setState] = useState<Map<string, KeyValuePair<T>>>(new Map())
	const setStateRef = useRef(setState)

	const console = useConsole('useDirectiveProviderRegistry')

	const registerDirective = useReferentiallyStableCallback(<K extends keyof T>(componentId: string, key: K, value: T[K]) => {
		const setState = setStateRef.current

		if (state.has(componentId)) {
			throw new Error(`Component with ID "${componentId}" was already registered. You likely forgot to unregister it on component cleanup.`)
		} else {
			console.log('register', componentId, key, value, setState)

			setState(prevState => {
				const nextState = new Map(prevState)
				nextState.set(componentId, { key, value })

				console.log('nextState', nextState)

				return nextState
			})
		}
	})

	const updateDirective = useReferentiallyStableCallback(<K extends keyof T>(componentId: string, key: K, value: T[K]) => {
		const setState = setStateRef.current

		if (state.has(componentId)) {
			console.log('update existing', componentId, key, value)
			setState(prevState => new Map(prevState).set(componentId, { key, value }))
		}
	})

	const unregisterDirective = useReferentiallyStableCallback((componentId: string) => {
		const setState = setStateRef.current
		console.log('unregister', componentId)

		setState(prevState => {
			const nextState = new Map(prevState)
			nextState.delete(componentId)

			return nextState
		})
	})

	const registry = useMemo(() => ({ registerDirective, updateDirective, unregisterDirective }), [registerDirective, updateDirective, unregisterDirective])

	const combinedState = useMemo(() => {
		const combinedState: T = { ...value }

		for (const { key, value } of state.values()) {
			combinedState[key] = value
		}

		return combinedState
	}, [state, value])

	return [registry, combinedState]
}

export function useDirectiveLifeCycle<T>(
	key: string,
	value: T,
	registry: SetDirectiveContextType<Record<string, unknown>>,
) {
	const directiveId = useRef(getId(key))
	const isMounted = useRef(false)

	useLayoutEffect(() => {
		const id = directiveId.current

		if (isMounted.current) {
			registry.updateDirective(directiveId.current, key, value)
		} else {
			registry.registerDirective(id, key, value)
			isMounted.current = true
		}

		return () => {
			registry.unregisterDirective(id)
		}
	}, [key, registry, value])
}

export function createDirectiveContext<T extends RequiredDeepPlainObject<T>, K extends keyof T & string = keyof T & string>(displayName: string, initialValue: T) {
	assert('displayName is non-empty string', displayName, isNonEmptyTrimmedString)
	assert('initialValue is non-null object', initialValue, isPlainObject<T>)

	const DirectiveTreeStateContext = createContext<T>(initialValue)
	DirectiveTreeStateContext.displayName = displayName

	const DirectiveTreeStateRegistryContext = createContext<SetDirectiveContextType<T>>(null!)
	DirectiveTreeStateRegistryContext.displayName = `${displayName}.Registry`

	const providerDisplayName = `${displayName}.Provider`

	const Provider = ({ value, children }: { value?: Partial<T>, children: ReactNode }) => {
		const [registry, combinedState] = useDirectiveProviderRegistry<T>({ ...initialValue, ...value })

		return (
			<DirectiveTreeStateRegistryContext.Provider value={registry}>
				<DirectiveTreeStateContext.Provider value={combinedState}>
					{children}
				</DirectiveTreeStateContext.Provider>
			</DirectiveTreeStateRegistryContext.Provider>
		)
	}
	Provider.displayName = providerDisplayName

	const directiveDisplayName = `${displayName}.Directive`

	const Directive = memo<DirectiveProps<T, K>>(({ name, content }) => {
		const registry = useContext(DirectiveTreeStateRegistryContext) as SetDirectiveContextType<Record<string, unknown>>

		if (registry == null) {
			throw new Error(`${directiveDisplayName} component must be used within a ${providerDisplayName} component.`)
		}

		useDirectiveLifeCycle(name, content, registry)

		return null
	})
	Directive.displayName = directiveDisplayName

	const useHook = () => useContext(DirectiveTreeStateContext)

	return [
		Provider,
		Directive,
		DirectiveTreeStateContext.Consumer,
		useHook,
	] as const
}

/*
TODO: Add tests for this

const [Provider, Directive] = createDirectiveContext('ComponentTreeState', {
	width: 0,
	header: { title: 'Default title' },
})

Directive
// ^?

type P = ComponentProps<typeof Directive>
//   ^?

const w = <Directive name="width" content={100} />
const a = <Directive name="header" content={{ title: 'Hi!' }} />

/**/
