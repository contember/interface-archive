import { TextInput, TextInputProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import {
	stringFieldFormatter as format,
	stringFieldParser as parse,
	useFieldControl,
} from './useFieldControl'

export type ColorFieldProps = SimpleRelativeSingleFieldProps &
	Omit<TextInputProps, 'value' | 'validationState' | 'allowNewlines'>

export const ColorField = SimpleRelativeSingleField<ColorFieldProps, string>(
	(fieldMetadata, {
		defaultValue,
		name,
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
	'ColorField',
)
