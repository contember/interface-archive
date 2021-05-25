import { useCallback } from 'react'
import type { Alias, SugaredQualifiedEntityList, SugaredUnconstrainedQualifiedEntityList } from '../treeParameters'
import { useAccessorUpdateSubscription } from './useAccessorUpdateSubscription'
import { useEntityListSubTreeParameters } from './useEntityListSubTreeParameters'
import { useGetEntityListSubTree } from './useGetEntityListSubTree'

export const useEntityListSubTree = (
	qualifiedEntityList: Alias | SugaredQualifiedEntityList | SugaredUnconstrainedQualifiedEntityList,
) => {
	const getSubTree = useGetEntityListSubTree()
	const parameters = useEntityListSubTreeParameters(qualifiedEntityList)
	const getAccessor = useCallback(() => getSubTree(parameters), [getSubTree, parameters])

	// if (typeof parameters !== 'string' && parameters.value.hasOneRelationPath.length) {
	// 	throw new BindingError(`useEntityListSubTree: cannot use hasOneRelationPath!`)
	// }

	return useAccessorUpdateSubscription(getAccessor)
}
