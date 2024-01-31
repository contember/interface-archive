import { Field } from '@contember/interface'
import { Slot } from '../components/slots'
import { BoardColumnLabel } from '@contember/react-board'
import { Binding } from '../components/binding/Binding'
import { PersistButton } from '../components/binding/PersistButton'
import { DefaultBoard } from '../components/board'

const statusList = [
	{ value: 'backlog', label: 'Backlog' },
	{ value: 'todo', label: 'To do' },
	{ value: 'inProgress', label: 'In progress' },
	{ value: 'done', label: 'Done' },
]


export const assignee = () => <>
	<Binding>
		<Slot.Actions>
			<PersistButton />
		</Slot.Actions>

		<DefaultBoard
			entities={'BoardTask'}

			columns={'BoardUser'}
			columnsSortableBy={'order'}

			discriminationField={'assignee'}

			sortableBy={'order'}
			sortScope={'board'}

			columnHeader={
				<div className={'text-lg font-semibold'}>
					<Field field={'name'} />
				</div>
			}
			nullColumnHeader={
				<div className={'text-lg font-semibold italic'}>
					Without assignee
				</div>}
			children={<Field field={'title'} />}
		/>

	</Binding>
</>
export const status = () => <>
	<Binding>
		<Slot.Actions><PersistButton /></Slot.Actions>

		<DefaultBoard
			entities={'BoardTask'}

			columns={statusList}
			discriminationField={'status'}

			sortableBy={'order'}
			sortScope={'board'}
			columnHeader={
				<div className={'text-lg font-semibold'}>
					<BoardColumnLabel />
				</div>
			}
			nullColumnHeader={
				<div className={'text-lg font-semibold italic'}>
					Without status
				</div>}

		>
			<Field field={'title'} />
		</DefaultBoard>
	</Binding>
</>