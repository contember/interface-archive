import { Spacer, Stack } from '@contember/admin'
import { LayoutKit, Slots, commonSlots, contentSlots, footerSlots, headerSlots } from '@contember/layout'
import { pick, useClassName } from '@contember/utilities'
import { PropsWithChildren } from 'react'
import { useDirectives } from '../Directives'
import { SlotTargets } from '../Slots'

const slotsInSidebarLeft = ['Navigation', 'Profile', 'SidebarLeftBody', 'SidebarLeftFooter', 'SidebarLeftHeader', 'Switchers'] as const
const slotsInSidebarRight = ['SidebarRightHeader', 'Sidebar', 'SidebarRightFooter'] as const

export const SidebarLeftSlots = pick(SlotTargets, slotsInSidebarLeft)
export const SidebarRightSlots = pick(SlotTargets, slotsInSidebarRight)
export const LayoutSlots = pick(SlotTargets, [...commonSlots, ...headerSlots, ...footerSlots, ...contentSlots, ...slotsInSidebarLeft, ...slotsInSidebarRight] as const)

export const Layout = ({ children, ...rest }: PropsWithChildren) => {
	const directives = useDirectives()
	const hasActiveSlots = Slots.useHasActiveSlotsFactory(LayoutSlots)
	const activeSlotTargets = Slots.useRenderToActiveSlotsFactory(LayoutSlots)

	const isSidebarLeftActive = hasActiveSlots(...slotsInSidebarLeft)
	const isSidebarRightActive = hasActiveSlots(...slotsInSidebarRight)

	return (
		<LayoutKit.Frame
			header={
				<LayoutKit.Header
					start={(
						<Slots.IfActive slots={['Logo', 'HeaderStart']}>
							<LayoutSlots.Logo />
							<LayoutSlots.HeaderStart />
						</Slots.IfActive>
					)}
					startAfter={({ panels }) =>
						panels.get(LayoutKit.SidebarLeft.NAME)?.behavior !== 'modal' && (
							<LayoutKit.ToggleSidebarButton panelName={LayoutKit.SidebarLeft.NAME} position="left" />
						)
					}
					center={(
						<>
							<Stack align="center" direction="horizontal" gap="default">
								<LayoutSlots.Back />
								<LayoutSlots.Title />
							</Stack>
							<LayoutSlots.HeaderCenter />
						</>
					)}
					endBefore={(
						<LayoutKit.ToggleSidebarButton
							className={useClassName('toggle-right-sidebar')}
							panelName={LayoutKit.SidebarRight.NAME}
							position="right"
						/>
					)}
					end={(
						<>
							<LayoutSlots.HeaderEnd />
							<LayoutSlots.HeaderActions />
						</>
					)}
					endAfter={({ panels }) =>
						panels.get(LayoutKit.SidebarLeft.NAME)?.behavior === 'modal' && (
							<LayoutKit.ToggleMenuButton panelName={LayoutKit.SidebarLeft.NAME} />
						)
					}
				/>
			}
			footer={(
				<LayoutKit.Footer
					start={<LayoutSlots.FooterStart />}
					center={<LayoutSlots.FooterCenter />}
					end={(
						<>
							<LayoutSlots.FooterEnd />
							<LayoutSlots.FooterActions />
						</>
					)}
				/>
			)}
			{...rest}
		>
			{isSidebarLeftActive && (
				<LayoutKit.SidebarLeft
					header={({ behavior }) => (
						<>
							<LayoutSlots.SidebarLeftHeader />
							<LayoutSlots.Switchers />
							<Spacer />
							{behavior === 'modal' && (
								<LayoutKit.ToggleMenuButton panelName={LayoutKit.SidebarLeft.NAME} />
							)}
						</>
					)}
					body={
						<>
							<LayoutSlots.Navigation />
							<LayoutSlots.SidebarLeftBody />
						</>
					}
					footer={(
						<>
							<LayoutSlots.SidebarLeftFooter />
							<LayoutSlots.Profile />
						</>
					)}
				/>
			)}
			<LayoutKit.ContentPanelMain
				header={<LayoutSlots.ContentHeader />}
				footer={<LayoutSlots.ContentFooter />}
				body={<LayoutSlots.Content />}
				maxWidth={directives['content-max-width']}
			/>
			{isSidebarRightActive && (
				<LayoutKit.SidebarRight
					header={({ behavior }) =>
					(behavior === 'modal' && (
						<>
							<LayoutSlots.SidebarRightHeader />
							<Spacer />
							<LayoutKit.ToggleMenuButton panelName={LayoutKit.SidebarRight.NAME} />
						</>
					)
					)}
					body={<LayoutSlots.Sidebar />}
					footer={<LayoutSlots.SidebarRightFooter />}
				/>
			)}
			{children}
		</LayoutKit.Frame>
	)
}
