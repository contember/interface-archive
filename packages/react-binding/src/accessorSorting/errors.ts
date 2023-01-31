import { EntityListAccessor } from '@contember/binding'
import { BindingError } from '@contember/binding'
import type { FieldName } from '@contember/binding'
import type { SortedEntities } from './SortedEntities'

export const throwNoopError = (callbackName: keyof SortedEntities) => {
	throw new BindingError(
		`Cannot invoke '${callbackName}' in non-sortable mode. The 'sortByField' parameter of the 'useSortedEntities' ` +
			`hook is undefined.`,
	)
}
