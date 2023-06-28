import { Layout as DefaultLayout, Divider, LayoutPage } from '@contember/admin'
import { CommonSlotTargets } from '@contember/layout'
import { NestedClassName, useClassName } from '@contember/utilities'
import { PropsWithChildren } from 'react'

const {
	Content,
	FooterActions,
	HeaderActions,
	Logo,
	Navigation,
	Sidebar,
	Title,
	Switchers,
	Back,
	Profile,
	...rest
} = CommonSlotTargets

if (import.meta.env.DEV) {
	const __exhaustiveCheck: Record<PropertyKey, never> = rest
}

export const Layout = ({
	children,
	className,
	...rest
}: PropsWithChildren<{
	className?: NestedClassName;
}>) => (
	<DefaultLayout
		className={useClassName(undefined, className)}
		sidebarHeader={<Logo />}
		switchers={<Switchers />}
		navigation={<Navigation />}
		children={(
			<LayoutPage
				navigation={<Back />}
				actions={<HeaderActions />}
				side={<Sidebar />}
				title={<Title />}
			>
				{<Content />}
				{(
					<>
						<Divider />
						<FooterActions />
					</>
				)}
				{children}
			</LayoutPage>
		)}
		sidebarFooter={<Profile />}
		{...rest}
	/>
)
