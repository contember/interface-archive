import { CreateApiKeyForm, GenericPage, NavigateBackButton, Page } from '@contember/admin'

export default (
	<Page name="apiKeyCreate">
		{({ project }: { project: string }) => (
			<GenericPage
				back={<NavigateBackButton to={{ pageName: 'projectOverview', parameters: { project } }}>Project</NavigateBackButton>}
				title={`Create API key for project ${project}`}
			>
				<CreateApiKeyForm
					project={project}
					apiKeyListLink={{ pageName: 'projectOverview', parameters: { project } }}
				/>
			</GenericPage>
		)}
	</Page>
)
