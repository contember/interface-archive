import { ReactNode, ComponentType, ReactElement, memo, useCallback, useMemo, useRef, useState, FC, FunctionComponent, Fragment, PureComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { pushRequest } from '../../actions/request'
import { Dispatch } from '../../actions/types'
import State from '../../state'
import { RequestChange } from '../../state/request'
import { requestStateToPath } from '../../utils/url'
import routes from '../../routes'
import { isUrlActive } from '../../utils/isUrlActive'

export interface DynamicLinkInnerProps {
	onClick: () => void
	children: ReactElement | null
	isActive: boolean
}

export interface DynamicLinkStateProps {
	url: string
}

export interface DynamicLinkDispatchProps {
	goTo: () => void
}

export interface DynamicLinkOwnProps {
	requestChange: RequestChange
	children?: ReactElement | null
	Component: ComponentType<DynamicLinkInnerProps>
}

export type DynamicLinkProps = DynamicLinkDispatchProps & DynamicLinkStateProps & DynamicLinkOwnProps

const DynamicLinkComponent = (props: DynamicLinkProps) => {
	const Component = props.Component

	return (
		<Component onClick={props.goTo} isActive={isUrlActive(props.url)}>
			{props.children || null}
		</Component>
	)
}
DynamicLinkComponent.displayName = 'DynamicLink'

export const DynamicLink = connect<DynamicLinkStateProps, DynamicLinkDispatchProps, DynamicLinkOwnProps, State>(
	({ view, projectsConfigs, request }, { requestChange }) => ({
		url: requestStateToPath(routes(projectsConfigs.configs), requestChange(request)),
	}),
	(dispatch: Dispatch, { requestChange }) => ({ goTo: () => dispatch(pushRequest(requestChange)) }),
)(DynamicLinkComponent)
