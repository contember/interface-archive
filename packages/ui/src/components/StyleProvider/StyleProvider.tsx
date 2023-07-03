import { ColorSchemeContext, getThemeClassName, useColorScheme, useThemedClassName } from '@contember/react-utils'
import { NonOptional, stateDataAttributes, useClassName } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { mergeProps } from 'react-aria'
import { Intent, Scheme } from '../../types'
import { toSchemeClass } from '../../utils'

export type StyleProviderProps = {
	transparent?: boolean;
	displayContents?: boolean;
	scheme?: Scheme;
	themeContent?: Intent;
	themeControls?: Intent;
	overridesLucideIcons?: boolean;
}

const initialValues: NonOptional<StyleProviderProps> = {
	displayContents: true,
	overridesLucideIcons: true,
	scheme: 'system',
	themeContent: 'default',
	themeControls: 'primary',
	transparent: true,
}

export const StyleProvider = ({ children, ...props }: PropsWithChildren<StyleProviderProps>) => {
	const { scheme, themeContent, themeControls, ...state } = mergeProps(initialValues, props)
	const colorScheme = useColorScheme()

	return (
		<ColorSchemeContext.Provider value={scheme ?? colorScheme ?? 'system'}>
			<div
				{...stateDataAttributes(state)}
				className={useClassName('root', useThemedClassName([
					getThemeClassName(themeContent, themeControls),
					toSchemeClass(scheme),
				]))}
			>
				{children}
			</div>
		</ColorSchemeContext.Provider>
	)
}
StyleProvider.displayName = 'Interface.StyleProvider'
