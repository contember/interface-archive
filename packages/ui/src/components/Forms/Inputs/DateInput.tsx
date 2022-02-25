import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { assertDateString } from '../Types'
import { useNativeInput } from '../useNativeInput'
import type { DateInputProps } from './Types'

export const DateInput = memo(
	forwardRef<HTMLInputElement, DateInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		outerProps.max && assertDateString(outerProps.max)
		outerProps.min && assertDateString(outerProps.min)
		outerProps.value && assertDateString(outerProps.value)

		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('date-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="date" />
	}),
)
DateInput.displayName = 'DateInput'
