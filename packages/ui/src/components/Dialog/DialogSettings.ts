import type { ReactElement, ReactNode } from 'react'
import type { Default } from '../../types'

export interface RenderDialogContentProps<Result> {
	resolve: (value?: Result) => void
}

export interface DialogSettings<Result> {
	content: (props: RenderDialogContentProps<Result>) => ReactElement
	container?: HTMLElement
	type?: Default | 'immersive' | 'captivating'
	bare?: boolean
	heading?: ReactNode
}
