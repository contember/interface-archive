import {
	AutoGrid,
	DataBindingProvider,
	FeedbackRenderer,
	LayoutRenderer,
	LinkButton,
	PersistButton,
	RoutingParameter,
	useCurrentRequest,
} from '@contember/admin'

export default function StudioGrid() {
	const request = useCurrentRequest()!
	const project = request.parameters.project as string
	const entity = request.parameters.entity as string
	const filter = request.parameters.id ? `[id = '${request.parameters.id}']` : ''

	const createViewLinkTarget = (entity: string) => ({ pageName: 'studioGrid', parameters: { project, entity, id: new RoutingParameter('entity.id') } })
	const createEditLinkTarget = (entity: string) => ({ pageName: 'studioForm', parameters: { project, entity, id: new RoutingParameter('entity.id') } })

	const actions = (
		<>
			<LinkButton to={{ pageName: 'studioForm', parameters: { project, entity } }}>Create</LinkButton>
			<PersistButton />
		</>
	)

	return (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<LayoutRenderer title={`List ${entity}`} actions={actions} pageContentLayout="start">
				<AutoGrid entities={entity + filter} createViewLinkTarget={createViewLinkTarget} createEditLinkTarget={createEditLinkTarget} />
			</LayoutRenderer>
		</DataBindingProvider>
	)
}
