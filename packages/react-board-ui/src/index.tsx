import { createBoardDndKit } from '@contember/react-board-dnd-kit'
import { BoardProps as BaseBoardProps } from '@contember/react-board'
import { BoardColumn, BoardColumnExtraProps } from './ui/BoardColumn'
import { BoardItem, BoardItemExtraProps } from './ui/BoardItem'
import { Stack, usePortalProvider } from '@contember/ui'
import { ComponentType } from 'react'

export type BoardProps = BaseBoardProps<BoardColumnExtraProps & BoardItemExtraProps>

export const Board: ComponentType<BoardProps> = createBoardDndKit({
	Column: BoardColumn,
	Item: BoardItem,
	Wrapper: ({ children }) => <Stack horizontal>{children}</Stack>,
	usePortalProvider: usePortalProvider,
})

