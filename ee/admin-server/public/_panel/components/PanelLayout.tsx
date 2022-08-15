import {
	AnchorButton,
	ContemberLogoImage,
	DataBindingProvider,
	FeedbackRenderer,
	Layout,
	Logo,
	Menu,
	ProjectSlugContext,
	RoutingLink,
	StageSlugContext,
	useCurrentRequest,
} from '@contember/admin'
import { ReactNode } from 'react'
import { StudioNavigation } from './StudioNavigation'

export interface PanelLayoutProps {
	children?: ReactNode
}

export const PanelLayout = (props: PanelLayoutProps) => {
	const request = useCurrentRequest()!
	const project = request.parameters.project as string | undefined

	return (
		<ProjectSlugContext.Provider value={project}>
			<StageSlugContext.Provider value="live">
				<Layout
					children={props.children}
					sidebarHeader={
						<RoutingLink to="projectList">
							<Logo image={<ContemberLogoImage withLabel />} />
						</RoutingLink>
					}
					sidebarFooter={
						<AnchorButton distinction="seamless" href="/" justification="justifyStart">
							&larr; Close Admin Panel
						</AnchorButton>
					}
					navigation={
						<>
							{project === undefined && (
								<Menu>
									<Menu.Item title={'Contember Admin Panel'}>
										<Menu.Item title="Projects" to={'projectList'} />
										<Menu.Item title="Profile security" to={'security'} />
									</Menu.Item>
								</Menu>
							)}

							{project !== undefined && (
								<DataBindingProvider stateComponent={FeedbackRenderer}>
									<Menu>
										<Menu.Item title="Tenant">
											<Menu.Item title="Overview" to={{ pageName: 'projectOverview', parameters: { project } }} />
											<Menu.Item title="Invite User" to={{ pageName: 'userInvite', parameters: { project } }} />
											<Menu.Item title="Create API key" to={{ pageName: 'apiKeyCreate', parameters: { project } }} />
										</Menu.Item>
										<StudioNavigation project={project} />
									</Menu>
								</DataBindingProvider>
							)}
						</>
					}
				/>
			</StageSlugContext.Provider>
		</ProjectSlugContext.Provider>
	)
}
