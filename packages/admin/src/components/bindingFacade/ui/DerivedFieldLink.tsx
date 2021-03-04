import { Component, FieldValue, SugaredField, SugaredRelativeSingleField, useDerivedField } from '@contember/binding'
import * as React from 'react'

export interface DerivedFieldLinkProps<SourcePersisted extends FieldValue = FieldValue> {
	sourceField: string | SugaredRelativeSingleField
	derivedField: string | SugaredRelativeSingleField
	transform?: (sourceValue: SourcePersisted | null) => SourcePersisted | null
	agent?: string
}

export const DerivedFieldLink: React.FunctionComponent<DerivedFieldLinkProps> = Component(
	props => {
		useDerivedField(props.sourceField, props.derivedField, props.transform, props.agent)
		return null
	},
	props => (
		<>
			<SugaredField field={props.sourceField} />
			<SugaredField field={props.derivedField} />
		</>
	),
	'DerivedFieldLink',
)
