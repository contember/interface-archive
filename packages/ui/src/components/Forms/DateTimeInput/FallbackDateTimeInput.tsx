import classNames from 'classnames'
import { ChangeEvent, forwardRef, memo, Ref, useCallback, useEffect, useRef, useState } from 'react'
import { fromStringValue, toStringValue, useNativeInput, VisuallyDependententControlProps } from '..'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { Divider } from '../../Divider'
import { Stack } from '../../Stack'
import { useInputClassName } from '../useInputClassName'
import { assertDatetimeString, splitDatetime } from './Serializer'
import { DateTimeInputProps } from './Types'

function joinDatetime(date?: string | null, time?: string | null) {
	return `${date}T${time}`
}

export const FallbackDateTimeInput = memo(
	forwardRef(({
		className,
		max,
		min,
		onChange,
		onValidationStateChange,
		value: _value,
		withTopToolbar,
		...outerProps
	}: DateTimeInputProps, forwardedRef: Ref<HTMLInputElement>) => {
		const value = _value ?? ''

		if (value) {
			assertDatetimeString(value)
		}

		if (max) {
			assertDatetimeString(max)
		}

		if (min) {
			assertDatetimeString(min)
		}

		const [state, setState] = useState(value)
		const [date, time] = splitDatetime(state)

		useEffect(() => {
			setState(value)
		}, [value])

		useEffect(() => {
			onChange?.(state)
		}, [state, onChange])

		const onDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			setState(joinDatetime(event.target.value, time))
		}, [time])

		const onTimeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			setState(joinDatetime(date, event.target.value))
		}, [date])

		const dateError = useRef<string | undefined>(undefined)
		const timeError = useRef<string | undefined>(undefined)

		const changeValidationState = useCallback(() => {
			onValidationStateChange?.([dateError.current, timeError.current].filter(Boolean).join(' '))
		}, [onValidationStateChange])

		const { ref: dateRef, props: dateInputProps } = useNativeInput<HTMLInputElement>(
			{
				...outerProps,
				distinction: 'seamless',
				className: classNames(
					useComponentClassName('input'),
					className,
				),
				onValidationStateChange: useCallback((error: string | undefined) => {
					dateError.current = error
					changeValidationState()
				}, [changeValidationState]),
				value: date,
			},
			forwardedRef,
			toStringValue,
			fromStringValue,
		)

		const timeInputRef = useRef<HTMLInputElement>(null)
		const { ref: timeRef, props: timeInputProps } = useNativeInput<HTMLInputElement>(
			{
				...outerProps,
				distinction: 'seamless',
				className: classNames(
					useComponentClassName('input'),
					className,
				),
				onValidationStateChange: useCallback((error: string | undefined) => {
					timeError.current = error
					changeValidationState()
				}, [changeValidationState]),
				value: time,
			},
			timeInputRef,
			toStringValue,
			fromStringValue,
		)

		const [maxDate, maxTime] = splitDatetime(max)
		const [minDate, minTime] = splitDatetime(min)

		return <Stack gap="large" direction="horizontal" className={useInputClassName<VisuallyDependententControlProps>({
			...outerProps,
			className: classNames(
				useComponentClassName('input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		})}>
			<input
				ref={dateRef}
				{...dateInputProps}
				max={maxDate}
				min={minDate}
				onChange={onDateChange}
				placeholder={outerProps.placeholder ?? undefined}
				type="date"
			/>
			<Divider gap="none" />
			<input
				ref={timeRef}
				{...timeInputProps}
				max={date && date === maxDate ? maxTime : ''}
				min={date && date === minDate ? minTime : ''}
				onChange={onTimeChange}
				placeholder={undefined}
				type="time"
			/>
		</Stack>
	}),
)
FallbackDateTimeInput.displayName = 'FallbackDateTimeInput'
