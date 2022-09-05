import {
	Component, Entity, EntityAccessor,
	EntityListSubTree,
	Field,
	Schema,
	TreeRootIdProvider,
	useEntity,
	useExtendTree,
	useGetEntityListSubTree,
} from '@contember/binding'
import { CheckboxField, DateField, DateTimeField, FloatField, MultiSelectField, NumberField, SelectField, TextareaField, TextField } from '../bindingFacade'
import { getHumanFriendlyField, resolveConnectingEntity, resolveSortableBy } from './utils'
import { AutoFields } from './AutoFields'
import { RoutingLinkTarget } from '../../routing'
import { AutoLabel } from './AutoLabel'
import { FieldContainer, Spinner } from '@contember/ui'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useIsMounted } from '@contember/react-utils'

export type AutoFieldProps = {
	schema: Schema
	entityName: string
	fieldName: string
	createEditLink?: (entity: string) => RoutingLinkTarget
}

export const AutoField = Component<AutoFieldProps>(
	({ schema, entityName, fieldName, createEditLink }) => {
		const field = schema.getEntityField(entityName, fieldName)

		if (field.__typename === '_Column') {
			const common = {
				field: field.name,
				label: field.name,
				required: !field.nullable,
				defaultValue: field.defaultValue as any,
			}

			if (field.name === 'id') {
				return <TextField {...common} readOnly />

			} else if (field.type === 'String') {
				return <TextareaField {...common} minRows={1} />

			} else if (field.type === 'Uuid') {
				return <TextField {...common} />

			} else if (field.type === 'Bool') {
				return <CheckboxField {...common} />

			} else if (field.type === 'Integer') {
				return <NumberField {...common} />

			} else if (field.type === 'Double') {
				return <FloatField {...common} />

			} else if (field.type === 'Date') {
				return <DateField {...common} />

			} else if (field.type === 'DateTime') {
				return <DateTimeField {...common} />

			} else if (field.type === 'Enum') {
				const enumValues = schema.getEnumValues(field.enumName!)
				const options = enumValues.map(it => ({ value: it, label: it }))
				return <SelectField {...common} options={options} allowNull={field.nullable} />

			} else if (field.type === 'Json') {
				return <FieldContainer {...common}><Field field={field.name} format={it => <pre>{it}</pre>} /></FieldContainer>

			} else {
				return <FieldContainer {...common}>Unsupported field type {field.type}</FieldContainer>
			}

		} else {
			const sortableBy = resolveSortableBy(schema, field)
			const connectingEntity = resolveConnectingEntity(schema, field, sortableBy)

			const targetField = connectingEntity ? connectingEntity.field : field
			const targetEntity = schema.getEntity(targetField.targetEntity)
			const humanFieldName = getHumanFriendlyField(targetEntity)
			const optionLabel = <AutoLabel field={humanFieldName} createLink={createEditLink} />
			const otherSide = targetField.side === 'owning' ? targetField.inversedBy : targetField.ownedBy
			const excludedFields = [otherSide, sortableBy].filter(it => it) as string[]

			const createNewForm = (
				<Deferred fallback={<Spinner />}>
					<AutoFields excludedFields={excludedFields} createEditLink={createEditLink} />
				</Deferred>
			)

			if (field.type === 'OneHasOne' || field.type === 'ManyHasOne') {
				return (
					<SelectField
						field={field.name}
						label={field.name}
						options={targetEntity.name}
						optionLabel={optionLabel}
						searchByFields={[humanFieldName]}
						createNewForm={createNewForm}
						allowNull={field.nullable === true}
						required={field.nullable !== true}
						lazy
					/>
				)

			} else {
				return (
					<MultiSelectField
						field={field.name}
						label={field.name}
						options={targetEntity.name}
						optionLabel={optionLabel}
						searchByFields={[humanFieldName]}
						sortableBy={sortableBy}
						createNewForm={createNewForm}
						connectingEntityField={connectingEntity ? connectingEntity.field.name : undefined}
						lazy
					/>
				)
			}
		}
	},
)

type Deferred = {
	children: ReactNode
	fallback: ReactNode
}

const Deferred = Component<Deferred>(
	({ children, fallback }, env) => {
		const entityName = useEntity().name
		const extendTree = useExtendTree()
		const getSubTree = useGetEntityListSubTree()

		const [tree, setTree] = useState<string>()
		const [entity, setEntity] = useState<EntityAccessor>()

		const subTreeNode = useMemo(
			() => <EntityListSubTree entities={{ entityName }} limit={0} expectedMutation="none">{children}</EntityListSubTree>,
			[entityName, children],
		)

		useEffect(
			() => {
				(async () => {
					const treeId = await extendTree(subTreeNode)

					if (!treeId) {
						return
					}

					const subTreeAccessor = getSubTree({ entities: entityName, limit: 0, expectedMutation: 'none' }, treeId)
					const entityId = subTreeAccessor.createNewEntity()
					const entity = subTreeAccessor.getChildEntityById(entityId.value)
					setTree(treeId)
					setEntity(entity)
				})()
			},
			[extendTree, env, subTreeNode, getSubTree, entityName],
		)

		if (tree === undefined || entity === undefined) {
			return <>{fallback}</>
		}

		return <TreeRootIdProvider treeRootId={tree}><Entity accessor={entity}>{children}</Entity></TreeRootIdProvider>
	},
	props => <>{props.fallback}</>,
)
