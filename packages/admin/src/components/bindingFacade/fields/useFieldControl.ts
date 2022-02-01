import type { FieldAccessor, FieldValue } from '@contember/binding'
import { useEntityBeforePersist } from '@contember/binding'
import { AllOwnControlProps, OwnControlProps } from '@contember/ui'
import { Ref, useCallback, useEffect, useRef, useState } from 'react'
import type { SimpleRelativeSingleFieldMetadata } from '../auxiliary'

export type ControlValueParser<ControlValue, Value extends FieldValue> = (
	value: ControlValue | null | undefined,
	field: FieldAccessor<Value>,
) => Value | null

export type ControlValueFormatter<Value extends FieldValue, ControlValue extends FieldValue> = (
	value: Value | null | undefined,
	field: FieldAccessor<Value>,
) => ControlValue | null

type UseControlProps<
	Value extends FieldValue,
	ControlValue extends FieldValue,
	Type extends string | undefined = string | undefined
> = OwnControlProps<ControlValue> & {
	fieldMetadata: SimpleRelativeSingleFieldMetadata<Value>
	parse: ControlValueParser<ControlValue, Value>
	format: ControlValueFormatter<Value, ControlValue>
	type: Type
}

export const stringFieldParser: ControlValueParser<string, string> = value => value ??  null
export const stringFieldFormatter: ControlValueFormatter<string, string> = value => value ?? ''

export const useFieldControl = <Value extends FieldValue, ControlValue extends FieldValue, Type extends string | undefined = string | undefined>({
	fieldMetadata,
	parse,
	format,
	type,
	...props
}: UseControlProps<Value, ControlValue, Type>): AllOwnControlProps<ControlValue> & {
	type: Type,
	ref: Ref<any>,
} => {
	// TODO: fix unknow
	const ref = useRef()

	// `fieldMetadata.field` is mutable and would otherwise cause render loop
	const field = useRef(fieldMetadata.field)
	field.current = fieldMetadata.field

	const [validationError, setValidationError] = useState<string>()
	const [wasTouched, setWasTouched] = useState<boolean>()

	useEntityBeforePersist(
		useCallback(() => {
			if (validationError) {
				field.current.addError(validationError)
			}
		}, [field, validationError]),
	)

	useEffect(() => {
		if (wasTouched) {
			field.current.clearErrors()

			if (validationError) {
				field.current.addError(validationError)
			}
		}
	}, [validationError, wasTouched])

	return {
		ref,

		...props,

		// ControlValueProps
		defaultValue: format(field.current.defaultValue, field.current) ?? undefined,
		onChange: useCallback((_value?: ControlValue | null) => {
			const value = parse(_value, field.current) ?? null
			const valueOrNull = value || value === 0 ? value : null

			const isEmptyOnServer = field.current.valueOnServer === null
			const isStillEmpty = valueOrNull === null

			field.current.updateValue(isEmptyOnServer && isStillEmpty ? null : value)
		}, [parse]),
		placeholder: props.placeholder,
		type,
		value: format(field.current.value, field.current),

		// ValidationSteteProps
		validationState: field.current.errors ? ('invalid' as const) : undefined,
		onValidationStateChange: useCallback((error?: string) => {
			if (field.current.isTouched) {
				setWasTouched(true)
			}

			setValidationError(error)
		}, [field]),

		// ControlStateProps
		active: props.active,
		readOnly: fieldMetadata.isMutating,
		disabled: fieldMetadata.isMutating,
		loading: fieldMetadata.isMutating,
		required: fieldMetadata.field.schema.nullable === false,
		focused: props.focused,
		hovered: props.hovered,

		// ControlFocusProps
		onBlur: useCallback(() => {
			setWasTouched(true)
		}, [setWasTouched]),
		onFocus: useCallback(() => {}, []),
		onFocusChange: useCallback(() => {}, []),

		// ControlDisplayProps
		className: props.className,
		distinction: props.distinction,
		intent: props.intent,
		scheme: props.scheme,
		size: props.size,
	}
}
