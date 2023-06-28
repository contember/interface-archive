import { CreateProjectForm, GenericPage, NavigateBackButton } from '@contember/admin'

export default () => (
	<GenericPage
		title="Create new project"
		back={<NavigateBackButton to={'projectList'}>Projects</NavigateBackButton>}
		children={<CreateProjectForm projectListLink={'projectList'} />}
	/>
)
