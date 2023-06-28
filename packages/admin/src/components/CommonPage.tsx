import { CommonSlotSources } from '@contember/layout'
import { Heading } from '@contember/ui'
import { ReactNode, memo } from 'react'

export interface CommonPageProps {
	/** @deprecated Use `headerActions` instead */
	actions?: never;
	/** @deprecated Wrap `title` and `afterTitle` together instead */
	afterTitle?: never;
	/** @deprecated Use `back` instead */
	navigation?: never;
	/** @deprecated Use `title` instead */
	heading?: never;
	/** @deprecated No alternative to use instead */
	fit?: never;
	/** @deprecated No alternative to use instead */
	pageContentLayout?: never;
	/** @deprecated No alternative to use instead */
	className?: never;

	back?: ReactNode;
	footerActions?: ReactNode;
	headerActions?: ReactNode;
	logo?: ReactNode;
	children?: ReactNode;
	profile?: ReactNode;
	side?: ReactNode;
	switchers?: ReactNode;
	title?: ReactNode;
}

const { Back, Content, FooterActions, HeaderActions, Logo, Navigation: __Intentionally_Unused_Navigation, Profile, Sidebar, Switchers, Title, ...__rest } = CommonSlotSources

export const CommonPage = memo<CommonPageProps>(({
	actions,
	afterTitle,
	className,
	fit,
	heading,
	navigation,
	pageContentLayout,


	back,
	children,
	footerActions,
	headerActions,
	logo,
	switchers,
	profile,
	title,
	side,
	...rest
}) => {
	if (import.meta.env.DEV) {
		const __exhaustiveCheck: Record<PropertyKey, never> = rest
	}

	if (import.meta.env.DEV) {
		if (!!actions) console.warn('[CommonPage]: `actions` prop is deprecated')
		if (!!afterTitle) console.warn('[CommonPage]: `afterTitle` prop is deprecated')
		if (!!className) console.warn('[CommonPage]: `className` prop is deprecated')
		if (!!fit) console.warn('[CommonPage]: `fit` prop is deprecated')
		if (!!heading) console.warn('[CommonPage]: `heading` prop is deprecated')
		if (!!navigation) console.warn('[CommonPage]: `navigation` prop is deprecated')
		if (!!pageContentLayout) console.warn('[CommonPage]: `pageContentLayout` prop is deprecated')
	}

	return (
		<>
			{logo && <Logo>{logo}</Logo>}
			{switchers && <Switchers>{switchers}</Switchers>}

			{back && <Back>{back}</Back>}
			{navigation && <Back>{navigation}</Back>}
			{(heading || heading === 0) && (
				<Title>
					{typeof heading === 'string' || typeof heading === 'number'
						? <Heading depth={1} size="small">{heading}</Heading>
						: heading
					}
				</Title>
			)}
			{(title || title === 0) && (
				<Title>
					{typeof title === 'string' || typeof title === 'number'
						? <Heading depth={1} size="small">{title}</Heading>
						: title
					}
				</Title>
			)}
			{afterTitle && <Title>{afterTitle}</Title>}

			{actions && <HeaderActions>{actions}</HeaderActions>}
			{headerActions && <HeaderActions>{headerActions}</HeaderActions>}
			{footerActions && <FooterActions>{footerActions}</FooterActions>}
			{profile && <Profile>{profile}</Profile>}

			{children && <Content>{children}</Content>}
			{side && <Sidebar>{side}</Sidebar>}
		</>
	)
})
CommonPage.displayName = 'CommonPage'
