import { getThemeClassName, useThemedClassName } from '@contember/react-utils'
import { NonOptional, stateDataAttributes, useClassName } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { mergeProps } from 'react-aria'
import { Intent, Scheme } from '../../types'
import { toSchemeClass } from '../../utils'

export type StyleProviderProps = {
	displayContents?: boolean;
	overridesLucideIcons?: boolean;
	scheme?: Scheme;
	themeContent?: Intent;
	themeControls?: Intent;
	transparent?: boolean;
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

	return (
		<div
			{...stateDataAttributes(state)}
			className={useClassName('root', useThemedClassName([
				getThemeClassName(themeContent, themeControls),
				toSchemeClass(scheme),
			]))}
			style={props.displayContents ? { display: 'contents' } : undefined}
		>
			{children}
		</div>
	)
}
StyleProvider.displayName = 'Interface.StyleProvider'
