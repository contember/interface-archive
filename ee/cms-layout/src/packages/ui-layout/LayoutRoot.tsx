import { CSSProperties, ElementType, forwardRef, memo } from 'react'
import { isNonNegativeNumber } from '../assert-types'
import { classNameForFactory } from '../class-name'
import { px } from '../css-utilities'
import { useAddClassNameDuringResize, useCache } from '../react-hooks'
import { PolymorphicRef } from '../typescript-utilities'
import { GetLayoutPanelsStateContext, LayoutContainerWidthContext, useLayoutContainerWidth } from './Contexts'
import { LayoutPanelsStateProvider } from './LayoutPanelsStateProvider'
import { ContainerComponentType, ContainerProps, LayoutPanelConfig } from './Types'

export const LayoutRoot: ContainerComponentType = memo(forwardRef(
	<C extends ElementType = 'div'>({
		as,
		children,
		className,
		componentClassName = 'layout',
		...rest
	}: ContainerProps<C>, forwardedRef: PolymorphicRef<C>) => {
		useAddClassNameDuringResize('disable-transitions-on-resize')

		const Container = as ?? 'div'
		const width = useLayoutContainerWidth()
		const classNameFor = classNameForFactory(componentClassName, className)

		const stylesCache = useCache()

		return (
			<LayoutContainerWidthContext.Provider value={width}>
				<LayoutPanelsStateProvider>
					<GetLayoutPanelsStateContext.Consumer>
						{({ panels }) => (
							<Container
								ref={forwardedRef}
								className={classNameFor(null, [...panels.entries()].map(
									([name, panel]) => [
										panel.visibility ? `panel-${name}-visibility-${panel.visibility}` : undefined,
										panel.behavior ? `panel-${name}-behavior-${panel.behavior}` : undefined,
									],
								))}
								{...rest}
								style={stylesCache(() => getPanelsCSSCustomProperties(panels, width, rest.style), [panels, rest.style, width])}
							>
								{children}
							</Container>
						)}
					</GetLayoutPanelsStateContext.Consumer>
				</LayoutPanelsStateProvider>
			</LayoutContainerWidthContext.Provider>
		)
	},
))
LayoutRoot.displayName = 'Layout.Root'

function getPanelsCSSCustomProperties(panels: Map<string, LayoutPanelConfig>, width: number, restStyle: CSSProperties | undefined) {
	return {
		...([...panels.entries()].reduce(
			(previous, [panel, { basis, maxWidth, minWidth }]) => {
				return {
					...previous,
					[`--panel-${panel}-basis`]: px(isNonNegativeNumber(basis) ? Math.min(width, basis) : null),
					[`--panel-${panel}-min-width`]: px(isNonNegativeNumber(minWidth) ? Math.min(width, minWidth) : null),
					[`--panel-${panel}-max-width`]: px(isNonNegativeNumber(maxWidth) ? Math.min(width, maxWidth) : null),
				}
			},
			{} as CSSProperties,
		)),
		...restStyle,
	} as CSSProperties
}
