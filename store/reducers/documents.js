import {
	UPLOAD_DOCUMENT,
	UPLOAD_DOCUMENT_START,
	UPLOAD_DOCUMENT_END
} from '../actions'

const INITIAL_STATE = {
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case UPLOAD_DOCUMENT:
			return { ...state, ...payload, loading: false, error: null }

		case UPLOAD_DOCUMENT_START:
			return { ...state, loading: true, error: null }

		case UPLOAD_DOCUMENT_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
