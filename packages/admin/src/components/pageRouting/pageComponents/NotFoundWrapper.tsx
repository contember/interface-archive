import { Component, useEntity } from '@contember/binding'
import { Message } from '@contember/ui'
import { ReactNode } from 'react'
import { CommonPage } from '../../CommonPage'

export const NotFoundWrapper = Component<{ children: ReactNode, title?: ReactNode }>(
	({ children, title }) => {
		const accessor = useEntity()
		const node = accessor.environment.getSubTree()
		if (node.expectedCardinality === 'one' && !accessor.existsOnServer) {
			return (
				<CommonPage title={title}>
					<Message intent="danger">Requested entity of type {accessor.name} was not found</Message>
				</CommonPage>
			)
		}
		return <>{children}</>
	},
	({ children }) => <>{children}</>,
)
