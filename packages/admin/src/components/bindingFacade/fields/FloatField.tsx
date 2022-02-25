import { ControlProps, FloatInput } from '@contember/ui'
import { SimpleRelativeSingleField, SimpleRelativeSingleFieldProps } from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type FloatFieldProps =
	& SimpleRelativeSingleFieldProps
	& ControlProps<number>

export const FloatField = SimpleRelativeSingleField<FloatFieldProps, number>(
	(fieldMetadata, {
		defaultValue,
		name,
		label,
		...props
	}) => {
		const inputProps = useFieldControl<number, string>({
			...props,
			fieldMetadata,
			parse: value => typeof value === 'string' && value.trim() !== ''
				? parseFloat(value)
				: null,
			format: value => typeof value === 'number' && value !== NaN
				? value.toString(10)
				: typeof value === 'string'
					? parseFloat(value).toString(10)
					: null,
		})

		return <FloatInput {...inputProps} />
	},
	'FloatField',
)
