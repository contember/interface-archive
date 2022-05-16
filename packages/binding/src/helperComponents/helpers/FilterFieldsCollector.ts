import { Schema } from '../../core/schema'
import { Filter } from '../../treeParameters'
import { BindingError } from '../../BindingError'

export class FilterFieldsCollector {
	constructor(
		private readonly schema: Schema,
	) {
	}


	collectFields(filter: Filter, entityName: string): Set<string> {
		const result = new Set<string>()
		this.collectFieldsInternal(filter, entityName, [], result)
		return result
	}

	collectFieldsInternal(filter: Filter, entityName: string, path: string[], result: Set<string>): void {
		const entity = this.schema.store.entities.get(entityName)
		if (!entity) {
			throw new BindingError()
		}
		for (const [key, value] of Object.entries(filter)) {
			switch (key) {
				case 'and':
				case 'or':
					if (!Array.isArray(value)) {
						throw new BindingError()
					}
					value.forEach(it => this.collectFieldsInternal(it, entityName, path, result))
					break
				case 'not':
					this.collectFieldsInternal(value as Filter, entityName, path, result)
					break
			}
			const field = entity.fields.get(key)
			if (!field) {
				throw new BindingError()
			}
			if (field.__typename === '_Column') {
				result.add([...path, key].join('.'))
			} else {
				this.collectFieldsInternal(value as Filter, field.targetEntity, [...path, key], result)
			}
		}
	}
}
