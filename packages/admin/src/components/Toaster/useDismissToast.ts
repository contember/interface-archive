import { useContext } from 'react'
import { ToasterContext } from './ToasterContext'

export const useDismissToast = () => {
	const toasterContext = useContext(ToasterContext)
	if (!toasterContext) {
		throw new Error('Toaster context is not initialized')
	}
	return toasterContext.dismissToast
}
