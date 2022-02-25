import {
	TimeInput,
	TimeInputProps,
	toISOString,
	toTimeString,
} from '@contember/ui'
import {
	SimpleRelativeSingleField,
	SimpleRelativeSingleFieldProps,
} from '../auxiliary'
import { useFieldControl } from './useFieldControl'

export type TimeFieldProps = SimpleRelativeSingleFieldProps & TimeInputProps

export const TimeField = SimpleRelativeSingleField<TimeFieldProps, string>(
	(fieldMetadata, props) => {
		const inputProps = useFieldControl<string, string>({
			...props,
			fieldMetadata,
			parse: toISOString,
			format: toTimeString,
		})

		return <TimeInput {...inputProps} />
	},
	'DateTimeField',
)
