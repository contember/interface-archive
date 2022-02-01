import { TextInput, TextInputProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import {
	stringFieldFormatter as format,
	stringFieldParser as parse,
	useFieldControl,
} from './useFieldControl'

export type TextFieldProps =
	& SimpleRelativeSingleFieldProps
	& TextInputProps
	& {
		wrapLines?: boolean
	}

export const TextField = SimpleRelativeSingleField<TextFieldProps, string>(
	(fieldMetadata, {
		label,
		name,
		wrapLines = false,
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
			<TextInput {...inputProps} />
		)
	},
	'TextField',
)
