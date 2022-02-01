import { ForwardedRef, forwardRef, memo, ReactNode } from 'react'
import { useClassNamePrefix } from '../../../auxiliary'
import { TextInput, TextInputProps } from '../TextInput'

export type SlugInputProps =
	& TextInputProps
	& {
		link?: string
		prefix?: string
		overlay?: ReactNode
		onOverlayClick?: () => void
	}

export const SlugInput = memo(
	forwardRef(({ prefix, link, overlay, onOverlayClick, ...textInputProps }: SlugInputProps, ref: ForwardedRef<HTMLInputElement>) => {
		const componentClassName = `${useClassNamePrefix()}slug-input`

		return (
			<div className={`${componentClassName}`}>
				{prefix && (
					<div className={`${componentClassName}-prefix`}>
						{link ?
							<a href={link} className={`${componentClassName}-prefix-link`} target={'_blank'}>{prefix}</a> : prefix}
					</div>
				)}
				<div className={`${componentClassName}-input`}>
					<TextInput {...textInputProps} ref={ref} />
					{(overlay || onOverlayClick) ? (
						<div className={`${componentClassName}-overlay`} onClick={onOverlayClick}>
							{overlay}
						</div>
					) : null}
				</div>
			</div>
		)
	}),
)
