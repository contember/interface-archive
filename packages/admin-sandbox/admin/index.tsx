import { ApplicationEntrypoint, PageModule, Pages, UserConfig, runReactApp } from '@contember/admin'
import { Slots } from '@contember/layout'
import { createRoot } from 'react-dom/client'
import { DirectivesProvider, directivesDefaultValues } from './components/Directives'
import { Layout, LayoutDevPanel, ThemeDevPanel } from './components/Layout'
import './index.css'

const DEV_SAFE_AREA_INSETS = import.meta.env.DEV ? { top: 60, bottom: 60, left: 60, right: 60 } : undefined

const RootSlot = Slots.createSlotTargetComponent('cui-content-root', 'CUIRootSlot')

runReactApp(
	// <Slots.TargetOverrideContext.Provider value={'cui-content-root'}>
	// <Slots.Provider>
	<UserConfig.Provider
		value={{
			'StyleProvider.className.lucide-icons-override': false,
			'insets': DEV_SAFE_AREA_INSETS,
		} as unknown as any}
	>
		<DirectivesProvider value={directivesDefaultValues}>
			<ApplicationEntrypoint
				apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string}
				sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN as string}
				project={'admin-sandbox'}
				stage={'live'}
				basePath={import.meta.env.BASE_URL}
				devBarPanels={
					<>
						<LayoutDevPanel />
						<ThemeDevPanel />
					</>
				}
				children={<Pages children={import.meta.glob<PageModule>('./pages/**/*.tsx', { eager: true })} />}
			/>
		</DirectivesProvider>
	</UserConfig.Provider>
	// </Slots.Provider>
	// </Slots.TargetOverrideContext.Provider>
	,
	null,
	(dom, react, onRecoverableError) => createRoot(dom, { onRecoverableError }).render(react),
)
