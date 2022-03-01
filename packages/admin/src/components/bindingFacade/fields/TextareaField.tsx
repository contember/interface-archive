import { ControlProps, TextareaInput, TextareaInputOwnProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import {
	ControlValueParser,
	FieldValueFormatter,
	useFieldControl,
} from './useFieldControl'

export type TextareaFieldProps =
	& SimpleRelativeSingleFieldProps
	& ControlProps<string>
	& TextareaInputOwnProps

const parse: ControlValueParser<string, string> = value => value ??  null
const format: FieldValueFormatter<string, string> = value => value ?? null

export const TextareaField = SimpleRelativeSingleField<TextareaFieldProps, string>(
	(fieldMetadata, {
		label,
		minRows,
		...props
	}) => {
		const inputProps = useFieldControl<string, string>({
			...props,
			fieldMetadata,
			parse,
			format,
		})

		return <TextareaInput {...inputProps} minRows={minRows || 3} />
	},
	'TextareaField',
)

/**
 * @deprecated Please use `TextareaField` instead
 */
export const TextAreaField = TextareaField
