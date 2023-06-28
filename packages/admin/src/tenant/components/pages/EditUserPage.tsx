import { useProjectSlug } from '@contember/react-client'
import { FC, memo } from 'react'
import { GenericPage } from '../../../components'
import { NavigateBackButton, RoutingLinkTarget } from '../../../routing'
import { EditIdentity, RolesConfig } from '../member'

export type EditUserPageProps = {
	identityId: string
	rolesConfig?: RolesConfig
	userListLink?: RoutingLinkTarget
}

/**
 * @group Tenant
 */
export const EditUserPage: FC<EditUserPageProps> = memo(
	({ rolesConfig, identityId, userListLink = 'tenantUsers' }) => {
		const project = useProjectSlug()
		if (!project) {
			return <>Not in project.</>
		}
		return (
			<GenericPage
				title="Edit user"
				back={<NavigateBackButton to={userListLink}>Back to list of users</NavigateBackButton>}
			>
				<EditIdentity project={project} rolesConfig={rolesConfig} identityId={identityId} userListLink={userListLink} />
			</GenericPage>
		)
	},
)

/**
 * @deprecated Use `EditUserPage` instead
 */
export const EditUserInProject = EditUserPage
