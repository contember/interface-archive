import { useMemo } from 'react'
import { deepMerge } from './Helpers'
import { toStyleSheet } from './toStyleSheet'
import { StyleSheetClassName, ToStyleSheet, UnionToIntersection } from './Types'

export function extendStyleSheet<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  const [one, two, ...rest] = styles

  const partial = deepMerge(
    toStyleSheet(one as any),
    toStyleSheet(two as any),
  )

  if (rest.length > 0) {
    return extendStyleSheet(partial, ...rest)
  } else {
    return partial
  }
}

export function useExtendStyleSheet<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  return useMemo(() => extendStyleSheet(...styles), [styles])
}

export function createStyleSheet<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  return extendStyleSheet(...styles)
}

export function useCreateStyleSheet<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  return useMemo(() => createStyleSheet(...styles), [styles])
}
