import { FETCH_RATES, FETCH_RATES_START, FETCH_RATES_END, CHANGE_TIME_INTERVAL } from '../actions'

const INITIAL_STATE = {
	data: {
		ThirtyDay: [],
		SevenDay: [],
		OneDay: []
	},
	intervalValue: "30D",
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_RATES:
			return { ...state, data: payload, loading: false, error: null }

		case FETCH_RATES_START:
			return { ...state, loading: true, error: null }

		case FETCH_RATES_END:
			return { ...state, loading: false, error: payload }

		case CHANGE_TIME_INTERVAL:
			return { ...state, intervalValue: payload }

		default:
			return state
	}
}
