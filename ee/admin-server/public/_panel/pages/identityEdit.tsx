import { EditIdentity, GenericPage, NavigateBackButton, Page } from '@contember/admin'

export default (
	<Page name="identityEdit">
		{({ project, identity }: { project: string, identity: string }) => (
			<GenericPage
				back={<NavigateBackButton to={{ pageName: 'projectOverview', parameters: { project } }}>Users</NavigateBackButton>}
				title={`Edit membership in project ${project}`}
			>
				<EditIdentity
					project={project}
					identityId={identity}
					userListLink={{ pageName: 'projectOverview', parameters: { project } }}
				/>
			</GenericPage>
		)}
	</Page>
)
