import axios from 'axios'

export const UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT'
export const UPLOAD_DOCUMENT_START = 'UPLOAD_DOCUMENT_START'
export const UPLOAD_DOCUMENT_END = 'GET_REHIVE_TOKEN_END'

export const uploadDocument = ({
	AccountId,
	RehiveId,
	Token,
	file,
	category,
	onUploadProgress
}) => dispatch => {
	dispatch({ type: UPLOAD_DOCUMENT_START })

	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Token ${Token}`
	}

	const data = new FormData()
	data.append('file', file)
	// data.append('document_category', category)
	if (category === 'Proof Of Identity') {
		data.append('document_type', 'government_id')
	} else {
		data.append('document_type', 'utility_bill')
	}
	data.append('status', 'pending')
	data.append('user', RehiveId)

	return axios
		.post(`https://api.rehive.com/3/admin/users/documents/`, data, {
			headers,
			onUploadProgress
		})
		.then(response => {
			// console.log(response)
			dispatch({
				type: UPLOAD_DOCUMENT,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: UPLOAD_DOCUMENT_END,
				payload: error
			})
			throw error
		})
}
