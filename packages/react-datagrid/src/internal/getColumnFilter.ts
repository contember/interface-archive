import { Environment, Filter, QueryLanguage } from '@contember/react-binding'
import { DataGridColumnProps, DataGridFilterArtifact } from '../types'

export const getColumnFilter = (
	column: DataGridColumnProps,
	artifact: DataGridFilterArtifact | undefined,
	environment: Environment,
): Filter | undefined => {
	if (column.enableFiltering === false || artifact === undefined) {
		return undefined
	}
	const sugaredFilter = column.getNewFilter(artifact, {
		environment,
	})
	if (sugaredFilter === undefined) {
		return undefined
	}
	return QueryLanguage.desugarFilter(sugaredFilter, environment)
}