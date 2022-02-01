import { DateTimeInput, toDatetimeString, toISOString } from '@contember/ui'
import { DateTimeInputProps } from '@contember/ui/src/components/Forms/DateTimeInput/Types'
import { SimpleRelativeSingleField } from '../auxiliary'
import { DateFieldProps } from './DateField'
import { useFieldControl } from './useFieldControl'

export type DateTimeFieldProps = Omit<DateFieldProps, 'showTimeSelect'>

export const DateTimeField = SimpleRelativeSingleField<DateTimeFieldProps, string>(
	(fieldMetadata, props) => {
		const inputProps = useFieldControl<string, string, DateTimeInputProps['type']>({
			...props,
			fieldMetadata,
			parse: toISOString,
			format: toDatetimeString,
			type: 'datetime',
		})

		return <DateTimeInput {...inputProps} />
	},
	'DateTimeField',
)
