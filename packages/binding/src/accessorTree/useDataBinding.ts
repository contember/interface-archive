import {
	useCurrentContentGraphQlClient,
	useCurrentSystemGraphQlClient,
	useTenantGraphQlClient,
} from '@contember/react-client'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useEnvironment } from '../accessorPropagation'
import type { TreeRootAccessor } from '../accessors'
import { DataBinding } from '../core'
import type { AccessorTreeState } from './AccessorTreeState'
import type { AccessorTreeStateOptions } from './AccessorTreeStateOptions'
import { accessorTreeStateReducer } from './accessorTreeStateReducer'
import type { RequestError } from './RequestError'
import { Environment } from '../dao'
import { SchemaLoader } from '../core/schema'
import { TreeStore } from '../core/TreeStore'
import { useIsMounted } from '@contember/react-utils'

export const useDataBinding = ({
	nodeTree,
	refreshOnPersist = false,
}: AccessorTreeStateOptions): AccessorTreeState => {
	const contentClient = useCurrentContentGraphQlClient()
	const systemClient = useCurrentSystemGraphQlClient()
	const tenantClient = useTenantGraphQlClient()
	const environment = useEnvironment()
	const resetCounter = useRef(0)
	const currentTreeStore = useRef<TreeStore>()

	const isMountedRef = useIsMounted()

	const onUpdate = useCallback((accessor: TreeRootAccessor, binding: DataBinding) => {
		if (!isMountedRef.current) {
			return
		}
		dispatch({
			type: 'setData',
			data: accessor,
			binding,
		})
	}, [isMountedRef])
	const onError = useCallback((error: RequestError, binding: DataBinding) => {
		if (!isMountedRef.current) {
			return
		}
		dispatch({
			type: 'failWithError',
			error,
			binding,
		})
	}, [isMountedRef])

	const createDataBinding = useCallback(
		() => {
			const create = (environment: Environment, treeStore: TreeStore): DataBinding => {
				return new DataBinding(contentClient, systemClient, tenantClient, treeStore, environment, onUpdate, onError, () => {
					if (!isMountedRef.current || !refreshOnPersist) {
						return
					}
					resetBinding(true)
				})
			}
			const resetBinding = async (newStore = false) => {
				const resetId = ++resetCounter.current
				const schema = await SchemaLoader.loadSchema(contentClient)
				const treeStore = currentTreeStore.current && !newStore ? currentTreeStore.current : new TreeStore(schema)
				currentTreeStore.current = treeStore
				const environmentWithSchema = environment.withSchema(schema)
				const binding = await create(environmentWithSchema, treeStore)
				if (resetCounter.current === resetId) {
					dispatch({ type: 'reset', binding, environment: environmentWithSchema })
				}
			}
			return resetBinding()
		},
		[contentClient, systemClient, tenantClient, onUpdate, onError, isMountedRef, refreshOnPersist, environment],
	)

	const [state, dispatch] = useReducer(accessorTreeStateReducer, {
		name: 'initializing',
		environment,
	})

	useEffect(() => {
		createDataBinding()
	}, [createDataBinding])

	const [stableNodeTree] = useState(nodeTree)
	useEffect(() => {
		state.binding?.extendTree(stableNodeTree)
	}, [stableNodeTree, state.binding, state.name])

	return state
}
