import { AllHTMLAttributes, ChangeEventHandler, FocusEventHandler, ForwardedRef, RefCallback, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import type { OwnControlProps, Scalar } from './Types'
import { useInputClassName } from './useInputClassName'

export function toStringValue(internalValue?: string | null): string | undefined {
	return internalValue ?? undefined
}

export function fromStringValue(nextValue: string, notNull?: boolean): string | null {
	const isEmptyString = nextValue.trim().length === 0
	return isEmptyString && notNull === false ? null : nextValue
}

export function useNativeInput<E extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, V extends Scalar = string>({
	// ControlStateProps
	active,
	disabled,
	loading,
	readOnly,
	required,
	focused,
	hovered,

	// ControlFocusProps
	onBlur,
	onFocus,
	onFocusChange,

	// ControlValueProps
	defaultValue,
	onChange,
	notNull,
	placeholder,
	type,
	value,

	// ValidationSteteProps
	onValidationStateChange,
	validationState,

	// ControlDisplayProps
  className: outerClassName,
	distinction,
	intent,
	scheme,
	size,

	// Common own props
	...rest
}: OwnControlProps<V>,
	forwardedRef: ForwardedRef<E>,
	toStringValue: (internalValue?: V | null, element?: E) => string | undefined,
	fromStringValue: (nextValue: string, notNull?: boolean, previousValue?: V | null, element?: E) => V | null | undefined,
): {
	ref: RefCallback<E> | RefObject<E>,
	props: AllHTMLAttributes<E>,
	value: V | null | undefined,
} {
	const innerRef = useRef<E>(null)
	const ref = forwardedRef ?? innerRef

	const [internalValue, setInternalValue] = useState<V | null | undefined>(value ?? defaultValue)
	const changed = useRef<boolean>(false)

	useOuterValue({ value }, setInternalValue)

	// Sync when outer notNullProp changes
	useEffect(() => {
		if (notNull && internalValue === null) {
			setInternalValue(fromStringValue(''))
			changed.current = true
		}
	}, [fromStringValue, internalValue, notNull])

	if (!ref && import.meta.env.DEV) {
		console.error([
			'Forwarded `ref` parameter is required for inputs to work correctly.',
			'Look for elements with `has-dev-error:-missing-ref` class to identify such components.',
		].join(' '))

		outerClassName += ` has-dev-error:-missing-ref`
	}

	// TODO: toStateClass('indeterminate', props.value === null),
	const className = useInputClassName({
		// ControlStateProps
		active,
		disabled,
		loading,
		readOnly,
		required,
		focused,
		hovered,

		// ControlDisplayProps
		className: outerClassName,
		distinction,
		intent,
		scheme,
		size,
		type,

		// ValidationSteteProps
		validationState,
	})

	const validationMessage = useRef<string>()

	const changeValidationState = useCallback(() => {
		if (ref && typeof ref !== 'function' && onValidationStateChange) {
			const valid = ref.current?.validity?.valid
			const message = valid ? undefined : ref.current?.validationMessage

			if (validationMessage.current !== message) {
				validationMessage.current = message
				onValidationStateChange(message)
			}
		}
	}, [onValidationStateChange, ref])

	useEffect(() => {
		changeValidationState()
	})

	const onBlurListener = useCallback<FocusEventHandler<E>>((event => {
		if (event.defaultPrevented) {
			return
		}

		onBlur?.()
		onFocusChange?.(false)
		changeValidationState()
	}), [onBlur, onFocusChange, changeValidationState])

	const onChangeListener = useCallback<ChangeEventHandler<E>>(event => {
		const nextValue = fromStringValue(event.target.value, notNull, internalValue, typeof ref === 'object' && ref?.current ? ref.current : undefined)

		if (nextValue !== internalValue) {
			setInternalValue(nextValue)
			changed.current = true
		}
	}, [internalValue, notNull, ref, fromStringValue])

	useEffect(() => {
		if (changed.current) {
			changed.current = false
			onChange?.(internalValue)
		}
	}, [onChange, internalValue])

	const onFocusListener = useCallback<FocusEventHandler<E>>(event => {
		onFocus?.()
		onFocusChange?.(true)
	}, [onFocus, onFocusChange])

	return {
		ref,
		props: {
			...rest,
			className,
			// `defaultValue` and `value` are never used together in a form element
			defaultValue: toStringValue(value === undefined ? defaultValue : undefined),
			disabled: disabled || loading,
			onBlur: onBlurListener,
			onChange: onChangeListener,
			onFocus: onFocusListener,
			placeholder: placeholder ?? undefined,
			readOnly: readOnly || loading,
			required,
			value: toStringValue(value ?? undefined),
			type,
		},
		value: internalValue,
	}
}

// Sync when outer value changes
export function useOuterValue<V>({ value }: { value: V }, setter: (value: V) => void) {
	const previous = useRef<V>(value)

	useEffect(() => {
		if (previous.current !== value) {
			previous.current = value
			setter(value)
		}
	}, [value, setter])
}
