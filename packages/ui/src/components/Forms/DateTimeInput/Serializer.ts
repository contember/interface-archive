type TimeInputString = string
type DateInputString = string
type DateTimeInputString = string

const TimeInputStringRegExp = /^\d{2}:\d{2}(?::\d{2})?$/
const DateInputStringRegExp = /^\d{4}-\d{2}-\d{2}$/
const dateTimeInputStringRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

export function splitDatetime(datetime: string | null | undefined): string[] {
  return (datetime ?? 'T').split('T')
}

export function assertTimeString(value: unknown): asserts value is TimeInputString {
	if (!(typeof value === 'string' && value.match(TimeInputStringRegExp))) {
		throw new Error('Expecting time value in format `hh:mm` or `hh:mm:ss`, got ' + JSON.stringify(value))
	}
}

export function assertDateString(value: unknown): asserts value is DateInputString {
	if (!(typeof value === 'string' && value.match(DateInputStringRegExp))) {
		throw new Error('Expecting time value in format `yyyy-mm-dd`, got ' + JSON.stringify(value))
	}
}

export function assertDatetimeString(value: unknown): asserts value is DateTimeInputString {
	if (!(typeof value === 'string' && value.match(dateTimeInputStringRegExp))) {
		throw new Error('Expecting time value in format `YYYY-MM-DDThh:mm`, got ' + JSON.stringify(value))
	}
}

export function toDate(value?: any): Date | null {
	const date = new Date(value ?? NaN)

	return isNaN(date.valueOf()) ? null : date
}

export function toDateString(value?: any): DateInputString | null {
	const date = toDate(value)

	if (date) {
		const year = date.getFullYear()
		const month = (date.getMonth() + 1).toFixed(0).padStart(2, '0')
		const day = date.getDate().toFixed(0).padStart(2, '0')

		return `${year}-${month}-${day}`
	}

	return null
}

export function toTimeString(value?: any): TimeInputString | null {
	const date = toDate(value)

	if (date) {
		const hours = date.getHours().toFixed(0).padStart(2, '0')
		const minutes = date.getMinutes().toFixed(0).padStart(2, '0')

		return `${hours}:${minutes}`
	}

	return null
}

export function toDatetimeString(value?: any): DateTimeInputString | null {
	const date = toDate(value)

	if (date) {
		return `${toDateString(date)}T${toTimeString(date)}`
	}

	return null
}

export function toISOString(value?: any): string | null {
	return toDate(value)?.toISOString() ?? null
}
