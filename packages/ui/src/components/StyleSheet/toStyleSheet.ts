import { entriesFromObject, excludeFromArray, objectFromEntries, splitStringToStringList, toFlatArrayOfNonEmptyStrings } from './Helpers'
import { toClassNameList } from './toClassNameList'
import { isPlaceholderKey, isPlaceholderValue, isRegularKey, isVariableKey, isVariableValue } from './TypePredicates'
import { ProcessedStyleSheetClassName, StyleSheetPlaceholderKey, StyleSheetPlaceholderValue, StyleSheetVariableKey, StyleSheetVariableValue, ToStyleSheet } from './Types'

export function variableEntries(entries: [string, any][]): [StyleSheetVariableKey, StyleSheetVariableValue][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => {
      if (isVariableKey(key)) {
        if (isVariableValue(value)) {
          return [key, value]
        } else if (import.meta.env.DEV) {
          throw new Error(`Unexpected '${key}' variable value: ${JSON.stringify(value)}. Use 'string', 'number', 'boolean', 'null' or 'undefined' value type.`)
        }
      }

      return null
    },
  ))
}

export function placeholderEntries(entries: [string, any][]): [StyleSheetPlaceholderKey, StyleSheetPlaceholderValue][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => {
      if (isPlaceholderKey(key)) {
        if (isPlaceholderValue(value)) {
          return [key, value]
        } else if (import.meta.env.DEV) {
          throw new Error(`Unexpected '${key}' placeholder template value: ${JSON.stringify(value)}. Use 'string' instead.`)
        }
      }

      return null
    },
  ))
}

export function subComponentEntries(entries: [string, any][]): [string, any][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => isRegularKey(key)
      ? [key, toStyleSheet(value)]
      : null,
  ))
}

function toStyleSheetFromObject<T extends { [key: string]: any }>(value: T extends Iterable<any> ? never : T) {
  const entries = entriesFromObject<string, any>(value)

  const $: { $?: ProcessedStyleSheetClassName } = value.hasOwnProperty('$') ? { $: value.$ === null ? null : toClassNameList(value.$) } : {}

  const variables: [StyleSheetVariableKey, StyleSheetVariableValue][] = variableEntries(entries)
  const placeholders: [StyleSheetPlaceholderKey, StyleSheetPlaceholderValue][] = placeholderEntries(entries)
  const subComponents: [string, any][] = subComponentEntries(entries)

  return {
    ...$,
    ...objectFromEntries(variables),
    ...objectFromEntries(placeholders),
    ...objectFromEntries(subComponents),
  }
}

export function toStyleSheet<T extends null>(value: T): ToStyleSheet<T>; // undefined;
export function toStyleSheet<T extends number>(value: T): ToStyleSheet<T>; // undefined;
export function toStyleSheet<T extends undefined>(value: T): ToStyleSheet<T>; // undefined;
export function toStyleSheet<T extends string>(value: T): ToStyleSheet<T> // { $: ProcessedStyleSheetClassName };
export function toStyleSheet<T extends Object | Array<any>>(value: T extends Iterable<any> ? (string | null | undefined)[] : T): ToStyleSheet<T> // { $: ProcessedStyleSheetClassName };
export function toStyleSheet<T extends
  | Object | Array<any>
  | string
  | number
  | null
  | undefined
>(value: T): ToStyleSheet<T> {
  if (typeof value === 'number' || value === null || value === undefined) {
    return undefined as ToStyleSheet<T>
  } else if (typeof value === 'string') {
    return { $: splitStringToStringList(value) } as ToStyleSheet<T>
  } else if (Array.isArray(value)) {
    return { $: toFlatArrayOfNonEmptyStrings(value) } as ToStyleSheet<T>
  } else if (typeof value === 'object') {
    return toStyleSheetFromObject(value) as ToStyleSheet<T>
  } else {
    const _exhastiveCheck: never = value
    return undefined as ToStyleSheet<T>
  }
}
