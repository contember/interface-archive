import { memo, NamedExoticComponent, PropsWithChildren, ReactElement } from 'react'
import { useEnvironment } from '../accessorPropagation/useEnvironment'
import type { Environment } from '../dao'
import { assertNever } from '../utils'
import type { MarkerProvider, StaticRenderProvider, StaticRenderProviderProps } from './MarkerProvider'

interface EnvAwareFunctionComponent<P> {
	(props: PropsWithChildren<P>, env: Environment): ReactElement<any, any> | null;
	displayName?: string | undefined;
}

function Component<Props extends {}>(
	statelessRender: EnvAwareFunctionComponent<Props>,
	displayName?: string,
): NamedExoticComponent<Props>

function Component<Props extends {}, NonStaticPropNames extends keyof Props = never>(
	statefulRender: EnvAwareFunctionComponent<Props>,
	staticRender: (
		props: StaticRenderProviderProps<Props, NonStaticPropNames>,
		environment: Environment,
	) => ReactElement | null,
	displayName?: string,
): NamedExoticComponent<Props>

function Component<Props extends {}, NonStaticPropNames extends keyof Props = never>(
	statefulRender: EnvAwareFunctionComponent<Props>,
	markerProvisions: MarkerProvider<Props, NonStaticPropNames>,
	displayName?: string,
): NamedExoticComponent<Props>

function Component<Props extends {}, NonStaticPropNames extends keyof Props = never>(
	render: EnvAwareFunctionComponent<Props>,
	decider?:
		| string
		| ((props: StaticRenderProviderProps<Props, NonStaticPropNames>, environment: Environment) => ReactElement | null)
		| MarkerProvider<Props, NonStaticPropNames>,
	displayName?: string,
) {
	const renderWithEnv = render.length < 2 ? render : (props: Props) => render(props, useEnvironment())

	if (decider === undefined || typeof decider === 'string') {
		render.displayName = decider
		const augmentedRender: NamedExoticComponent<Props> & MarkerProvider<Props> = memo<Props>(renderWithEnv)
		augmentedRender.staticRender = render as StaticRenderProvider<Props>['staticRender']
		augmentedRender.displayName = decider

		return augmentedRender
	}

	render.displayName = displayName
	const augmentedRender: NamedExoticComponent<Props> & MarkerProvider<Props, NonStaticPropNames> = memo<Props>(renderWithEnv)
	augmentedRender.displayName = displayName

	if (typeof decider === 'function') {
		augmentedRender.staticRender = decider

		return augmentedRender
	}
	if (typeof decider === 'object') {
		for (const provisionName in decider) {
			const methodName = provisionName as keyof MarkerProvider<Props, NonStaticPropNames>
			;(augmentedRender[methodName] as MarkerProvider<Props, NonStaticPropNames>[typeof methodName]) =
				decider[methodName]
		}

		return augmentedRender
	}
	assertNever(decider)
}

export type { EnvAwareFunctionComponent }
export { Component }
