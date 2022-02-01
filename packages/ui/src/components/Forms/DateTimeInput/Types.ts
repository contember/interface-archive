import { OwnControlProps } from '../Types'

export type DateTimeInputProps = OwnControlProps<string> & {
	type: 'date' | 'time' | 'datetime'
	min?: string
	max?: string
	withTopToolbar?: boolean
}
