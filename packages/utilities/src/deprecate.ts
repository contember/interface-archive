import semver from 'semver'

const next = '1.3.0'

type SemverString = `${number}.${number}.${number}` | `v${number}.${number}.${number}`

export function deprecate(removal: SemverString, deprecatedName: string, replacementName: string): void;
export function deprecate<R, D extends R>(removal: SemverString, deprecatedName: string, replacementName: string, deprecated: undefined, replacement: undefined): void;
export function deprecate<R, D extends R>(removal: SemverString, deprecatedName: string, replacementName: string, deprecated: D, replacement: undefined): D;
export function deprecate<R, D extends R>(removal: SemverString, deprecatedName: string, replacementName: string, deprecated: undefined, replacement: R): R;
export function deprecate<R, D extends R>(removal: SemverString, deprecatedName: string, replacementName: string, deprecated: D, replacement: R): R;
export function deprecate<R, D extends R>(removal: SemverString, deprecatedName: string, replacementName: string, deprecated?: D | undefined, replacement?: R | undefined): D | R | undefined {
	if (deprecated == undefined) {
		return replacement
	} else {
		if (import.meta.env.DEV) {
			if (semver.satisfies(next, `>=${removal}`)) {
				console.error(`Use of ${formatted(deprecatedName)} was planned to be removed in the ${removal} release. Replace it with ${formatted(replacementName)} instead.`)
			} else {
				console.warn(`Use of ${formatted(deprecatedName)} is deprecated and might be removed in the next release. Use ${formatted(replacementName)} instead.`)
			}
		}

		if (replacement) {
			if (import.meta.env.DEV) {
				throw new Error(`You are using deprecated ${formatted(deprecatedName)} together with ${formatted(replacementName)} value which is mutually exclusive. Use only one of them.`)
			}

			return replacement
		} else {
			return deprecated
		}
	}
}

function formatted(name: string): string {
	if (name.match(/^[\w\.-]+$/)) {
		return '`' + name + '`'
	} else {
		return name
	}
}
