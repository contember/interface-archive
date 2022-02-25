import classNames from 'classnames'
import { AllHTMLAttributes, DetailedHTMLProps, ForwardedRef, forwardRef, memo, OptionHTMLAttributes, ReactElement, RefAttributes, useCallback, useMemo } from 'react'
import { useComponentClassName } from '../../auxiliary'
import type { ControlProps, ControlPropsKeys } from './Types'
import { useNativeInput } from './useNativeInput'

export interface SelectOption<V = string> {
	value: V
	label: string
	disabled?: boolean
}

export interface RestHTMLSelectProps<V> extends Omit<AllHTMLAttributes<HTMLSelectElement>, ControlPropsKeys<V> | 'children'> {}

export type SelectProps<V> = Omit<ControlProps<V>, 'min' | 'max'> & RestHTMLSelectProps<V> & {
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
	onChange,
	options,
	placeholder,
	value,
	...outerProps
}: SelectProps<V>, forwardedRef: ForwardedRef<HTMLSelectElement>) => {
	const selectClassName = useComponentClassName('select')
	const wrapperClassName = `${selectClassName}-wrapper`

	const providedEmptyOptionIndex = useMemo(() => options.findIndex(option => optionValueIsEmpty(option.value)), [options])

	const noEmptyOptionProvided = providedEmptyOptionIndex === -1
	const canHideBuiltinEmptyOption = outerProps.required && !placeholder
	const displayBuiltinEmptyOption = noEmptyOptionProvided && !canHideBuiltinEmptyOption

	const { ref, props: inputProps } = useNativeInput<HTMLSelectElement>({
		...outerProps,
		defaultValue: useMemo(() => defaultValue !== undefined
			? deriveSelectIndexValue(options.findIndex(option => option.value === defaultValue))
			: undefined, [defaultValue, options]),
		onChange: useCallback((index?: string | null) => {
			const next = typeof index === 'string'
				? options[parseInt(index)]?.value
				: null

			console.log('Change to index', { index, options, next })

			if (next !== value) {
				onChange?.(next)
			}
		}, [onChange, options, value]),
		value: useMemo(() => value !== undefined
			? deriveSelectIndexValue(options.findIndex(option => option.value === value))
			: undefined, [value, options]),
	}, forwardedRef)

	// useEffect(() => {
	// 	if (ref && typeof ref !== 'function') {
	// 		const selectValue = ref.current?.value

	// 		console.log({ selectValue: ref.current?.value, inputPropsValue: inputProps.value })

	// 		if (selectValue && inputProps.value !== selectValue) {
	// 			console.log('Advancing value to...', selectValue, options[parseInt(selectValue)]?.value)
	// 			onChange?.(options[parseInt(selectValue)]?.value)
	// 		}
	// 	}
	// }, [options, inputProps.value, onChange, ref])

	// return <pre>{JSON.stringify({
	// 	inner: {
	// 		providedEmptyOptionIndex,
	// 		noEmptyOptionProvided,
	// 		canHideBuiltinEmptyOption,
	// 		displayBuiltinEmptyOption,
	// 	},
	// 	inputProps,
	// }, null, ' ')}</pre>

	return (
		<div className={classNames(inputProps.className, wrapperClassName)}>
			<select ref={ref} {...inputProps} className={classNames(inputProps.className, selectClassName)}>
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
