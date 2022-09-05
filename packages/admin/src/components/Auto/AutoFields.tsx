import { Component } from '@contember/binding'
import { AutoField } from './AutoField'
import { RoutingLinkTarget } from '../../routing'

export type AutoFieldsProps = {
	createEditLink?: (entity: string) => RoutingLinkTarget
	excludedFields?: string[]
}

export const AutoFields = Component<AutoFieldsProps>(
	(props, env) => {
		const schema = env.getSchema()
		const entity = env.getSubTreeNode().entity
		const fields = Array.from(entity.fields.values()).filter(it => props.excludedFields === undefined || !props.excludedFields.includes(it.name))

		const autoFields = fields.map(field => (
			<AutoField
				key={field.name}
				schema={schema}
				entityName={entity.name}
				fieldName={field.name}
				createEditLink={props.createEditLink}
			/>
		))

		return <>{autoFields}</>
	},
)
