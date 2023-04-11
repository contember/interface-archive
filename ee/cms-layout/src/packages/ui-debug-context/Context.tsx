import { ReactNode, createContext, memo, useContext, useMemo } from 'react'
import { assert, isNonEmptyString } from '../assert-types'
import { maybe } from '../functional'
import { isNoopConsole, noopConsole } from './Constants'
import { ConsoleContextType } from './Types'

function createPrefixedConsole(message: string, prefixedConsole?: ConsoleContextType): ConsoleContextType {
	return {
		error: function error(...parameters: any[]) {
			(prefixedConsole ?? console).error(message, ...parameters)
		},
		errored: function errored<T>(message: string, value: T): T {
			(prefixedConsole ?? console).error(message, value)
			return value
		},
		log: function log(...parameters: any[]) {
			(prefixedConsole ?? console).log(message, ...parameters)
		},
		logged: function logged<T>(message: string, value: T): T {
			(prefixedConsole ?? console).log(message, value)
			return value
		},
		trace: function trace(...parameters: any[]) {
			(prefixedConsole ?? console).trace(message, ...parameters)
		},
		traced: function traced<T>(message: string, value: T): T {
			(prefixedConsole ?? console).trace(message, value)
			return value
		},
		warn: function warn(...parameters: any[]) {
			(prefixedConsole ?? console).warn(message, ...parameters)
		},
		warned: function warned<T>(message: string, value: T): T {
			(prefixedConsole ?? console).warn(message, value)
			return value
		},
	}
}

export const ConsoleContext = createContext<ConsoleContextType>(null!)
ConsoleContext.displayName = 'ConsoleContext'

export const useConsole = (prefix: string) => {
	assert('prefix is non-empty string', prefix, isNonEmptyString)

	const parentConsole = maybe(useContext(ConsoleContext), isNoopConsole, undefined, v => v)

	return useMemo(() => {
		if (parentConsole) {
			return createPrefixedConsole(prefix, parentConsole)
		} else {
			return noopConsole
		}
	}, [parentConsole, prefix])
}

type DebugChildrenProps =
	| { active: true; children: ReactNode; id: string; }
	| { active?: false; children: ReactNode; id?: string; }

export const DebugChildren = memo<DebugChildrenProps>(({ active = true, children, id }) => {
	const parentConsole = useContext(ConsoleContext)

	const console = active && id
		? maybe(parentConsole, isNoopConsole, () => createPrefixedConsole(id), parentConsole => createPrefixedConsole(id, parentConsole))
		: noopConsole

	return (
		<ConsoleContext.Provider value={active ? console : noopConsole}>
			{children}
		</ConsoleContext.Provider>
	)
})
DebugChildren.displayName = 'DebugChildren'
