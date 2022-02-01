import classNames from 'classnames'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, memo, Ref } from 'react'
import { assertDateString, assertDatetimeString, assertTimeString } from '.'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import { FallbackDateTimeInput } from './FallbackDateTimeInput'
import { DateTimeInputProps } from './Types'

let _isInputDateTimeLocalSupported: boolean | null = null

function isInputDateTimeLocalSupported() {
	if (_isInputDateTimeLocalSupported === null) {
		const input = document.createElement('input')
		const value = 'a'
		input.setAttribute('type', 'datetime-local')
		input.setAttribute('value', value)

		_isInputDateTimeLocalSupported = input.value !== value
	}

	return _isInputDateTimeLocalSupported
}

type InnerInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const InnerDateInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertDateString(props.value)
		}

		if (props.max) {
			assertDateString(props.max)
		}

		if (props.min) {
			assertDateString(props.min)
		}

		return <input ref={ref} {...props} type="date" />
	}),
)
InnerDateInput.displayName = 'InnerDateInput'

const InnerTimeInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertTimeString(props.value)
		}

		if (props.max) {
			assertTimeString(props.max)
		}

		if (props.min) {
			assertTimeString(props.min)
		}

		return <input ref={ref} {...props} type="time" />
	}),
)
InnerTimeInput.displayName = 'InnerTimeInput'

const InnerDatetimeInput = memo(
	forwardRef((props: InnerInputProps, ref: Ref<HTMLInputElement>) => {
		if (props.value) {
			assertDatetimeString(props.value)
		}

		if (props.max) {
			assertDatetimeString(props.max)
		}

		if (props.min) {
			assertDatetimeString(props.min)
		}

		return <input ref={ref} {...props} type="datetime-local" />
	}),
)
InnerDatetimeInput.displayName = 'InnerDatetimeInput'

export const DateTimeInput = memo(
	forwardRef(({
		className,
		withTopToolbar,
		...props
	}: DateTimeInputProps, ref: Ref<HTMLInputElement>) => {
		const inputProps = useNativeInput<HTMLInputElement>({
			...props,
			className: classNames(
				useComponentClassName('input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, ref)

		switch (props.type) {
			case 'date':
				return <InnerDateInput {...inputProps} />
			case 'time':
				return <InnerTimeInput {...inputProps} />
			default:
				return isInputDateTimeLocalSupported()
					? <InnerDatetimeInput {...inputProps} />
					: <FallbackDateTimeInput ref={ref} {...props} />
		}
	}),
)
DateTimeInput.displayName = 'DateTimeInput'
