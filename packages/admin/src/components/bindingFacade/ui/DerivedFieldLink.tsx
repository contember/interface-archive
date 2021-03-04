import { Component, FieldValue, SugaredField, SugaredRelativeSingleField, useDerivedField } from '@contember/binding'
import { ReactNode, ComponentType, ReactElement, memo, useCallback, useMemo, useRef, useState, FC, FunctionComponent, Fragment, PureComponent, useEffect } from 'react'

export interface DerivedFieldLinkProps<SourcePersisted extends FieldValue = FieldValue> {
	sourceField: string | SugaredRelativeSingleField
	derivedField: string | SugaredRelativeSingleField
	transform?: (sourceValue: SourcePersisted | null) => SourcePersisted | null
	agent?: string
}

export const DerivedFieldLink: FunctionComponent<DerivedFieldLinkProps> = Component(
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
