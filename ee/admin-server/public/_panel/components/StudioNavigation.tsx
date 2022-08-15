import { Menu, useEnvironment } from '@contember/admin'

export type StudioNavigationProps = { project: string }

export const StudioNavigation = ({ project }: StudioNavigationProps) => {
	const env = useEnvironment()
	const schema = env.getSchema()
	const entities = Array.from(schema.store.entities.values()).map(it => it.name).sort()

	return (
		<Menu.Item title={'Content'}>
			{entities.map(entity => (
				<Menu.Item key={entity} title={entity} to={{ pageName: 'studioGrid', parameters: { project, entity } }} />
			))}
		</Menu.Item>
	)
}
