import { TextInput, TextInputProps } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type NumberFieldProps = SimpleRelativeSingleFieldProps &
	Omit<TextInputProps, 'value' | 'onChange' | 'validationState' | 'allowNewlines'>

export const NumberField = SimpleRelativeSingleField<NumberFieldProps, number>(
	(fieldMetadata, { defaultValue, ...props }) => {
		const inputProps = useFieldControl<number, string>({
			...props,
			fieldMetadata,
			parse: value => typeof value === 'string' && value.trim() !== ''
				? parseInt(value, 10)
				: null,
			format: value => (typeof value === 'number' && value !== NaN
				? value.toString(10)
				: ''
			),
			type: 'number',
		})

		return <TextInput {...inputProps} />
	},
	'NumberField',
)
