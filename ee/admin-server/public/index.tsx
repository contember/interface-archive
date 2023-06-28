import { AnchorButton, LoginEntrypoint, Project, runReactApp } from '@contember/admin'
import { CogIcon } from 'lucide-react'
import { customLoginConfig } from '../src/config'
import './index.css'

const Entry = () => {
	const configElement = document.getElementById('contember-config')
	const config = customLoginConfig(JSON.parse(configElement?.innerHTML ?? '{}'))

	const listProjects = async () => {
		const me = await fetch('/_me')
		const data = await me.json()
		return data.projects.map((it: any) => it.slug)
	}

	const formatProjectUrl = (project: Project) => `/${project.slug}/`

	const panelButton = (
		<AnchorButton href="/_panel/" size="small" distinction="seamless">
			<CogIcon /> Settings
		</AnchorButton>
	)

	return (
		<LoginEntrypoint
			{...config}
			apiBaseUrl="/_api"
			loginToken="__LOGIN_TOKEN__"
			projects={listProjects}
			formatProjectUrl={formatProjectUrl}
			projectsPageActions={panelButton}
		/>
	)
}

runReactApp(<Entry />)
