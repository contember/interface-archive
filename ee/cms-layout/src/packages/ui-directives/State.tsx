import { PropsWithChildren, memo } from 'react'

export const StateManager = memo<PropsWithChildren>(({
  children,
}) => {
  return (
    <>
      {children}
    </>
  )
})
StateManager.displayName = 'StateManager'
