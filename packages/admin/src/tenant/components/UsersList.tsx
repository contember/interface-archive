import { useCurrentContentGraphQlClient, useProjectSlug } from '@contember/react-client'
import { TitleBar } from '@contember/ui'
import { FC, memo, useCallback } from 'react'
import { PageLinkButton } from '../../components'
import { RoutingLinkTarget } from '../../routing'
import { RoleRendererFactory, RoleRenderers } from './RoleRenderer'
import { MemberList } from './MemberList'

export interface UsersListProps<T> {
	project: string
	children?: undefined
	createRoleRenderer?: RoleRendererFactory
	createUserEditLink: (id: string) => RoutingLinkTarget
}

export const UsersList = memo<UsersListProps<any>>(({ createUserEditLink, ...props }) => (
	<MemberList
		{...props}
		createEditIdentityLink={createUserEditLink}
		memberType={'PERSON'}
		Identity={({ identity }) => <>{identity.person ? identity.person.email : '?'}</>}
	/>
))

interface UsersManagementProps<T> {
	rolesDataQuery: string
	roleRenderers: RoleRenderers<T>
}

export const UsersManagement: FC<UsersManagementProps<any>> = <T extends {}>(props: UsersManagementProps<T>) => {
	const project = useProjectSlug()
	const contentClient = useCurrentContentGraphQlClient()
	const roleRendererFactory: RoleRendererFactory = useCallback(async () => {
		const rolesData = await contentClient.sendRequest(props.rolesDataQuery)
		return ({ role, variables }) => {
			const Renderer = props.roleRenderers[role]
			if (!Renderer) {
				return <>Unknown role {role}</>
			}
			return <Renderer rolesData={rolesData} variables={variables} />
		}
	}, [contentClient, props.roleRenderers, props.rolesDataQuery])
	if (project) {
		return (
			<>
				<TitleBar actions={<PageLinkButton to={'tenantInviteUser'}>Add a user</PageLinkButton>}>
					Users in project
				</TitleBar>
				<UsersList
					project={project}
					createRoleRenderer={roleRendererFactory}
					createUserEditLink={id => ({ pageName: 'tenantEditUser', params: { id } })}
				/>
			</>
		)
	}
	return null
}
