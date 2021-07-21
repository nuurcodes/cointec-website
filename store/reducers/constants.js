import {
	FETCH_CONSTANTS,
	FETCH_CONSTANTS_START,
	FETCH_CONSTANTS_END
} from '../actions'

const INITIAL_STATE = {
	Frame1Refresh: 5,
	Frame2Refresh: 10,
	PaymentWindow: 5,
	WyreQuoteAmount: 200,
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_CONSTANTS:
			return { ...state, ...payload, loading: false, error: null }

		case FETCH_CONSTANTS_START:
			return { ...state, loading: true, error: null }

		case FETCH_CONSTANTS_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
