import { createContext, useContext } from 'react'
import { ThemeScheme } from './Types'

/** @deprecated (no alternative) */
export const ThemeSchemeContext = createContext<ThemeScheme>({})
/** @deprecated (no alternative) */
export const TitleThemeSchemeContext = createContext<ThemeScheme>({})

/** @deprecated (no alternative) */
export const useThemeScheme = ({
   scheme,
   theme,
   themeContent,
   themeControls,
}: ThemeScheme) => {
	const themeScheme = useContext(ThemeSchemeContext)

	return {
		scheme,
		theme,
		themeContent,
		themeControls,
		...themeScheme,
	}
}

/** @deprecated (no alternative) */
export const useTitleThemeScheme = ({
	scheme,
	theme,
	themeContent,
	themeControls,
}: ThemeScheme) => {
	const themeScheme = useContext(TitleThemeSchemeContext)

	return {
		scheme,
		theme,
		themeContent,
		themeControls,
		...themeScheme,
	}
}
