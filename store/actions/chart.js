import { ROOT_URL } from '..'

export const FETCH_RATES = 'FETCH_RATES'
export const FETCH_RATES_START = 'FETCH_RATES_START'
export const FETCH_RATES_END = 'FETCH_RATES_END'
export const CHANGE_TIME_INTERVAL = 'CHANGE_TIME_INTERVAL'

export const fetchRates = pair => async dispatch => {
	dispatch({ type: FETCH_RATES_START })

	try {
		const currency = pair.split('GBP')[1].toLowerCase()
		const response = await fetch(
			`https://api.staging.cointec.co.uk/charts/${currency}`
		)
		if (!response.ok) throw new Error(response.statusText)

		const payload = await response.json()
		return dispatch({
			type: FETCH_RATES,
			payload
		})
	} catch (error) {
		return dispatch({
			type: FETCH_RATES_END,
			payload: error.message
		})
	}
}

export const changeTimeInterval = payload => {
	return {
		type: CHANGE_TIME_INTERVAL,
		payload
	}
}
