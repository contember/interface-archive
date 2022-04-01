import { DevErrorBadge, DevErrorList, ErrorType } from '@contember/ui'
import { useCallback, useEffect, useState } from 'react'
import { useParsedStacktrace } from './useParsedStacktrace'

export class ErrorBus {
	private queue: { error: ErrorType, source: string }[] = []
	private listener: null | ((error: { error: ErrorType, source: string }) => void) = null

	async handleError(source: string, error: ErrorType) {
		const boxedError = { error, source }

		if (!this.listener) {
			this.queue.push(boxedError)

		} else {
			this.listener(boxedError)
		}
	}

	register(listener: (error: { error: ErrorType, source: string }) => void): () => void {
		this.listener = listener
		this.queue.forEach(listener)
		this.queue = []
		return () => {
			this.listener = null
		}
	}
}

export interface DevErrorManagerProps {
	bus: ErrorBus
}

export function DevErrorManager(props: DevErrorManagerProps) {
	const [errors, setErrors] = useState<{ error: ErrorType, source: string }[]>([])
	const [errIndex, setErrorIndex] = useState(0)
	const [open, setOpen] = useState(false)

	useEffect(
		() => {
			return props.bus.register(err => {
				setTimeout(
					() => {
						setErrors(errors => [err, ...errors])
						setOpen(true)
					},
					0,
				)
			})
		},
		[props.bus],
	)

	const currentError = errors[errIndex]
	const stackTrace = useParsedStacktrace(currentError?.error)
	const onClose = useCallback(() => setOpen(false), [])
	const onPrevious = useCallback(() => setErrorIndex(it => Math.max(0, it - 1)), [])
	const onNext = useCallback(() => setErrorIndex(it => Math.min(errors.length - 1, it + 1)), [errors.length])
	if (!currentError) {
		return null
	}
	if (!open) {
		return <DevErrorBadge errorCount={errors.length} onOpen={() => setOpen(true)} />
	}
	return (
		<DevErrorList
			currentError={{
				...currentError,
				parsedStacktrace: stackTrace,
			}}
			currentErrorIndex={errIndex}
			errorCount={errors.length}
			onPrevious={onPrevious}
			onNext={onNext}
			onClose={onClose}
		/>
	)
}
