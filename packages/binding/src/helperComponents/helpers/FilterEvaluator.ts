import { Schema } from '../../core/schema'
import { GraphQlLiteral, Input } from '@contember/client'
import { EntityAccessor } from '../../accessors'
import { Filter, Scalar } from '../../treeParameters'
import { BindingError } from '../../BindingError'


const unwrapGraphqlLiteral = (value: Input.ColumnValue<GraphQlLiteral>): any => {
	if (value instanceof GraphQlLiteral) {
		return value.value
	}
	return value
}

export class FilterEvaluator {
	constructor(
		private readonly schema: Schema,
	) {
	}


	evaluateFilter(entity: EntityAccessor, filter: Filter): boolean {
		const entitySchema = this.schema.store.entities.get(entity.name)
		if (!entitySchema) {
			throw new BindingError()
		}
		let acc = true
		for (const [key, value] of Object.entries(filter)) {
			switch (key) {
				case 'and':
					if (!Array.isArray(value)) {
						throw new BindingError()
					}
					acc &&= value.every(it => this.evaluateFilter(entity, it))
					break
				case 'or':
					if (!Array.isArray(value)) {
						throw new BindingError()
					}
					acc &&= value.some(it => this.evaluateFilter(entity, it))
					break
				case 'not':
					acc &&= !this.evaluateFilter(entity, value as Filter)
					break
			}
			const field = entitySchema.fields.get(key)
			if (!field) {
				throw new BindingError()
			}
			if (field.__typename === '_Column') {
				acc &&= this.evaluateCondition(entity.getField(key).value, value as Input.Condition)
			} else {
				acc &&= this.evaluateFilter(entity.getEntity(key), value as Filter)
			}
		}
		return acc
	}

	evaluateCondition(value: Scalar | null, condition: Input.Condition<Input.ColumnValue<GraphQlLiteral>>) {
		const handlers: {
			[K in keyof Required<Input.Condition<any>>]: (
				param: Exclude<Input.Condition<any>[K], undefined>,
			) => boolean
		} = {
			and: expr => expr.every(it => this.evaluateCondition(value, it)),
			or: expr => expr.some(it => this.evaluateCondition(value, it)),
			not: expr => !this.evaluateCondition(value, expr),
			eq: expr => value === unwrapGraphqlLiteral(expr),
			notEq: expr => value !== unwrapGraphqlLiteral(expr),
			isNull: expr => value === null,
			in: expr => expr.map(unwrapGraphqlLiteral).includes(value),
			notIn: expr => !expr.map(unwrapGraphqlLiteral).includes(value),
			lt: expr => value !== null && value < unwrapGraphqlLiteral(expr),
			lte: expr => value !== null && value <= unwrapGraphqlLiteral(expr),
			gt: expr => value !== null && value > unwrapGraphqlLiteral(expr),
			gte: expr => value !== null && value >= unwrapGraphqlLiteral(expr),
			contains: expr => typeof value === 'string' && value.includes(unwrapGraphqlLiteral(expr)),
			startsWith: expr => typeof value === 'string' && value.startsWith(unwrapGraphqlLiteral(expr)),
			endsWith: expr => typeof value === 'string' && value.endsWith(unwrapGraphqlLiteral(expr)),
			containsCI: expr => typeof value === 'string' && value.toLowerCase().includes(unwrapGraphqlLiteral(expr).toLowerCase()),
			startsWithCI: expr => typeof value === 'string' && value.toLowerCase().startsWith(unwrapGraphqlLiteral(expr).toLowerCase()),
			endsWithCI: expr => typeof value === 'string' && value.toLowerCase().endsWith(unwrapGraphqlLiteral(expr).toLowerCase()),
			never: () => false,
			always: () => true,
			// deprecated
			null: expr => expr === true ? value === null : value !== null,
		}
		return Object.entries(condition).every(([operator, argument]) => {
			if (value === undefined) {
				return true
			}
			const handlerKey = operator as keyof typeof handlers
			const handler = handlers[handlerKey]
			if (!handler) {
				throw new BindingError()
			}
			return handler(argument)
		})
	}
}
