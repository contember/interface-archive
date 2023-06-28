import {
	AutoForm,
	AutoGrid,
	DataBindingProvider,
	EntityId,
	FeedbackRenderer,
	Link,
	LinkButton,
	NavigateBackLink,
	PersistButton,
	RoutingParameter,
	useCurrentRequest,
	useEnvironment,
	useOnPersistSuccess,
} from '@contember/admin'
import { Directive, Title } from '../components/Directives'
import { SlotSources } from '../components/Slots'

const AutoGridList = () => {
	const env = useEnvironment()
	const schema = env.getSchema()
	const entities = schema.getEntityNames().sort()

	return (
		<>
			{entities.map(entity => (
				<Link key={entity} to={{ pageName: 'auto/grid', parameters: { entity } }}>{entity}</Link>
			))}
		</>
	)
}

export default (
	<>
		<Title>Auto Admin</Title>
		<SlotSources.Content>
			<DataBindingProvider stateComponent={FeedbackRenderer}>
				<AutoGridList />
			</DataBindingProvider>
		</SlotSources.Content>
	</>
)

export function Grid() {
	const request = useCurrentRequest()!
	const entity = request.parameters.entity as string
	const filter = request.parameters.id ? `[id = '${request.parameters.id}']` : ''

	const createViewLinkTarget = (entity: string) => ({ pageName: 'auto/grid', parameters: { entity, id: new RoutingParameter('entity.id') } })
	const createEditLinkTarget = (entity: string) => ({ pageName: 'auto/form', parameters: { entity, id: new RoutingParameter('entity.id') } })

	const actions = (
		<>
			<LinkButton to={{ pageName: 'auto/form', parameters: { entity } }}>Create</LinkButton>
			<PersistButton />
		</>
	)

	return (
		<DataBindingProvider stateComponent={FeedbackRenderer}>
			<Directive name="layout" content="legacy" />

			<SlotSources.Back>
				<NavigateBackLink to={{ pageName: 'auto' }}>Back to Auto</NavigateBackLink>
			</SlotSources.Back>

			<Title>{`List ${entity}`}</Title>

			<SlotSources.HeaderActions>{actions}</SlotSources.HeaderActions>
			<SlotSources.Content>
				<AutoGrid entities={entity + filter} createViewLinkTarget={createViewLinkTarget} createEditLinkTarget={createEditLinkTarget} />
			</SlotSources.Content>
		</DataBindingProvider>
	)
}

export function Form() {
	const request = useCurrentRequest()!
	const entity = request.parameters.entity as string
	const id = request.parameters.id as EntityId | undefined
	const title = id ? `Edit ${entity}` : `Create ${entity}`

	const redirectOnSuccess = { pageName: 'auto/form', parameters: { entity, id: new RoutingParameter('entity.id') } }
	const onCreateSuccess = useOnPersistSuccess({ redirectOnSuccess })
	const createEditLink = (entity: string) => ({ pageName: 'auto/form', parameters: { entity, id: new RoutingParameter('entity.id') } })

	return (
		<>
			<Title>{title}</Title>
			<SlotSources.Back>
				<NavigateBackLink to={{ pageName: 'auto/grid', parameters: { entity } }}>Back to Grid</NavigateBackLink>
			</SlotSources.Back>

			<SlotSources.Content>
				<DataBindingProvider stateComponent={FeedbackRenderer} >
					<SlotSources.HeaderActions>
						<PersistButton />
					</SlotSources.HeaderActions>
					<AutoForm entity={entity} id={id} onCreateSuccess={onCreateSuccess} createEditLink={createEditLink} />
				</DataBindingProvider>
			</SlotSources.Content>
		</>
	)
}
