import { ControlProps, NumberInput } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type NumberFieldProps =
	& SimpleRelativeSingleFieldProps
	& ControlProps<number>

export const NumberField = SimpleRelativeSingleField<NumberFieldProps, number>(
	(fieldMetadata, { defaultValue, ...props }) => {
		const inputProps = useFieldControl<number, string>({
			...props,
			fieldMetadata,
			parse: value => typeof value === 'string' && value.trim() !== ''
				? parseInt(value, 10)
				: null,
			format: value => typeof value === 'number' && value !== NaN
				? value.toString(10)
				: typeof value === 'string'
					? parseInt(value, 10).toString(10)
					: ''
			,
		})

		return <NumberInput {...inputProps} />
	},
	'NumberField',
)
