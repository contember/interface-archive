import { EditUserPage, InviteUserPage, useEnvironment, UserListPage } from '@contember/admin'
import { Directive } from '../components/Directives'
import { SlotSources } from '../components/Slots'

export const Users = () => {
	return (
		<>
			<Directive name="layout" content="bare" />
			<SlotSources.Content>
				<UserListPage editUserLink={'tenant/edit(id: $identityId)'} addUserLink={'tenant/invite'} />
			</SlotSources.Content>
			<Directive name="layout" content="legacy" />
		</>
	)
}
export const Edit = () => {
	const id = String(useEnvironment().getParameter('id'))
	return (
		<>
			<Directive name="layout" content="legacy" />
			<SlotSources.Content>
				<EditUserPage identityId={id} userListLink={'tenant/users'} />
			</SlotSources.Content>
		</>
	)
}

export const Invite = () => {
	return (
		<>
			<Directive name="layout" content="legacy" />
			<SlotSources.Content>
				<InviteUserPage userListLink={'tenant/users'} />
			</SlotSources.Content>
		</>
	)
}
