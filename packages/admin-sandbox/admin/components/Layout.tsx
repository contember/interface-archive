import { Button, Stack, StackOwnProps } from '@contember/admin'
import { CommonSlots, LayoutSlotsProvider, PropsWithRequiredChildren } from '@contember/cms-layout'
import { ChangeEvent, ComponentType, createElement, memo, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import * as Layouts from './Layouts'
import { MetaDirective, useMetaDirectives } from './MetaDirectives'
import { DevPanel } from '@contember/admin'

export const { Actions, Back, Title: TitleSlot, Content, Logo, Navigation, Sidebar, ...restOfCommonSlots } = CommonSlots

if (import.meta.env.DEV) {
	const exhaustiveCheck: Record<string, never> = restOfCommonSlots
}

export const Title = memo<{ children: string | null | undefined }>(({ children }) => (
	<MetaDirective name="title" content={children} />
))

function SlotWithStack<C extends ComponentType<PropsWithRequiredChildren>>(Component: C) {
	const WrappedComponent = memo<Partial<StackOwnProps>>(({
		direction = 'vertical',
		gap = 'large',
		...rest
	}) => {
		return createElement(
			Component,
			{
				children: <Stack direction={direction} gap={gap} {...rest} />,
			},
		)
	})
	WrappedComponent.displayName = Component.displayName

	return WrappedComponent
}

export const SidebarStack = SlotWithStack(Sidebar)
export const ContentStack = SlotWithStack(Content)

const types = Object.keys(Layouts) as ReadonlyArray<keyof typeof Layouts>
export type LayoutTypes = typeof types[number]

export const BREAKPOINT = 768


export const Layout = (props: {
	children?: ReactNode;
}) => {
	const initialTitle = useMemo(() => document.title, [])

	const { layout, title } = useMetaDirectives()
	const LayoutComponent = Layouts[layout ?? 'default']
	useEffect(() => {
		if (title) {
			document.title = `${title} / ${initialTitle}`
		} else {
			document.title = initialTitle
		}
	}, [initialTitle, title])

	return (
		<LayoutSlotsProvider>
			<TitleSlot><h1>{title}</h1></TitleSlot>
			<LayoutComponent />
			{props.children}
		</LayoutSlotsProvider>
	)
}

export const LayoutDevPanel = () => {
	const [typeState, setTypeState] = useState<LayoutTypes>()
	const [counter, setCounter] = useState(1)
	const { layout } = useMetaDirectives()
	return (
		<>
			{typeState && <MetaDirective name={'layout'} content={typeState} key={counter} />}
			<DevPanel heading={`Layout: ${layout}`}>
				{Object.keys(Layouts).map(key => (
					<Button key={key} onClick={() => {
						setTypeState(key as keyof typeof Layouts)
						setCounter(it => it + 1)
					}}>{key}</Button>
				))}
			</DevPanel>
		</>
	)
}

Layout.types = types
Layout.breakpoint = BREAKPOINT
