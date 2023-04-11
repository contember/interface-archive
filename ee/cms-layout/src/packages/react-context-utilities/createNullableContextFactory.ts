import type { Context } from 'react'
import { createContext, useContext } from 'react'

export function createNullableContextFactory<T>(name: string): [Context<T | null | undefined>, () => T | null | undefined] {
  const MaybeContext = createContext<T | null | undefined>(null)
  MaybeContext.displayName = name

  const useMaybeContext = () => {
    return useContext(MaybeContext)
  }

  return [MaybeContext, useMaybeContext]
}
