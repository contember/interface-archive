import { ApplicationEntrypoint, Pages, runReactApp } from '@contember/admin'
import { SafeAreaInsetsProvider, Slots } from '@contember/layout'
import { panelConfig } from '../../src/config'
import { PanelLayout } from './components/PanelLayout'
import './index.css'

const DEV_SAFE_AREA_INSETS = import.meta.env.DEV ? { top: 30, bottom: 30, left: 30, right: 30 } : undefined

const Entry = () => {
	const configElement = document.getElementById('contember-config')
	const config = panelConfig(JSON.parse(configElement?.innerHTML ?? '{}'))

	return (
		<SafeAreaInsetsProvider insets={DEV_SAFE_AREA_INSETS}>
			<Slots.Provider>
				<ApplicationEntrypoint
					apiBaseUrl={'/_api'}
					basePath={'/_panel/'}
					onInvalidIdentity={() => {
						const params = new URLSearchParams({ backlink: window.location.pathname + window.location.search })
						window.location.href = '/?' + params.toString()
					}}
					routes={{
						projectList: { path: '/' },
						projectCreate: { path: '/project/create' },
						projectOverview: { path: '/project/view/:project' },
						userInvite: { path: '/project/invite/:project' },
						identityEdit: { path: '/project/edit/:project/:identity' },
						apiKeyCreate: { path: '/project/api-key/:project' },
						security: { path: '/security' },
						studioGrid: { path: '/project/studio/:project/grid/:entity/:id?' },
						studioForm: { path: '/project/studio/:project/form/:entity/:id?' },
					}}
					envVariables={config}
					LayoutComponent={PanelLayout}
					children={<Pages children={import.meta.glob('./pages/**/*.tsx', { eager: true })} />}
				/>
			</Slots.Provider>
		</SafeAreaInsetsProvider>
	)
}

runReactApp(<Entry />)
