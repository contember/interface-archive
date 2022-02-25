import classNames from 'classnames'
import { forwardRef, memo, useCallback } from 'react'
import { mergeProps } from 'react-aria'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { NumberInputProps } from './Types'

export const NumberInput = memo(
	forwardRef<HTMLInputElement, NumberInputProps>(({
		className,
		onChange,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
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
					.replace(/[^\d]/g, '')
					.replace(/^0*(?=\d)/, '')
				: null

				onChange?.(value)
			}, [onChange]),
		}, forwardedRed)

		return <input
			ref={ref}
			{...mergeProps(props, {
				onKeyDown: useCallback((event: KeyboardEvent) => {
					if (event.code === 'Period' || event.code === 'Comma') {
						event.preventDefault()
					}
				}, []),
			})}
			type="number"
		/>
	}),
)
NumberInput.displayName = 'NumberInput'
