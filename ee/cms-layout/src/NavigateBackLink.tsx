import { Link, LinkProps } from '@contember/admin'
import { Stack } from '@contember/ui'
import { ArrowLeftIcon } from 'lucide-react'
import { ReactNode, memo } from 'react'
import { assert, isNonEmptyTrimmedString } from './packages/assert-types'
import { VisuallyHidden } from './packages/ui-visually-hidden'

export type LabeledProps = {
	ariaLabel: string;
	children: Exclude<ReactNode, string | null | undefined>;
} | {
	ariaLabel?: string;
	children?: string | null | undefined;
}

export type NavigateBackLinkProps =
	& Omit<LinkProps, 'children'>
	& LabeledProps
	& {
		icon?: ReactNode;
		breakpoint?: number | null | undefined;
	}

export const NavigateBackLink = memo<NavigateBackLinkProps>(({
	icon,
	ariaLabel = 'Back',
	children = 'Back',
	...props
}) => {
	const finalAriaLabel = isNonEmptyTrimmedString(children) ? children : ariaLabel
	assert('ariaLabel to be present when children is empty', finalAriaLabel, isNonEmptyTrimmedString)

	return (
		<Link {...props} aria-label={finalAriaLabel}>
			<Stack direction="horizontal" align="center">
				{icon ?? <ArrowLeftIcon />}
				{<VisuallyHidden>{children}</VisuallyHidden>}
			</Stack>
		</Link>
	)
})
NavigateBackLink.displayName = 'NavigateBackLink'
