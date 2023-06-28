import { useClassNameFactory } from '@contember/utilities'
import { memo, ReactNode } from 'react'
import { ButtonList } from '../Forms'

export interface TitleBarProps {
	className?: string;
	after?: ReactNode
	navigation?: ReactNode
	children: ReactNode
	actions?: ReactNode
}

/**
 * @group UI
 */
export const TitleBar = memo(({ after, className: classNameProp, navigation, children, actions, ...props }: TitleBarProps) => {
	const className = useClassNameFactory('titleBar')

	if (import.meta.env.DEV) {
		const __exhaustiveCheck: Record<PropertyKey, never> = props
	}

	return (
		<div
			className={className(null, classNameProp)}
		>
			{navigation && (
				<nav className={className('navigation')}>
					<ButtonList>{navigation}</ButtonList>
				</nav>
			)}
			<div className={className('in')}>
				<div className={className('heading')}>
					{children}
				</div>
				{actions && (
					<div className={className('actions')}>
						<ButtonList>{actions}</ButtonList>
					</div>
				)}
			</div>
			{after && <div className={className('after')}>
				{after}
			</div>}
		</div>
	)
})
TitleBar.displayName = 'TitleBar'
