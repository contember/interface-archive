import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { assertTimeString } from '../Types'
import { useNativeInput } from '../useNativeInput'
import type { TimeInputProps } from './Types'

export const TimeInput = memo(
	forwardRef<HTMLInputElement, TimeInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		outerProps.max && assertTimeString(outerProps.max)
		outerProps.min && assertTimeString(outerProps.min)
		outerProps.value && assertTimeString(outerProps.value)

		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('time-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="time" />
	}),
)
TimeInput.displayName = 'TimeInput'
