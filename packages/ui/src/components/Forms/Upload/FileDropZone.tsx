import { useClassNameFactory, useComposeRef } from '@contember/react-utils'
import { ReactNode, forwardRef, memo, useLayoutEffect, useState } from 'react'
import { HTMLDivElementProps } from '../../../types'
import { toStateClass } from '../../../utils'
import { Box } from '../../Box'

const REASONABLE_COLUMN_COUNT = 24

export type FileDropZoneProps =
	& {
		isActive?: boolean
		isAccepting?: boolean
		isRejecting?: boolean
		children?: ReactNode
	}
	& HTMLDivElementProps

/**
 * @group Forms UI
 */
export const FileDropZone = memo(forwardRef<HTMLDivElement, FileDropZoneProps>(({
	isActive,
	isAccepting,
	isRejecting,
	className,
	...props
}, ref) => {
	const componentClassName = useClassNameFactory('fileDropZone')

	const [boxElement, setBoxElement] = useState<HTMLDivElement | null>(null)
	const composeRef = useComposeRef(ref, setBoxElement)

	useLayoutEffect(() => {
		// We need element ready & respect style overrides:
		if (boxElement && !boxElement.style.gridColumnStart && !boxElement.style.gridColumnEnd) {
			// Set the cell to its initial position, get offset:
			boxElement.style.gridColumnStart = 'auto'
			boxElement.style.gridColumnEnd = 'auto'
			const offsetLeft = boxElement.offsetLeft

			let gridColumnStart: number | null = null

			// Iterate until we find the cell's start column:
			for (let i = 1; i < REASONABLE_COLUMN_COUNT; i++) {
				boxElement.style.gridColumnStart = `${i}`

				const currentOffsetLeft = boxElement.offsetLeft

				if (currentOffsetLeft <= offsetLeft) {
					gridColumnStart = i
				} else {
					break
				}
			}

			if (gridColumnStart !== null) {
				boxElement.style.setProperty('--fileDropZone--grid-column-start', `${gridColumnStart}`)
				boxElement.style.setProperty('--fileDropZone--grid-column-end', '-1')
			} else {
				boxElement.style.setProperty('--fileDropZone--grid-column-start', '')
				boxElement.style.setProperty('--fileDropZone--grid-column-end', '')
			}

			// Reset the cell's position:
			boxElement.style.gridColumnStart = ''
			boxElement.style.gridColumnEnd = ''
		}
	})

	return (
		<Box
			{...props}
			ref={composeRef}
			className={componentClassName(null, [
				toStateClass('active', isActive),
				toStateClass('accepting', isAccepting),
				toStateClass('rejecting', isRejecting),
				className,
			])}
		/>
	)
}))
FileDropZone.displayName = 'FileDropZone'
