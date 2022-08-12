import { Alpha, NotArray } from '@contember/react-utils'

export type StyleSheetVariableKey = `\$${Alpha}${string}`
export type StyleSheetVariableValue = StyleSheetValueResolver | string | number | boolean | null | undefined

export type StyleSheetVariableValueResolved = string | number | boolean | null | undefined
export type StyleSheetValueResolver = (variables: Record<StyleSheetVariableKey, StyleSheetVariableValueResolved>) => StyleSheetVariableValueResolved

export type UnprocessedClassNameListValue = StyleSheetValueResolver | string | null | false | undefined
export type ProcessedClassNameListValue = (string | StyleSheetValueResolver)[]

export type StyleSheetClassNameObject = NotArray<{
  [key: `${Alpha}${string}`]: StyleSheetClassName,
  [key: StyleSheetVariableKey]: StyleSheetVariableValue,
  $?: UnprocessedClassNameListValue | Iterable<UnprocessedClassNameListValue>
}>

export type StyleSheetClassName =
  | Iterable<UnprocessedClassNameListValue>
  | UnprocessedClassNameListValue
  | StyleSheetClassNameObject

export type ToStyleSheet<T> =
  T extends number | boolean | null | undefined ? undefined :
  T extends StyleSheetValueResolver | string | Iterable<any> ? { $: ProcessedClassNameListValue } :
  T extends object
  ? { [Property in keyof T]:
    Property extends `\$${string}`
    ? (
      Property extends '$'
      ? ProcessedClassNameListValue
      : (
        T[Property] extends StyleSheetVariableValue
        ? T[Property]
        : never
      )
    )
    : ToStyleSheet<T[Property]>
  }
  : never

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type SubComponentsStyleSheet<SubComponent extends string> = {
  [key in SubComponent]: StyleSheetClassName
}

export type ComponentStyleSheet<S extends StyleSheetClassNameObject = {}> = S & StyleSheetClassNameObject

export type PropsWithClassName<T extends StyleSheetClassName = StyleSheetClassName> = {
  className?: T
}
