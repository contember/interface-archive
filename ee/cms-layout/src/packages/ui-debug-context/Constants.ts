import type { ConsoleContextType } from './Types'

export function noopLog(...parameters: any[]) { }

export function noopLogged<T>(message: string, value: T): T {
	return value
}

export const noopConsole: ConsoleContextType = Object.freeze({
	log: noopLog,
	logged: noopLogged,
	warn: noopLog,
	warned: noopLogged,
	error: noopLog,
	errored: noopLogged,
	trace: noopLog,
	traced: noopLogged,
})

export function isNoopConsole(value: unknown): value is ConsoleContextType {
	return value === noopConsole
}
