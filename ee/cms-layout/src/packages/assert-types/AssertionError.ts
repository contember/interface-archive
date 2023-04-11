export class AssertionError extends Error {
  constructor(that: string = 'value to pass assertion', value: unknown) {
    super(`Expecting ${that}, ${JSON.stringify(value)} given`)
  }
}
