export class SeeErrorAbove extends Error {
	constructor(message: string, data: unknown, options?: ErrorOptions) {
		if (import.meta.env.DEV) {
			console.error(message, data)
			message += ' See error above.'
		}

		super(message, options)
	}
}
