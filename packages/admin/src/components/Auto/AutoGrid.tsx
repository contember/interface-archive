import { Component, QueryLanguage, Schema, useEnvironment } from '@contember/binding'
import { DataGrid, DataGridContainerPublicProps, DataGridProps, DeleteEntityButton, GenericCell } from '../bindingFacade'
import { LinkButton, RoutingLinkTarget } from '../../routing'
import { AutoCell } from './AutoCell'

const createDataGridColumns = (
	schema: Schema,
	entityName: string,
	createViewLinkTarget?: (entity: string) => RoutingLinkTarget,
	createEditLinkTarget?: (entity: string) => RoutingLinkTarget,
) => {
	const entitySchema = schema.getEntity(entityName)!

	const fieldColumns = Array.from(entitySchema.fields.values()).map(it => (
		<AutoCell key={it.name} schema={schema} entityName={entityName} fieldName={it.name} createEntityLink={createViewLinkTarget} />
	))

	const actionColumn = (
		<GenericCell key="action" shrunk>
			{createEditLinkTarget && (
				<LinkButton to={createEditLinkTarget(entityName)} distinction="seamless">
					edit
				</LinkButton>
			)}
			<DeleteEntityButton />
		</GenericCell>
	)

	return [...fieldColumns, actionColumn]
}

export type AutoGridProps =
	& DataGridContainerPublicProps
	& {
		entities: DataGridProps<never>['entities']
		createViewLinkTarget?: (entity: string) => RoutingLinkTarget
		createEditLinkTarget?: (entity: string) => RoutingLinkTarget
	}

export const AutoGrid = Component<AutoGridProps>(
	(props: AutoGridProps) => {
		const env = useEnvironment()
		const schema = env.getSchema()
		const entities = QueryLanguage.desugarQualifiedEntityList({ entities: props.entities }, env)
		const { createViewLinkTarget, createEditLinkTarget, ...dataGridProps } = props

		return <DataGrid {...dataGridProps} children={createDataGridColumns(schema, entities.entityName, createViewLinkTarget, createEditLinkTarget)} />
	},
	(props: AutoGridProps, env) => {
		const schema = env.getSchema()
		const entities = QueryLanguage.desugarQualifiedEntityList({ entities: props.entities }, env)
		const { createViewLinkTarget, createEditLinkTarget, ...dataGridProps } = props

		return <DataGrid {...dataGridProps} children={createDataGridColumns(schema, entities.entityName, createViewLinkTarget, createEditLinkTarget)} />
	},
)
