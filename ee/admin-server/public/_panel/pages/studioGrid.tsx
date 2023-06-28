import {
	AutoGrid,
	DataBindingProvider,
	EntityId,
	FeedbackRenderer,
	LayoutRenderer,
	LinkButton,
	PersistButton,
	RoutingParameter,
	SugaredFilter,
	useCurrentRequest,
} from '@contember/admin'

export default function StudioGrid() {
	const request = useCurrentRequest()!
	const project = request.parameters.project as string
	const entity = request.parameters.entity as string
	const id = request.parameters.id as EntityId | undefined

	const createViewLinkTarget = (entity: string) => ({ pageName: 'studioGrid', parameters: { project, entity, id: new RoutingParameter('entity.id') } })
	const createEditLinkTarget = (entity: string) => ({ pageName: 'studioForm', parameters: { project, entity, id: new RoutingParameter('entity.id') } })

	const actions = (
		<>
			<LinkButton to={{ pageName: 'studioForm', parameters: { project, entity } }}>Create</LinkButton>
			<PersistButton />
		</>
	)

	const filter: SugaredFilter = id === undefined ? {} : { id: { eq: id } }
	const entities = {
		entityName: entity,
		filter,
	}

	return (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			{/* TODO: Re-apply pageContentLayout="start" */}
			<LayoutRenderer title={`List ${entity}`} headerActions={actions}>
				<AutoGrid entities={entities} createViewLinkTarget={createViewLinkTarget} createEditLinkTarget={createEditLinkTarget} />
			</LayoutRenderer>
		</DataBindingProvider>
	)
}
