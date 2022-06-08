import { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { ControlValueProps } from '../Types'

type InputValueProps<T, E extends HTMLElement> =
	& ControlValueProps<T>
	& {
		emptyValue: T
		extractValue: (input: E) => T | null
	}
export const useInputValue = <T, E extends HTMLElement>(
	{
		defaultValue,
		value,
		onChange,
		notNull,
		emptyValue,
		extractValue,
	}: InputValueProps<T, E>,
) => {
	const [internalState, setInternalState] = useState<T | null>(value !== undefined ? value : defaultValue ?? null)

	const onChangeRef = useRef(onChange)
	useEffect(() => {
		onChangeRef.current = onChange
	}, [onChange])

	// Sync when outer value changes
	useEffect(() => {
		if (value === undefined) { // uncontrolled
			return
		}
		setInternalState(value)
	}, [value])


	const onChangeListener = useCallback<ChangeEventHandler<E>>(event => {
		const inputValue = extractValue(event.target)
		const normalizedValue = notNull ? (inputValue ?? emptyValue) : inputValue
		onChangeRef.current?.(normalizedValue)
		setInternalState(inputValue)
	}, [emptyValue, extractValue, notNull])

	return {
		onChange: onChangeListener,
		state: internalState,
	}
}
