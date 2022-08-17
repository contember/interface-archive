import cn from 'classnames'
import { memo, useEffect, useState } from 'react'
import { useComponentClassName } from '../auxiliary'
import type { Size } from '../types'
import { toEnumViewClass } from '../utils'
import { Aether } from './Aether'
import { Spinner } from './Spinner'

export interface ContainerSpinnerProps {
	size?: Size
}

export const ContainerSpinner = memo(({ size }: ContainerSpinnerProps) => {
	const [isSlow, setIsSlow] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsSlow(true)
		}, 1000)

		return () => clearTimeout(timer)
	}, [])

	return (
		<Aether className={cn(
			useComponentClassName('containerSpinner'),
			toEnumViewClass(size),
			isSlow ? 'is-dimmed' : undefined,
		)}>
			<Spinner />
		</Aether>
	)
})
ContainerSpinner.displayName = 'ContainerSpinner'
