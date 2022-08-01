import { useMemo } from 'react'
import { extendStyleSheet } from './extendStyleSheet'
import { entriesFromObject, excludeFromArray, objectFromEntries } from './Helpers'
import { toClassNameList } from './toClassNameList'
import { placeholderEntries, subComponentEntries, variableEntries } from './toStyleSheet'
import { StyleSheetClassName, ToStyleSheet, UnionToIntersection } from './Types'

type ReplacementScalar = string | number | boolean | null | undefined

type VariableReplacements = [RegExp, ReplacementScalar][]

function replacePlaceholders(value: string, replacements: VariableReplacements, iterations: number = 2) {
  for (let i = 0; i < iterations; i++) {
    replacements.forEach(
      ([from, to]) => {
        if (to !== null && to !== undefined) {
          value = value.replace(from, `${to}`)
        }
      },
    )
  }

  return value
}

type PlaceholderReplacements = [RegExp, string][]

function toGlobRegExpPattern(pattern: string): RegExp {
  return new RegExp(pattern.replace(/([^a-zA-Z0-9])/g, '\\$1'), 'g')
}

function toPlaceholderReplacements(placeholders: Record<string, string>): PlaceholderReplacements {
  return Object.entries(placeholders).map(
    ([key, value]) => [toGlobRegExpPattern(key), value],
  )
}

function toRegExp(from: string): RegExp {
  return new RegExp(`\\${from}\\b`)
}

function toVariableReplacements(value: Record<string, ReplacementScalar>): VariableReplacements {
  return Object.entries(value).map(
    ([key, value]) => [toRegExp(key), value],
  )
}

const UNREPLACED_VARIABLE = /\$[\w_]+/

function unreplaced(value: string): boolean {
  return !value.match(UNREPLACED_VARIABLE)
}

function resolveArray(value: string[], placeholders: Record<string, string>, variables: Record<string, ReplacementScalar>): string[] & string {
  const replaced = value.map(
    v => replacePlaceholders(
      replacePlaceholders(v, toPlaceholderReplacements(placeholders)),
      toVariableReplacements(variables),
    ),
  )

  replaced.toString = function toString(): string {
    return this.filter(unreplaced).join(' ')
  }

  return replaced as string[] & string
}

export function resolveStyleSheet<T extends StyleSheetClassName[]>(...styles: T): [(string[] & string) | undefined, Omit<UnionToIntersection<ToStyleSheet<T[number]>>, '$'>] {
  const merged: Record<string, any> = extendStyleSheet(...styles) as any
  const entries = entriesFromObject(merged as Record<string, any>)

  const rootPlaceholders = objectFromEntries(placeholderEntries(entries))
  const rootVariables = objectFromEntries(variableEntries(entries))

  const $ = merged.$ !== null ? resolveArray(toClassNameList(merged.$), rootPlaceholders, rootVariables) : undefined
  const subComponents: [string, any][] = excludeFromArray(null, subComponentEntries(entries).map(
    ([key, value]) => {
      if (value) {
        value.$ = value.$ !== null
          ? resolveArray(
            toClassNameList(value.$),
            { ...rootPlaceholders, ...objectFromEntries(placeholderEntries(entriesFromObject(value))) },
            { ...rootVariables, ...objectFromEntries(variableEntries(entriesFromObject(value))) },
          )
          : null

        value.toString = function toString(): string {
          return Array.isArray(this?.$) ? `${this.$}` : this?.$
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
