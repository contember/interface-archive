import { AnchorButton, ButtonList } from '@contember/ui'
import { CommonPage } from '../CommonPage'
import { EmptyMessage } from '../bindingFacade'

export interface Project {
	slug: string
	name: string
}

export interface ProjectListProps {
	projects: readonly Project[],
	formatProjectUrl: (project: Project) => string
}

export const ProjectList = (props: ProjectListProps) => {
	return (
		<CommonPage title="Projects">
			<ProjectListButtons {...props} />
		</CommonPage>
	)
}

export const ProjectListButtons = (props: ProjectListProps) => {
	if (props.projects.length === 0) {
		return <EmptyMessage>No projects found</EmptyMessage>
	}

	return <ButtonList flow="block">
		{props.projects.map(project => (
			<AnchorButton
				key={project.slug}
				href={props.formatProjectUrl(project)}
				distinction="seamless"
				flow="block"
				justification="justifyStart"
			>
				{project.name}
			</AnchorButton>
		))}
	</ButtonList>
}
