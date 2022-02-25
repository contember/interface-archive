import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { UrlInputProps } from './Types'

export const UrlInput = memo(
	forwardRef<HTMLInputElement, UrlInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('url-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="url" />
	}),
)
UrlInput.displayName = 'UrlInput'
