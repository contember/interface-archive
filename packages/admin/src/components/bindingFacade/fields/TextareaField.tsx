import { TextareaInput, TextareaInputProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import { stringFieldParser as parse, useFieldControl } from './useFieldControl'

export type TextareaFieldProps =
	& SimpleRelativeSingleFieldProps
	& TextareaInputProps
	& {
		wrapLines?: boolean
	}

const format = (value: string | null | undefined) => String(value ?? '')

export const TextareaField = SimpleRelativeSingleField<TextareaFieldProps, string>(
	(fieldMetadata, {
		label,
		name,
		minRows,
		...props
	}) => {
		const inputProps = useFieldControl<string, string>({
			...props,
			fieldMetadata,
			parse,
			format,
			type: 'text',
		})
		return (
			<TextareaInput {...inputProps} minRows={minRows || 3} />
		)
	},
	'TextField',
)

/**
 * @deprecated Please use `TextareaField` instead
 */
export const TextAreaField = TextareaField
