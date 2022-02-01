import { DateTimeInput, TextInputProps, toDateString, toISOString } from '@contember/ui'
import { DateTimeInputProps } from '@contember/ui/src/components/Forms/DateTimeInput/Types'
import {
	SimpleRelativeSingleField,
	SimpleRelativeSingleFieldProps,
} from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type DateFieldProps = SimpleRelativeSingleFieldProps &
	Omit<TextInputProps, 'max' | 'min'> & {
		max?: string
		min?: string
		showTimeSelect?: boolean
	}

export const DateField = SimpleRelativeSingleField<DateFieldProps, string>(
	(fieldMetadata, props) => {
		const inputProps = useFieldControl<string, string, DateTimeInputProps['type']>({
			...props,
			fieldMetadata,
			parse: toISOString,
			format: toDateString,
			type: 'date',
		})

		return <DateTimeInput {...inputProps} />
	},
	'DateField',
)
