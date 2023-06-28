import { LayoutKit, Slots, createLayoutBarComponent, createLayoutSidebarComponent } from '@contember/layout'
import { Stack } from '@contember/ui'
import { pick } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { AppHeaderTitle } from '../AppHeaderTitle'
import { useDirectives } from '../Directives'
import { SlotTargets } from '../Slots'

const NAVIGATION_PANEL_NAME = 'navigation-panel'

const LayoutSlots = pick(SlotTargets, [
	'Back',
	'Content',
	'ContentFooter',
	'ContentHeader',
	'FooterActions',
	'HeaderActions',
	'HeaderCenter',
	'HeaderStart',
	'Logo',
	'Navigation',
	'Profile',
	'Sidebar',
	'Switchers',
	'Title',
])

const NavigationPanel = createLayoutSidebarComponent({
	defaultAs: 'aside',
	defaultBehavior: 'modal',
	defaultVisibility: 'hidden',
	displayName: 'NavigationPanel',
	name: NAVIGATION_PANEL_NAME,
})

const SubHeader = createLayoutBarComponent({
	defaultAs: 'div',
	displayName: 'SubHeader',
	name: 'sub-header',
})

export const Layout = ({ children, ...rest }: PropsWithChildren) => {
	const directives = useDirectives()
	const activeSlotTargets = Slots.useRenderToActiveSlotsFactory(LayoutSlots)

	return (
		<LayoutKit.Frame
			header={
				<>
					<LayoutKit.Header
						start={activeSlotTargets('Logo', 'Switchers', 'HeaderStart')}
						center={activeSlotTargets('HeaderCenter')}
						end={(
							<>
								<SlotTargets.Profile />
								<LayoutKit.ToggleMenuButton panelName={NAVIGATION_PANEL_NAME} />
							</>
						)}
					/>
					<SubHeader
						start={(
							<Stack align="center" direction="horizontal">
								<SlotTargets.Back />
								<SlotTargets.Title as={AppHeaderTitle} />
							</Stack>
						)}
						center={activeSlotTargets('ContentHeader')}
						end={activeSlotTargets('HeaderActions')}
					/>
				</>
			}
			{...rest}
		>
			<LayoutKit.ContentPanelMain
				header={activeSlotTargets('ContentHeader')}
				body={activeSlotTargets('Content', 'Sidebar')}
				footer={activeSlotTargets('ContentFooter', 'FooterActions')}
				maxWidth={directives?.['content-max-width']}
			/>
			<NavigationPanel
				body={activeSlotTargets('Navigation')}
			/>
			{children}
		</LayoutKit.Frame>
	)
}
