import * as ReactDOM from 'react-dom'
import { ReactElement } from 'react'

export type ReactRenderer = (domElement: Element, reactElement: ReactElement) => void

export const legacyReactRenderer: ReactRenderer = (domElement, reactElement) => ReactDOM.render(reactElement, domElement)
