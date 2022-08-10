import type { AccessorTreeState } from './AccessorTreeState'
import type { AccessorTreeStateAction } from './AccessorTreeStateAction'

export const accessorTreeStateReducer = (
	previousState: AccessorTreeState,
	action: AccessorTreeStateAction,
): AccessorTreeState => {
	switch (action.type) {
		case 'setData':
			if (previousState.name === 'error' || previousState.binding !== action.binding) {
				return previousState
			}
			return {
				binding: previousState.binding,
				name: 'initialized',
				environment: previousState.environment,
				data: action.data,
			}
		case 'failWithError':
			if (previousState.binding !== action.binding) {
				return previousState
			}
			return {
				binding: previousState.binding,
				environment: previousState.environment,
				name: 'error',
				error: action.error,
			}
		case 'reset':
			return {
				name: 'initializing',
				environment: action.environment,
				binding: action.binding,
			}
	}
}
