import { deprecate, themeClassName } from '@contember/utilities'
import { Intent } from '../types'

const REQUIRED_THEME_CLASS = 'cui-theme'

/**
 * @deprecated Use `themeClassName` from `@contember/react-utils` instead.
 * @see themeClassName
 */
export const toThemeClass = <T extends string = Intent>(
	contentTheme: T | null | undefined,
	controlsTheme: T | null | undefined,
	suffix: string = '',
): string | undefined => {
	deprecate('1.3.0', true, 'toThemeClass function', 'import { themeClassName } from \'@contember/react-utils\'')

	if (contentTheme === controlsTheme) {
		const both = contentTheme

		return both ? `${REQUIRED_THEME_CLASS} theme-${both}${suffix}` : undefined
	}

	return [
		REQUIRED_THEME_CLASS,
		contentTheme ? `theme-${contentTheme}-content${suffix}` : undefined,
		controlsTheme ? `theme-${controlsTheme}-controls${suffix}` : undefined,
	].filter(Boolean).join(' ')
}
