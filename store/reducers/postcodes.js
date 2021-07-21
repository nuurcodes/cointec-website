import {
	LOOKUP_POSTCODE,
	LOOKUP_POSTCODE_START,
	LOOKUP_POSTCODE_END
} from '../actions'

const INITIAL_STATE = {
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case LOOKUP_POSTCODE:
			return { ...state, ...payload, loading: false, error: null }

		case LOOKUP_POSTCODE_START:
			return { ...state, loading: true, error: null }

		case LOOKUP_POSTCODE_END:
			return { loading: false, error: payload }

		default:
			return state
	}
}
