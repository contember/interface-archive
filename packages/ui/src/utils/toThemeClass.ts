import { Intent } from '../types'

export const _toThemeClass = <T extends Intent>(theme?: T, suffix?: 'content' | 'controls'): string | undefined => theme && [
  'cui-theme',
  ['theme', theme, suffix].filter(Boolean).join('-'),
].join(' ')

const REQUIRED_THEME_CLASS = 'cui-theme'

export const toThemeClass = <T extends Intent>(theme?: T | null, contentTheme?: T | null, controlsTheme?: T | null): string | undefined => {
  const content = contentTheme || theme
  const controls = controlsTheme || theme

  if (content === controls) {
    const both = content

    return both ? `${REQUIRED_THEME_CLASS} theme-${both}` : undefined
  }

  if (content || controls) {
    return [
      REQUIRED_THEME_CLASS,
      content ? `theme-${content}-content` : undefined,
      controls ? `theme-${controls}-controls` : undefined,
    ].filter(Boolean).join(' ')
  }
}
