import { useMemo } from 'react'
import { entriesFromObject, excludeFromArray, filterResetClassNames, objectFromEntries, REMOVE_RESET_CLASS_NAME } from './Helpers'
import { toClassName } from './toClassName'
import { toClassNameList } from './toClassNameList'
import { subComponentEntries, variableEntries } from './toStyleSheet'
import { isResolvedValue, isValueResolver } from './TypePredicates'
import { StyleSheetClassName, StyleSheetValueResolver, StyleSheetVariableKey, StyleSheetVariableValue, StyleSheetVariableValueResolved, ToStyleSheet, UnionToIntersection } from './Types'

type VariableReplacements = [RegExp, StyleSheetVariableValue][]

function replacePlaceholders(value: string, replacements: VariableReplacements, iterations: number = 2) {
  for (let i = 0; i < iterations; i++) {
    replacements.forEach(
      ([from, to]) => {
        if (to !== null && to !== undefined) {
          if (typeof to !== 'function') {
            value = value.replace(from, `${to}`)
          }
        }
      },
    )
  }

  return value
}

function toRegExp(from: string): RegExp {
  return new RegExp(`\\${from}\\b`)
}

function toVariableReplacements(value: Record<string, StyleSheetVariableValue>): VariableReplacements {
  return Object.entries(value).map(
    ([key, value]) => [toRegExp(key), value],
  )
}

function onlyResolvedEntries(entries: [StyleSheetVariableKey, StyleSheetVariableValue][]): [StyleSheetVariableKey, StyleSheetVariableValueResolved][] {
  return excludeFromArray(null, entries.map(
    ([key, value]) => isResolvedValue(value) ? [key, value] : null,
  ))
}

function resolveCallableVariablesEntries(entries: [StyleSheetVariableKey, StyleSheetVariableValue][]): [StyleSheetVariableKey, StyleSheetVariableValue][] {
  const allEntriesCount = entries.length

  const resolvedEntries = onlyResolvedEntries(entries)
  const resolvedEntriesCountBefore = resolvedEntries.length

  if (resolvedEntriesCountBefore === allEntriesCount) {
    return entries
  }

  const resolved = objectFromEntries(resolvedEntries)

  const processed: [StyleSheetVariableKey, StyleSheetVariableValue][] = entries.map(
    ([key, value]) => {
      if (isValueResolver(value)) {
        const maybeResolved = value(resolved)

        if (maybeResolved !== undefined) {
          return [key, maybeResolved]
        }
      }

      return [key, value]
    })

  const resolvedEntriesCountAfter = processed.filter(
    ([, value]) => !isValueResolver(value),
  ).length

  if (resolvedEntriesCountAfter > resolvedEntriesCountBefore) {
    return resolveCallableVariablesEntries(processed)
  } else {
    return processed
  }
}

const UNREPLACED_VARIABLE = /\$[\w_]+/

function isReplaced(value: unknown): boolean {
  return !(typeof value === 'string' && value.match(UNREPLACED_VARIABLE))
}

function resolveArray(value: (string | StyleSheetValueResolver)[], variables: Record<`$${string}`, StyleSheetVariableValue>): string[] & string {
  const resolvedVariables = objectFromEntries(
    onlyResolvedEntries(
      resolveCallableVariablesEntries(
        variableEntries(
          entriesFromObject(variables),
        ),
      ),
    ),
  )

  const replaced = value.map(
    v => typeof v === 'function' ? v(resolvedVariables) : v,
  ).map(
    v => typeof v === 'string'
      ? replacePlaceholders(v, toVariableReplacements(resolvedVariables))
      : typeof v === 'function' ? undefined : v,
  )

  replaced.toString = function toString(): string {
    return this.filter(isReplaced).join(' ')
  }

  return replaced as string[] & string
}

export function resolveStyleSheet<T extends StyleSheetClassName[]>(...styles: T): [(string[] & string) | undefined, Omit<UnionToIntersection<ToStyleSheet<T[number]>>, '$'>] {
  const merged: Record<string, any> = toClassName(...styles) ?? {} as any
  const entries = entriesFromObject(merged as Record<string, any>)
  const rootVariables = objectFromEntries(variableEntries(entries))

  const $ = resolveArray(filterResetClassNames(toClassNameList(merged.$), REMOVE_RESET_CLASS_NAME), rootVariables)

  const subComponents: [string, any][] = excludeFromArray(null, subComponentEntries(entries).map(
    ([key, value]) => {
      if (value) {
        value.$ = value.$ !== null
          ? resolveArray(
            toClassNameList(value.$),
            { ...rootVariables, ...objectFromEntries(variableEntries(entriesFromObject(value))) },
          )
          : null

        value.toString = function toString(): string {
          return Array.isArray(this?.$) ? `${filterResetClassNames(this.$, REMOVE_RESET_CLASS_NAME)}` : this?.$
        }

        return [key, value]
      }

      return null
    },
  ))

  return [$, objectFromEntries(subComponents) as Omit<UnionToIntersection<ToStyleSheet<T[number]>>, '$'>]
}

export function useResolveStyleSheet<T extends StyleSheetClassName[]>(...styles: T): [(string[] & string) | undefined, Omit<UnionToIntersection<ToStyleSheet<T[number]>>, '$'>] {
  return useMemo(() => resolveStyleSheet(...styles), [styles])
}
