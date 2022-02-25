import { ControlProps, TextInput } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import {
	stringFieldFormatter as format,
	stringFieldParser as parse,
	useFieldControl,
} from './useFieldControl'

export type TextFieldProps =
	& SimpleRelativeSingleFieldProps
	& ControlProps<string>

export const TextField = SimpleRelativeSingleField<TextFieldProps, string>(
	(fieldMetadata, {
		label,
		...props
	}) => {
		const inputProps = useFieldControl<string, string>({
			...props,
			fieldMetadata,
			parse,
			format,
		})

		return <TextInput {...inputProps} />
	},
	'TextField',
)
