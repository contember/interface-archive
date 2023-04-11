import { Component, FieldAccessor, FieldFallbackView, FieldValue, FieldValueFormatter, SugaredField, SugaredFieldProps, FieldFallbackViewProps as _FieldFallbackViewProps, useField } from '@contember/admin'
import { ReactElement } from 'react'

type FieldFallbackViewProps =
	| {
		fallback?: _FieldFallbackViewProps['fallback'];
		fallbackStyle?: never;
	}
	| {
		fallback?: never;
		fallbackStyle?: _FieldFallbackViewProps['fallbackStyle'];
	}

export type FieldValueRenderer<FV extends FieldValue = string> = (value: FV | null | undefined, fieldAccessor: FieldAccessor<FV>) => ReactElement

type StringFieldProps<FV extends FieldValue = string> =
	& {
		field: SugaredFieldProps['field'];
	}
	& (
		| {
			children: FieldValueRenderer<FV>;
			fallback?: never;
			fallbackStyle?: never;
			formatValue?: never;
		}
		| {
			children?: never;
			formatValue?: FieldValueFormatter<FV, string>;
		} & FieldFallbackViewProps
	)

export const TextFieldView = Component(
	<FV extends FieldValue = string>({
		children,
		fallback,
		fallbackStyle,
		field,
		formatValue,
	}: StringFieldProps<FV>) => {
		const fieldAccessor = useField<FV>(field)

		if (fieldAccessor.value === null) {
			if (typeof children === 'function') {
				return children(null, fieldAccessor)
			} else {
				return <FieldFallbackView fallback={fallback} fallbackStyle={fallbackStyle} />
			}
		} else {
			if (typeof children === 'function') {
				return children(fieldAccessor.value, fieldAccessor)
			} else {
				return (
					<>{typeof formatValue === 'function' ? formatValue(fieldAccessor.value, fieldAccessor) : fieldAccessor.value}</>
				)
			}
		}

	},
	({ field }) => <SugaredField field={field} />,
	'TextFieldView',
) as <FV extends FieldValue = string>(props: StringFieldProps<FV>) => ReactElement
