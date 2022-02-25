import classNames from 'classnames'
import { AllHTMLAttributes, ForwardedRef, forwardRef, memo } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'
import { useComponentClassName } from '../../auxiliary'
import { toViewClass } from '../../utils'
import type { OwnControlProps, OwnControlPropsKeys } from './Types'
import { fromStringValue, toStringValue, useNativeInput } from './useNativeInput'

interface UnderlyingElementProps extends Omit<AllHTMLAttributes<HTMLTextAreaElement>, OwnControlPropsKeys<string>> {}

export type TextareaInputOwnProps = OwnControlProps<string> & {
	withTopToolbar?: boolean
	minRows?: number
}

export type TextareaInputProps = TextareaInputOwnProps & UnderlyingElementProps & {
	style?: TextareaAutosizeProps['style'],
}

export const TextareaInput = memo(
	forwardRef(({
		className,
		minRows,
		style,
		withTopToolbar,
		...outerProps
	}: TextareaInputProps, forwardedRed: ForwardedRef<HTMLTextAreaElement>) => {
		const { ref, props } = useNativeInput<HTMLTextAreaElement>(
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

		return <TextareaAutosize
			ref={ref}
			{...props}
			cacheMeasurements={true}
			minRows={minRows}
			style={style}
		/>
	}),
)
TextareaInput.displayName = 'TextareaInput'
