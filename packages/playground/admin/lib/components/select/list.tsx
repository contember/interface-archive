import * as React from 'react'
import { ReactNode } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { DataViewLoaderOverlay } from '../datagrid'
import { SelectPagination } from './pagination'
import { Loader } from '../ui/loader'
import { DataViewEachRow, DataViewHighlightRow, DataViewKeyboardEventHandler, DataViewLoaderState } from '@contember/react-dataview'
import { useOnHighlight } from './highlight'


export type SelectListProps =
	& {
		children: ReactNode
		filterToolbar?: ReactNode
	}

export const SelectListInner = ({ children, filterToolbar }: SelectListProps) => {
	return (
		<DataViewKeyboardEventHandler>
			<div className={'flex flex-col gap-4 group-data-[side="top"]:flex-col-reverse'}>
				{filterToolbar && <div className={'px-4'}>
					{filterToolbar}
				</div>}
				<ScrollArea className={'max-h-96'}>
					<div className={'flex flex-col gap-1 px-4'}>
						<DataViewLoaderState refreshing>
							<DataViewLoaderOverlay />
						</DataViewLoaderState>
						<DataViewLoaderState refreshing loaded>
							<DataViewEachRow>
								<DataViewHighlightRow onHighlight={useOnHighlight()}>
									{children}
								</DataViewHighlightRow>
							</DataViewEachRow>
							<SelectPagination />
						</DataViewLoaderState>
					</div>
				</ScrollArea>
				<DataViewLoaderState initial>
					<Loader position={'static'} size={'sm'} />
				</DataViewLoaderState>
			</div>
		</DataViewKeyboardEventHandler>
	)
}
