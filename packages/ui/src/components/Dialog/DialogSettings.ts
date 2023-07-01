import type { ReactElement, ReactNode } from 'react'
import type { Default } from '../../types'
import { BoxProps } from '../Box'

/** @deprecated use `ResolveCallback` instead */
export interface RenderDialogContentProps<Result> {
	resolve: (value?: Result) => void
}

export type ResolveCallback<Result> = (value?: Result) => void

export type DialogSettings<Result> = (
	| {
		type?: Default | 'immersive' | 'captivating'
		children?: ReactNode | ((resolve: ResolveCallback<Result>) => ReactElement)
		/**	@deprecated use `children` istead directly */
		content?: never; // TODO: Remove after DeprecatedDialogSettings is removed
		/**	@deprecated use `children` istead directly */
		container?: never; // TODO: Remove after DeprecatedDialogSettings is removed
		/**	@deprecated use `children` istead directly */
		bare?: never; // TODO: Remove after DeprecatedDialogSettings is removed
		/**	@deprecated use `children` istead directly */
		heading?: never; // TODO: Remove after DeprecatedDialogSettings is removed
		/**	@deprecated use `children` istead directly */
		gap?: never; // TODO: Remove after DeprecatedDialogSettings is removed
	}
	| {
		/**	@deprecated use `children` istead directly */
		content: (props: RenderDialogContentProps<Result>) => ReactElement
		/**	@deprecated use `children` istead directly */
		container?: HTMLElement
		/**	@deprecated use `children` istead directly */
		type?: Default | 'immersive' | 'captivating'
		bare?: boolean
		/**	@deprecated use `children` istead directly */
		heading?: ReactNode
		/**	@deprecated use `children` istead directly */
		gap?: BoxProps['gap']
	}
)
