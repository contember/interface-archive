import { TextInput, TextInputProps } from '@contember/ui'
import { useState } from 'react'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type FloatFieldProps = SimpleRelativeSingleFieldProps &
	Omit<TextInputProps, 'value' | 'validationState' | 'allowNewlines'>

export const FloatField = SimpleRelativeSingleField<FloatFieldProps, number>(
	(fieldMetadata, {
		defaultValue,
		name,
		label,
		...props
	}) => {
		const [innerValue, setInnerValue] = useState('')

		const inputProps = useFieldControl<number, string>({
			...props,
			type: 'text',
			fieldMetadata,
			parse: value => {
				const normalizedValue = typeof value === 'string' && value.trim() !== ''
					? (value)
						.replaceAll(',', '.')
						.replace(/([^0-9.]|\.(?=\d*\.))/g, '')
						.replace(/^0*(?=\d)/, '')
					: ''

				setInnerValue(normalizedValue)

				return normalizedValue ? parseFloat(normalizedValue) : null
			},
			format: value => {
				return innerValue && parseFloat(innerValue) === value
					? innerValue
					: typeof value === 'number'
						? value.toString(10)
						: ''
			},
		})

		return <TextInput {...inputProps} />
	},
	'FloatField',
)
