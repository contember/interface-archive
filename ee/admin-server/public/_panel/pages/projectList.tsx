import { GenericPage, LinkButton, ProjectsGrid, useIdentity } from '@contember/admin'

export default () => {
	const identity = useIdentity()
	const actions = identity.permissions.canCreateProject
		? <LinkButton to="projectCreate" distinction="primary">New project</LinkButton>
		: null

	return (
		<GenericPage
			title="Projects"
			headerActions={actions}
			children={(
				<ProjectsGrid
					projectDetailLink={`projectOverview(project: $projectSlug)`}
				/>
			)}
		/>
	)
}
