import { useDataViewDisplayedState } from '@contember/react-dataview'
import { useMemo } from 'react'

export const useDataGridHiddenColumns = () => {
	const selection = useDataViewDisplayedState()?.selection

	return useMemo(() => {
		return Object.fromEntries(
			Object.entries(selection?.values?.visibility ?? {})
				.filter(([key, value]) => value === false)
				.map(([key, value]) => [key, true]),
		)
	}, [selection?.values?.visibility])
}
