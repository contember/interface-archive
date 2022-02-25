import classNames from 'classnames'
import { AllHTMLAttributes, forwardRef, memo } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { toViewClass } from '../../utils'
import type { OwnControlProps, OwnControlPropsKeys } from './Types'
import { fromStringValue, toStringValue, useNativeInput } from './useNativeInput'

export interface RestHTMLTextInputProps extends Omit<AllHTMLAttributes<HTMLInputElement>, OwnControlPropsKeys<string>> {}

export type TextInputOwnProps = OwnControlProps<string> & {
	withTopToolbar?: boolean
}

export type TextInputProps = TextInputOwnProps & RestHTMLTextInputProps

export const TextInput = memo(
	forwardRef<HTMLInputElement, TextInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>(
			{
				...outerProps,
				className: classNames(
					useComponentClassName('input'),
					toViewClass('withTopToolbar', withTopToolbar),
					className,
				),
			},
			forwardedRed,
			toStringValue,
			fromStringValue,
		)

		return <input ref={ref} {...props} />
	}),
)
TextInput.displayName = 'TextInput'
