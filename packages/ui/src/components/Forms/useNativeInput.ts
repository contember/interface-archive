import { AllHTMLAttributes, ChangeEventHandler, FocusEventHandler, ForwardedRef, RefCallback, RefObject, useCallback, useEffect, useRef } from 'react'
import type { OwnControlProps } from './Types'
import { useInputClassName } from './useInputClassName'

export function useNativeInput<E extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>({
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
}: OwnControlProps<string>, forwardedRef: ForwardedRef<E>): AllHTMLAttributes<E> & { ref: RefCallback<E> | RefObject<E> } {
	const innerRef = useRef<E>(null)
	const ref = forwardedRef ?? innerRef

	if (!ref && import.meta.env.DEV) {
		console.error([
			'Forwarded `ref` parameter is required for inputs to work correctly.',
			'Look for elements with `has-dev-error:-missing-ref` class to identify such components.',
		].join(' '))

		outerClassName += ` has-dev-error:-missing-ref`
	}

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
		// TODO: Maybe remove
		// This is unlikely to happen (unless maybe being used outide of the Contember?)
		if (event.defaultPrevented) {
			return
		}

		onBlur?.()
		onFocusChange?.(false)
		changeValidationState()
	}), [onBlur, onFocusChange, changeValidationState])

	const onChangeListener = useCallback<ChangeEventHandler<E>>(event => {
		onChange?.(event.target.value)
	}, [onChange])

	const onFocusListener = useCallback<FocusEventHandler<E>>(event => {
		onFocus?.()
		onFocusChange?.(true)
	}, [onFocus, onFocusChange])

	return {
		...rest,
		ref,
		className,
		defaultValue: typeof value === 'undefined' ? defaultValue : undefined, // `defaultValue` and `value` are never used together in a form element
		disabled: disabled || loading,
		onBlur: onBlurListener,
		onChange: onChangeListener,
		onFocus: onFocusListener,
		placeholder: placeholder ?? '',
		readOnly: readOnly || loading,
		required,
		value: value ?? '',
		type,
	}
}
