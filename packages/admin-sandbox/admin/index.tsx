// Uncomment to see what caused re-renders
// Note: Does not work with pages containing content editor
// import './wdyr' // THIS MUST BE THE FIRST IMPORT!

import {
	ApplicationEntrypoint,
	DataBindingProvider,
	FeedbackRenderer,
	PageModule,
	Pages,
	runReactApp,
} from '@contember/admin'
import { createRoot } from 'react-dom/client'
import { Layout, LayoutDevPanel } from './components/Layout'
import { MetaDirectivesProvider } from './components/MetaDirectives'
import './index.sass'

runReactApp(
	<MetaDirectivesProvider>
		<ApplicationEntrypoint
			apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string}
			sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN as string}
			project={'admin-sandbox'}
			stage={'live'}
			basePath={import.meta.env.BASE_URL}
			devBarPanels={<>
				<LayoutDevPanel />
			</>}
			children={
				<DataBindingProvider stateComponent={FeedbackRenderer}>
					<Pages children={import.meta.glob<PageModule>('./pages/**/*.tsx')} layout={Layout} />
				</DataBindingProvider>
			}
		/>
	</MetaDirectivesProvider>
	,
	null,
	(dom, react, onRecoverableError) => createRoot(dom, { onRecoverableError }).render(react),
)
