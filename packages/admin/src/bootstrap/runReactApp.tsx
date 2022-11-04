import { ReactElement } from 'react'
import { errorHandler } from './errorHandling'
import * as ReactDOM from 'react-dom'

export { errorHandler }

export const runReactApp = (
	reactElement: ReactElement,
	domRoot?: HTMLElement | string | null,
) => {
	const rootEl = domRoot instanceof HTMLElement
		? domRoot
		: typeof domRoot === 'string'
		? document.querySelector<HTMLElement>(domRoot)
		: document.body.appendChild(document.createElement('div'))

	errorHandler(() => ReactDOM.render(reactElement, rootEl))
}

