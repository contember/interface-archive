import classNames from 'classnames'
import { AllHTMLAttributes, DetailedHTMLProps, ForwardedRef, forwardRef, memo, OptionHTMLAttributes, ReactElement, RefAttributes, useCallback, useEffect, useMemo } from 'react'
import { useComponentClassName } from '../../auxiliary'
import type { OwnControlProps, OwnControlPropsKeys } from './Types'
import { fromStringValue, toStringValue, useNativeInput } from './useNativeInput'

export interface SelectOption<V = string> {
	value: V
	label: string
	disabled?: boolean
}

export interface RestHTMLSelectProps<V> extends Omit<AllHTMLAttributes<HTMLSelectElement>, OwnControlPropsKeys<V> | 'children'> {}

export type SelectProps<V> = OwnControlProps<V> & RestHTMLSelectProps<V> & {
	options: SelectOption<V>[]
}

function optionValueIsEmpty (value: unknown) {
	return value === '' || value === null || typeof value === undefined
}

function deriveSelectIndexValue (index: number) {
	return index === -1 ? '' : index.toString()
}

const SelectComponent = <V extends any>({
	defaultValue,
	placeholder,
	onChange,
	options,
	value,
	...outerProps
}: SelectProps<V>, forwardedRef: ForwardedRef<HTMLSelectElement>) => {
	const selectClassName = useComponentClassName('select')
	const wrapperClassName = `${selectClassName}-wrapper`

	const providedEmptyOptionIndex = useMemo(() => options.findIndex(option => optionValueIsEmpty(option.value)), [options])

	const noEmptyOptionProvided = providedEmptyOptionIndex === -1
	const canHideBuiltinEmptyOption = outerProps.required && !placeholder
	const displayBuiltinEmptyOption = noEmptyOptionProvided && !canHideBuiltinEmptyOption

	const { ref, props: inputProps } = useNativeInput<HTMLSelectElement>(
		{
			...outerProps,
			defaultValue: useMemo(() => deriveSelectIndexValue(options.findIndex(option => option.value === defaultValue)), [defaultValue, options]),
			onChange: useCallback((index?: string | null) => {
				onChange?.(options[parseInt(index ?? '')]?.value)
			}, [onChange, options]),
			value: useMemo(() => deriveSelectIndexValue(options.findIndex(option => option.value === value)), [value, options]),
		},
		forwardedRef,
		toStringValue,
		fromStringValue,
	)

	useEffect(() => {
		if (ref && typeof ref !== 'function') {
			const selectValue = ref.current?.value

			if (inputProps.value !== selectValue) {
				onChange?.(options[parseInt(selectValue ?? '')]?.value)
			}
		}
	}, [options, inputProps.value, onChange, ref])

	return (
		<div className={classNames(inputProps.className, wrapperClassName)}>
			<select {...inputProps} className={classNames(inputProps.className, selectClassName)}>
				{displayBuiltinEmptyOption && <option key="-1" disabled={outerProps.required} value="">{placeholder ?? '…'}</option>}
				{options.map((option, index) => {
					const isEmptyOptionValue = optionValueIsEmpty(option.value)

					const optionProps: DetailedHTMLProps<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement> = {
						value: deriveSelectIndexValue(isEmptyOptionValue ? -1 : index),
						children: option.label,
						disabled: option.disabled || (outerProps.required && isEmptyOptionValue),
					}
					return <option key={index} {...optionProps} />
				})}
			</select>
		</div>
	)
}

// memo(forwardRef()) causes `V` generic to cast as `unknown`
type MemoForwardRefComponentWithGenericProps = <A, B, R>(Component: (props: A, ref: ForwardedRef<R>) => B) => (props: A & RefAttributes<R>) => ReactElement | null
const memoizedForwardedComponentWithGenericProps: MemoForwardRefComponentWithGenericProps = <A, B, R>(Component: (props: A, ref: ForwardedRef<R>) => B) => ((memo(forwardRef(Component as any)) as any) as (props: A & RefAttributes<R>) => ReactElement | null)

export const Select = memoizedForwardedComponentWithGenericProps(SelectComponent) // as typeof SelectComponent
