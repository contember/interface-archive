/**
 * Allows to use a predicate to check if a value is of a specific type and process it accordingly.
 *
 * @param input Input value
 * @param condition Predicate to check if the input is of a specific type
 * @param then Value or function to call if the input is of the specific type
 * @param other Value or function to call if the input is not of the specific type
 * @returns Result of the then or other function
 */
export function maybe<T, U extends T, V, W>(
  input: T,
  condition: (input: T) => input is U,
  then: V | ((input: U) => V),
  other: W | ((input: T) => W),
) {
  try {
    if (condition(input)) {
      return then instanceof Function ? then(input) : then
    } else {
      return other instanceof Function ? other(input) : other
    }
  } catch (error) {
    return other instanceof Function ? other(input) : other
  }
}
