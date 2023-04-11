import { useRef } from 'react'

// TODO: Should be possible to remove when React.useEvent() lands
export function useEvent<T extends Function>(callback: T): T {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const stableHandler = useRef((...rest: any[]) => {
    return callbackRef.current(...rest)
  }).current

  return stableHandler as any as T
}
