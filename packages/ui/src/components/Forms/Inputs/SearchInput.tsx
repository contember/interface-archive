import classNames from 'classnames'
import { forwardRef, memo } from 'react'
import { useComponentClassName } from '../../../auxiliary'
import { toViewClass } from '../../../utils'
import { useNativeInput } from '../useNativeInput'
import type { SearchInputProps } from './Types'

export const SearchInput = memo(
	forwardRef<HTMLInputElement, SearchInputProps>(({
		className,
		withTopToolbar,
		...outerProps
	}, forwardedRed) => {
		const { ref, props } = useNativeInput<HTMLInputElement>({
			...outerProps,
			className: classNames(
				useComponentClassName('text-input'),
				useComponentClassName('search-input'),
				toViewClass('withTopToolbar', withTopToolbar),
				className,
			),
		}, forwardedRed)

		return <input ref={ref} {...props} type="search" />
	}),
)
SearchInput.displayName = 'SearchInput'
