import type { TreeRootAccessor } from '../accessors'
import type { RequestError } from './RequestError'
import { DataBinding } from '../core'

export type AccessorTreeStateAction =
	| {
			type: 'setData'
			data: TreeRootAccessor
			binding: DataBinding
	  }
	| {
			type: 'failWithError'
			error: RequestError
			binding: DataBinding
	  }
	| {
			type: 'reset'
			binding: DataBinding
	  }
