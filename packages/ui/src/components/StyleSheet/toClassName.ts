import { useMemo } from 'react'
import { deepMerge } from './Helpers'
import { toStyleSheet } from './toStyleSheet'
import { StyleSheetClassName, ToStyleSheet, UnionToIntersection } from './Types'

export function toClassName<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  const [one, two, ...rest] = styles

  const partial = deepMerge(
    toStyleSheet(one),
    toStyleSheet(two),
  )

  if (rest.length > 0) {
    return toClassName(partial, ...rest)
  } else {
    return partial
  }
}

export function useToClassName<T extends StyleSheetClassName[]>(...styles: T): UnionToIntersection<ToStyleSheet<T[number]>> {
  return useMemo(() => toClassName(...styles), [styles])
}
