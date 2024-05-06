import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Component, Field } from '../coreComponents'
import { EntityAccessor } from '@contember/binding'
import { QueryLanguage } from '@contember/binding'
import { useEntity, useEnvironment } from '../accessorPropagation'
import { Filter } from '@contember/binding'
import { FilterFieldsCollector } from './helpers/FilterFieldsCollector'
import { FilterEvaluator } from './helpers/FilterEvaluator'
import { createRequiredContext } from '@contember/react-utils'

export type IfProps =
	| IfFilterProps
	| IfCallbackProps

export type IfBaseProps = {
	children?: ReactNode;
};

export type IfFilterProps = {
	condition: string | Filter
} & IfBaseProps

export type IfCallbackProps = {
	condition: (accessor: EntityAccessor) => boolean
} & IfBaseProps

export type ThenProps = {
	children?: ReactNode
}

export const [IfContext, useIfContext] = createRequiredContext<boolean>('IfContext')

/**
 * @group Logic Components
 */
export const If = Component<IfProps>(props => {
		return typeof props.condition !== 'function'
			? <IfFilter condition={props.condition}>{props.children}</IfFilter>
			: <IfCallback condition={props.condition}>{props.children}</IfCallback>
	},
	'If',
)

const IfCallback = Component<IfCallbackProps>(
	({ children, condition }) => {
		const entity = useEntity()
		const evaluated = useMemo(() => condition(entity), [condition, entity])

		return <IfContext.Provider value={evaluated}>{children}</IfContext.Provider>
	},
	({ children }) => {
		return <>
			{children}
		</>
	},
	'IfCallback',
)

const IfFilter = Component<IfFilterProps>(
	({ children, condition }) => {
		const env = useEnvironment()
		const entity = useEntity()

		const schema = env.getSchema()
		const evaluated = useMemo(
			() => new FilterEvaluator(schema).evaluateFilter(entity, QueryLanguage.desugarFilter(condition, env)),
			[condition, entity, env, schema],
		)

		return <IfContext.Provider value={evaluated}>{children}</IfContext.Provider>
	},
	({ children, condition }, env) => {
		const desugaredFilter = QueryLanguage.desugarFilter(condition, env)
		const collectedFields = new FilterFieldsCollector(env.getSchema(), desugaredFilter).collectFields(env.getSubTreeNode().entity)
		const additionalFields = <>{Array.from(collectedFields).map(it => <Field field={it} key={it} />)}</>

		return <>
			{additionalFields}
			{children}
		</>
	},
	'IfFilter',
)

export const Then = (({ children }: ThenProps) => {
	const evaluated = useIfContext()
	return evaluated ? <>{children}</> : null
})

export const Else = (({ children }: ThenProps) => {
	const evaluated = useIfContext()
	return evaluated ? null : <>{children}</>
})
