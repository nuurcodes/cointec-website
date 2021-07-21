import { FETCH_QUOTE, FETCH_QUOTE_START, FETCH_QUOTE_END } from '../actions'

const INITIAL_STATE = {
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_QUOTE:
			return { ...state, ...payload, loading: false, error: null }

		case FETCH_QUOTE_START:
			return { ...state, loading: true, error: null }

		case FETCH_QUOTE_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
