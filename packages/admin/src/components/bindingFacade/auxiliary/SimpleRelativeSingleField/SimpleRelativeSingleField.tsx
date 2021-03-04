import {
	Component,
	Environment,
	Field,
	FieldAccessor,
	FieldBasicProps,
	Scalar,
	StaticRenderProvider,
} from '@contember/binding'
import { GraphQlBuilder } from '@contember/client'
import { FormGroupProps } from '@contember/ui'
import { NamedExoticComponent, ReactNode } from 'react'
import { SimpleRelativeSingleFieldProxy } from './SimpleRelativeFieldProxy'

export type SimpleRelativeSingleFieldProps = FieldBasicProps & Omit<FormGroupProps, 'children'>

export interface SimpleRelativeSingleFieldMetadata<
	Persisted extends Scalar | GraphQlBuilder.Literal = Scalar | GraphQlBuilder.Literal,
	Produced extends Persisted = Persisted
> {
	field: FieldAccessor<Persisted, Produced>
	environment: Environment
	isMutating: boolean
}

export const SimpleRelativeSingleField = function <
	P extends FieldBasicProps & Omit<FormGroupProps, 'children'>,
	Persisted extends Scalar | GraphQlBuilder.Literal = Scalar | GraphQlBuilder.Literal,
	Produced extends Persisted = Persisted
>(
	render: (fieldMetadata: SimpleRelativeSingleFieldMetadata<Persisted, Produced>, props: P) => ReactNode,
	displayName: string,
	defaultProps?: Partial<P>,
): NamedExoticComponent<P> & StaticRenderProvider<P> {
	return Component<P>(
		props => <SimpleRelativeSingleFieldProxy {...defaultProps} {...props} render={render} />,
		(props: P) => {
			const normalizedProps = {
				...defaultProps,
				...props,
			}
			return (
				<>
					<Field
						defaultValue={normalizedProps.defaultValue}
						field={normalizedProps.field}
						isNonbearing={normalizedProps.isNonbearing}
					/>
					{normalizedProps.label}
					{normalizedProps.labelDescription}
					{normalizedProps.description}
				</>
			)
		},
		displayName,
	)
}
