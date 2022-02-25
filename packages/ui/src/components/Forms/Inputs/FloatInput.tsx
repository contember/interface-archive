import classNames from 'classnames'
import { forwardRef, memo, useCallback, useRef } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { FloatInputProps } from './Types'

export const FloatInput = memo(
	forwardRef<HTMLInputElement, FloatInputProps>(({
		className,
		onChange,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const number = useRef<string>()

		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('number-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
			onChange: useCallback((value?: string | null) => {
				value = typeof value === 'string' && value.trim() !== ''
				? (value)
					.replaceAll(',', '.')
					.replace(/[^\d.]/g, '')
					.replace(/^(\d+\.\d+|\d+).*/, '$1')
					.replace(/^0*(?=\d)/, '')
				: ''

				if (number.current !== value) {
					number.current = value
					onChange?.(value)
				}
			}, [onChange]),
		}, forwardedRed)

		return <input ref={ref} {...props} type="number" step={outerProps.step ?? 'any'} />
	}),
)
FloatInput.displayName = 'FloatInput'
