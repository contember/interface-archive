import { ReactNode, createContext, memo, useContext, useEffect, useState } from 'react'
import { createSelectorContext } from 'react-selector-context'

export namespace UserConfig {
	export type Dictionary = Record<string, unknown>
	export type DictionaryGeneric<U extends Dictionary = Dictionary> = U
	export type Factory<U extends Dictionary = Dictionary> = (config: DictionaryGeneric<U>) => DictionaryGeneric<U> // TODO: | Promise<UserConfig<U>>

	export const Context = createContext<DictionaryGeneric>({})
	export const SelectorContext = createSelectorContext(Context)
	Context.displayName = 'UserConfig'

	export type ProviderProps<U extends Dictionary = Dictionary> = {
		value?: Partial<DictionaryGeneric<U>> | Factory<U> | undefined;
		children: ReactNode;
	}
}

export const useUserConfig = <U, /*JSX FIX*/>(selector: (config: UserConfig.Dictionary) => U) => {
	const context = useContext(UserConfig.Context)

	return selector(context)
}

export function defineUserConfig<U extends UserConfig.Dictionary = UserConfig.Dictionary>(initialValue: UserConfig.DictionaryGeneric<U>) {
	Object.freeze(initialValue)

	function produceUserConfig(
		value: Partial<UserConfig.DictionaryGeneric<U>> | UserConfig.Factory<U> | undefined = undefined,
		parentContext: Partial<UserConfig.DictionaryGeneric<U>> | undefined = undefined,
	): UserConfig.DictionaryGeneric<U> {
		return {
			...initialValue,
			...parentContext,
			...value instanceof Function ? value(initialValue) : (value ?? initialValue),
		}
	}

	const Provider = memo<UserConfig.ProviderProps<U>>(({
		children,
		value,
	}) => {
		const parentContext = useContext<{}>(UserConfig.Context)
		const [config, setConfig] = useState<UserConfig.DictionaryGeneric<U>>(produceUserConfig(value, parentContext))

		useEffect(() => {
			setConfig(produceUserConfig(value))
		}, [value])

		return (
			<UserConfig.Context.Provider value={config}>
				{children}
			</UserConfig.Context.Provider>
		)
	})

	return {
		Provider,
		Consumer: UserConfig.Context.Consumer,
		useUserConfig: <
			ReturnValue = unknown,
			Selector extends <U extends UserConfig.DictionaryGeneric = UserConfig.DictionaryGeneric,
		>(config: U) => ReturnValue = <C>(config: C) => ReturnValue,
		>(selector: Selector) => useUserConfig(selector),
	}
}
