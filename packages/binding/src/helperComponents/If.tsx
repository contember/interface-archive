import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Component, Field } from '../coreComponents'
import { EntityAccessor } from '../accessors'
import { QueryLanguage } from '../queryLanguage'
import { useEntity, useEnvironment } from '../accessorPropagation'
import { Filter } from '../treeParameters'
import { FilterFieldsCollector } from './helpers/FilterFieldsCollector'
import { FilterEvaluator } from './helpers/FilterEvaluator'

export type IfProps =
	| IfFilterProps
	| IfCallbackProps

export interface IfFilterProps {
	condition: string | Filter
	children?: ReactNode
}

export interface IfCallbackProps {
	condition: (accessor: EntityAccessor) => boolean
	children?: ReactNode
}

export const If = Component<IfProps>(props => {
		return typeof props.condition !== 'function'
			? <IfFilter {...(props as IfFilterProps)} />
			: <IfCallback {...(props as IfCallbackProps)} />
	},
	'If',
)

const IfCallback = Component<IfCallbackProps>(
	({ children, condition }) => {
		const entity = useEntity()
		const evaluated = useMemo(() => condition(entity), [condition, entity])

		return evaluated ? <>{children}</> : null
	},
	({ children }) => {
		return <>{children}</>
	},
	'IfCallback',
)

const IfFilter = Component<IfFilterProps>(
	({ children, condition }) => {
		const env = useEnvironment()
		const entity = useEntity()

		const desugaredFilter = useMemo(() => QueryLanguage.desugarFilter(condition, env), [condition, env])
		const schema = env.getSchema()
		const evaluated = useMemo(
			() => new FilterEvaluator(schema).evaluateFilter(entity, desugaredFilter!),
			[desugaredFilter, entity, schema],
		)

		return evaluated ? <>{children}</> : null
	},
	({ children, condition }, env) => {
		const desugaredFilter = QueryLanguage.desugarFilter(condition, env)
		const collectedFields = new FilterFieldsCollector(env.getSchema()).collectFields(desugaredFilter, env.getSubTreeNode().entity.name)
		const additionalFields = <>{Array.from(collectedFields).map(it => <Field field={it} key={it} />)}</>

		return <>
			{additionalFields}
			{children}
		</>
	},
	'IfFilter',
)

