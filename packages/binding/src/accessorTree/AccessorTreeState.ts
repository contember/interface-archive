import type { TreeRootAccessor } from '../accessors'
import type { RequestError } from './RequestError'
import { DataBinding } from '../core'
import { Environment } from '../dao'

export interface InitializingAccessorTreeState {
	binding?: DataBinding
	environment: Environment
	name: 'initializing'
}

export interface InitializedAccessorTreeState {
	binding: DataBinding
	environment: Environment
	name: 'initialized'
	data: TreeRootAccessor
}

export interface ErrorAccessorTreeState {
	binding: DataBinding
	environment: Environment
	name: 'error'
	error: RequestError
}

export type AccessorTreeState =
	| InitializingAccessorTreeState
	| InitializedAccessorTreeState
	| ErrorAccessorTreeState
