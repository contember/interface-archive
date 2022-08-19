import { CLASS_NAME_RESET_STRING } from '.'
import { isNonEmptyString } from './TypePredicates'
import { StyleSheetValueResolver } from './Types'

type TypedObjectEntries = <K extends PropertyKey, V>(o: { [P in K]?: V }) => [K, V][]
type TypedObjectFromEntries = <K extends PropertyKey, V>(entries: [K, V][]) => Record<K, V>

export const entriesFromObject: TypedObjectEntries = Object.entries
export const objectFromEntries: TypedObjectFromEntries = Object.fromEntries

export function excludeFromArray<T, E extends T>(exclude: E, array: Array<T>): Array<Exclude<T, E>> {
  return array.filter(value => value !== exclude) as Array<Exclude<T, E>>
}

export const KEEP_RESET_CLASS_NAME = true
export const REMOVE_RESET_CLASS_NAME = false

export function filterResetClassNames<T extends any>(value: T[], keepResetClassName: boolean): T[] {
  const index = value.lastIndexOf(CLASS_NAME_RESET_STRING as T)

  return index < 0 ? value : value.slice(index + (keepResetClassName ? 0 : 1))
}

export function deepMerge(base: any, extension: any) {
  if (extension === undefined) {
    return base
  } else if (typeof base === typeof extension) {
    if (Array.isArray(base) && Array.isArray(extension)) {
      return filterResetClassNames([...base, ...extension], KEEP_RESET_CLASS_NAME)
    } else if (base && typeof base === 'object' && !Array.isArray(base) && !Array.isArray(extension)) {
      const keys = [...new Set([...Object.keys(base), ...Object.keys(extension)])]
      const entries: [string, any][] = keys.map(
        key => [key, deepMerge(base[key], extension[key])],
      )

      return objectFromEntries(entries)
    } else {
      return extension
    }
  } else {
    return extension
  }
}

export function splitStringToStringList(value: string): string[] {
  return value.split(' ').filter(Boolean)
}

const REASONABLE_ARRAY_FLAT_DEPTH = 9

export function toFlatArrayOfClassNameValues(value: (StyleSheetValueResolver | string | number | boolean | null | undefined)[]): (string | StyleSheetValueResolver)[] {
  return excludeFromArray(null, value.flat(REASONABLE_ARRAY_FLAT_DEPTH).map(
    value => isNonEmptyString(value) ? splitStringToStringList(value) : typeof value === 'function' ? value : null,
  )).flat(1)
}
