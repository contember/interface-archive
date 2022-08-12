export type StyleSheetVariableKey = `\$${string}`
export type StyleSheetVariableValue = StyleSheetValueResolver | string | number | boolean | null | undefined

export type StyleSheetValueResolver = (variables: Record<StyleSheetVariableKey, StyleSheetVariableValue>) => Exclude<StyleSheetVariableValue, StyleSheetValueResolver>

export type ProcessedStyleSheetClassName = undefined | null | (string | StyleSheetValueResolver)[]

export type StyleSheetClassName =
  | (string | StyleSheetValueResolver)[]
  | StyleSheetValueResolver
  | string
  | number
  | boolean
  | null
  | undefined
  | { [Property in string]: (
    Property extends StyleSheetVariableKey
    ? (Property extends '$'
      ? ProcessedStyleSheetClassName
      : StyleSheetVariableValue
    )
    : StyleSheetClassName
  ) }

export type ToStyleSheet<T> =
  T extends number | null | undefined ? undefined :
  T extends StyleSheetValueResolver | string | Iterable<any> ? { $: ProcessedStyleSheetClassName } :
  T extends Record<infer K, unknown>
  ? { [Property in K]:
    Property extends StyleSheetVariableKey
    ? (
      Property extends '$'
      ? ProcessedStyleSheetClassName
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

export type ObjectExceptArray = { join?: never, [key: string]: any }

export type SubComponentsStyleSheet<SubComponent extends string> = {
  [key in SubComponent]: StyleSheetClassName
}

export type ComponentStyleSheet<T extends ObjectExceptArray = {}> = T | { [key: string]: any }

export type PropsWithClassName<T extends ObjectExceptArray = {}> = {
  className?: ComponentStyleSheet<T>
}
