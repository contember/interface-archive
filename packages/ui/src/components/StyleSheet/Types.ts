export type ProcessedStyleSheetClassName = null | string[]
export type StyleSheetClassName = string | number | boolean | null | undefined | {}

export type StyleSheetPlaceholderKey = `\$\{${string}\}`
export type StyleSheetPlaceholderValue = string

export type StyleSheetVariableKey = `\$${string}`
export type StyleSheetVariableValue = string | number | boolean | null | undefined

export type ToStyleSheet<T> =
  T extends number | null | undefined ? undefined :
  T extends string | Iterable<any> ? { $: ProcessedStyleSheetClassName } :
  T extends Record<infer K, unknown> ? {
    [Property in K]:
    Property extends StyleSheetVariableKey ? Property extends '$' ? ProcessedStyleSheetClassName :
    Property extends StyleSheetPlaceholderKey
    ? (T[Property] extends StyleSheetPlaceholderValue ? T[Property] : never)
    : (T[Property] extends StyleSheetVariableValue ? T[Property] : never)
    : ToStyleSheet<T[Property]>
  }
  : never

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

export type ObjectExceptArray = { join?: never, [key: string]: any }

export type SubComponentsStyleSheet<SubComponent extends string> = {
  [key in SubComponent]: StyleSheetClassName
}

export type ComponentStyleSheet<T extends ObjectExceptArray = {}> = T | { [key: string]: any }

export type PropsWithClassName<T extends ObjectExceptArray = {}> = {
  className?: ComponentStyleSheet<T>
}
