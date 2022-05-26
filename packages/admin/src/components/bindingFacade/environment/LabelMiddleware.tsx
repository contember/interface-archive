import { createContext, ReactChild, ReactNode, useCallback, useContext } from 'react'
import { Environment, useEnvironment } from '@contember/binding'

export type LabelMiddleware = (label: ReactNode, environment: Environment) => ReactNode

export const LabelMiddlewareContext = createContext<LabelMiddleware>(it => it)

export const useLabelMiddleware = () => {
	const env = useEnvironment()
	const labelMiddleware = useContext(LabelMiddlewareContext)
	return useCallback((it: ReactNode) => labelMiddleware(it, env), [env, labelMiddleware])
}

export const LabelMiddlewareProvider = ({ value, children }: { value: LabelMiddleware | undefined, children: ReactChild }) => {
	const current = useContext(LabelMiddlewareContext)

	return (
		<LabelMiddlewareContext.Provider value={value ?? current}>
			{children}
		</LabelMiddlewareContext.Provider>
	)
}
