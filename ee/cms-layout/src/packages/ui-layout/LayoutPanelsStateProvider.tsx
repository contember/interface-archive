import deepEqual from 'deep-equal'
import { ReactNode, memo, useCallback, useMemo, useState } from 'react'
import { assert, isDefined } from '../assert-types'
import { GetLayoutPanelsStateContext, SetLayoutPanelsStateContext, SetLayoutPanelsStateContextType } from './Contexts'
import { LayoutPanelConfig } from './Types'

export const LayoutPanelsStateProvider = memo<{ children: ReactNode }>(({ children }) => {
	const [currentlyActivePanel, setCurrentlyActivePanel] = useState<string>()
	const [panels, setPanels] = useState<Map<string, LayoutPanelConfig>>(new Map)

	const updatePanels = useCallback((
		panel: string,
		updater: (previous: LayoutPanelConfig) => LayoutPanelConfig,
	) => {
		setPanels(panels => {
			if (panels.has(panel)) {
				const previous = panels.get(panel)
				assert(`previous value is defined`, previous, isDefined<LayoutPanelConfig>)

				const next = updater(previous)

				if (!deepEqual(next, previous)) {
					return new Map([...panels, [panel, next]])
				} else {
					return panels
				}
			} else {
				throw new Error(`Record with ${panel} key does not exist`)
			}
		})
	}, [])

	const layoutPanelRegister: SetLayoutPanelsStateContextType = useMemo(() => {
		return {
			registerLayoutPanel: (name: string, config: LayoutPanelConfig) => {
				setPanels(panels => {
					const previous = panels.get(name)

					if (!previous || !deepEqual(config, previous)) {
						return new Map([...panels, [name, config]])
					} else {
						return panels
					}
				})
			},
			unregisterLayoutPanel: (name: string) => {
				setPanels(panels => {
					panels.delete(name)
					return new Map([...panels])
				})
			},
			show: (panel: string) => {
				setCurrentlyActivePanel(panel)
				updatePanels(panel, previous => ({ ...previous, visibility: 'visible' }))
			},
			hide: (panel: string) => {
				setCurrentlyActivePanel(deactivateIfPanelMatches(panel))
				updatePanels(panel, previous => ({ ...previous, visibility: 'hidden' }))
			},
			reset: (panel: string) => {
				updatePanels(panel, previous => ({ ...previous, visibility: null }))
			},
			activate: (panel: string) => {
				setCurrentlyActivePanel(panel)
			},
			deactivate: (panel: string) => {
				setCurrentlyActivePanel(deactivateIfPanelMatches(panel))
			},
			update: (panel, config) => {
				if (config) {
					assert('config has no property "name"', config, (value: typeof config): value is Partial<Omit<LayoutPanelConfig, 'name'>> => {
						return !('name' in config)
					})
					updatePanels(panel, previous => ({ ...previous, ...config }))
				}
			},
		}
	}, [updatePanels])

	const state = useMemo(() => ({
		currentlyActivePanel,
		panels,
	}), [panels, currentlyActivePanel])

	return (
		<SetLayoutPanelsStateContext.Provider value={layoutPanelRegister}>
			<GetLayoutPanelsStateContext.Provider value={state}>
				{children}
			</GetLayoutPanelsStateContext.Provider>
		</SetLayoutPanelsStateContext.Provider>
	)
})
LayoutPanelsStateProvider.displayName = 'Layout.PanelsStateProvider'

function deactivateIfPanelMatches(panel: string) {
	return function maybeDeactivatePanel(current: string | undefined) {
		return current === panel ? undefined : current
	}
}
