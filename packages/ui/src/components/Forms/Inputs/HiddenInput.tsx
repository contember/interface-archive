import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { useNativeInput } from '../useNativeInput'
import type { TextInputProps } from './Types'

export const HiddenInput = memo(
	forwardRef<HTMLInputElement, TextInputProps>(({
		className,
		withTopToolbar,
		type,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('hidden-input'),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="hidden" />
	}),
)
HiddenInput.displayName = 'HiddenInput'
