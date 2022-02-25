import { AllHTMLAttributes, ChangeEventHandler, FocusEventHandler, ForwardedRef, RefCallback, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import type { ControlProps } from './Types'
import { useInputClassName } from './useInputClassName'

const TRUE = 'on'
const FALSE = 'off'

export function fromBooleanValue(value?: boolean | null): string {
	return value === true ? TRUE : value === false ? FALSE : ''
}

export function toBooleanValue(value: string): boolean | null {
	return value === FALSE ? false : value === TRUE ? true : null
}

function fromElementValue<E extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(element: E): string {
	return element.type === 'checkbox' && element instanceof HTMLInputElement
			? element.indeterminate ? '' : fromBooleanValue(element.checked)
			: element.value
}

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
	name,
	max,
	min,
	onChange,
	notNull: _notNull,
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
}: ControlProps<string>,
	forwardedRef: ForwardedRef<E>,
): {
	ref: RefCallback<E> | RefObject<E>,
	props: AllHTMLAttributes<E>,
	state: string,
} {
	const innerRef = useRef<E>(null)
	const ref = forwardedRef ?? innerRef

	const [internalState, setInternalState] = useState<string>(value ?? defaultValue ?? '')
	const previousValue = useRef<string>(value ?? defaultValue ?? '')
	const changed = useRef<boolean>(false)

	const notNull = _notNull || required

	// Sync element when internalState changes
	useEffect(() => {
		if (!ref || typeof ref !== 'object' || !ref.current) {
			return
		}

		if (ref.current instanceof HTMLInputElement && ref.current.type === 'checkbox') {
			ref.current.indeterminate = internalState === ''
			ref.current.checked = internalState === TRUE
		}
	}, [ref, internalState])

	// Sync when element.value changes
	useEffect(() => {
		if (ref && typeof ref === 'object' && ref.current) {
			const nextValue = fromElementValue(ref.current)

			if (nextValue !== internalState) {
				previousValue.current = nextValue
				changed.current = true
				setInternalState(nextValue)
			}
		}
	}, [ref, internalState, notNull])

	// Sync when outer value changes
	useEffect(() => {
		// Uncontrolled
		if (value == undefined) {
			return
		}

		const nextValue = value

		if (previousValue.current !== nextValue) {
			previousValue.current = nextValue
			changed.current = false

			if (internalState !== nextValue) {
				setInternalState(nextValue)
			}
		}
	}, [value, internalState, setInternalState])

	// Trigger outer onChange
	useEffect(() => {
		if (changed.current) {
			onChange?.(internalState.trim().length === 0 ? null : internalState)
		}
	}, [onChange, internalState])

	const validationMessage = useRef<string>()

	const changeValidationState = useCallback(() => {
		if (ref && typeof ref === 'object' && onValidationStateChange) {
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
		if (typeof ref !== 'object' || !ref.current) {
			return
		}

		const nextValue = fromElementValue(event.target)

		if (nextValue !== internalState) {
			setInternalState(nextValue)
			changed.current = true
		}
	}, [internalState, ref])

	const onFocusListener = useCallback<FocusEventHandler<E>>(event => {
		onFocus?.()
		onFocusChange?.(true)
	}, [onFocus, onFocusChange])

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

		// ValidationSteteProps
		validationState,
	})

	const isCheckbox = typeof ref === 'object' && ref.current instanceof HTMLInputElement && ref.current.type === 'checkbox'

	return {
		ref,
		props: {
			...rest,
			className,
			disabled: disabled || loading,
			name,
			onBlur: onBlurListener,
			onChange: onChangeListener,
			onFocus: onFocusListener,
			placeholder: placeholder ?? undefined,
			readOnly: readOnly || loading,
			required,
			max: isCheckbox ? undefined : max ?? undefined,
			min: isCheckbox ? undefined : min ?? undefined,
			value: isCheckbox ? TRUE : internalState,
		},
		state: internalState,
	}
}
