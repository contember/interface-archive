import { TextInput, TextInputProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import {
	stringFieldFormatter,
	stringFieldParser,
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
			parse: stringFieldParser,
			format: stringFieldFormatter,
			type: 'color',
		})

		return <TextInput {...inputProps} />
	},
	'ColorField',
)
