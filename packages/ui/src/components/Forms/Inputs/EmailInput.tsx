import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { EmailInputProps } from './Types'

export const EmailInput = memo(
	forwardRef<HTMLInputElement, EmailInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('email-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="email" />
	}),
)
EmailInput.displayName = 'EmailInput'
