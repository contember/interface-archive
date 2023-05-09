import { createContext } from 'react'

export interface SessionTokenContextValue {
	token: string | undefined
	source: 'props' | 'localstorage' | undefined
	propsToken: string | undefined
}

export const SessionTokenContext = createContext<SessionTokenContextValue>({
	propsToken: undefined,
	source: undefined,
	token: undefined,
})
