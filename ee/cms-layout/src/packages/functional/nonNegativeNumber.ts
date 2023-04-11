import { assert, isNumber } from '../assert-types'

/**
 * Returns the value if it is positive, otherwise returns 0
 * @param value Number to check
 * @returns Input if it is positive, otherwise 0
 */
export function nonNegativeNumber(value: number) {
	assert('value to be a number', value, isNumber)
	return Math.max(0, value)
}
