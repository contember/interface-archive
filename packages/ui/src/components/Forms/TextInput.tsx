import classNames from 'classnames'
import { AllHTMLAttributes, forwardRef, memo } from 'react'
import { useComponentClassName } from '../../auxiliary'
import { toViewClass } from '../../utils'
import type { OwnControlProps, OwnControlPropsKeys } from './Types'
import { useNativeInput } from './useNativeInput'

interface UnderlyingElementProps extends Omit<AllHTMLAttributes<HTMLInputElement>, OwnControlPropsKeys<string>> {}

export type TextInputOwnProps = OwnControlProps<string> & {
	withTopToolbar?: boolean
}

export type TextInputProps = TextInputOwnProps & UnderlyingElementProps

export const TextInput = memo(
	forwardRef<HTMLInputElement, TextInputProps>(({
		className,
		withTopToolbar,
		...props
	}, ref) => {
		const inputProps = useNativeInput<HTMLInputElement>({
			...props,
			className: classNames(
				useComponentClassName('input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, ref)

		return <input {...inputProps} />
	}),
)
TextInput.displayName = 'TextInput'
