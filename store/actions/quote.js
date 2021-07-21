import { ROOT_URL } from '..'

export const FETCH_QUOTE = 'FETCH_QUOTE'
export const FETCH_QUOTE_START = 'FETCH_QUOTE_START'
export const FETCH_QUOTE_END = 'FETCH_QUOTE_END'

export const fetchQuote = data => dispatch => {
	dispatch({ type: FETCH_QUOTE_START })

	if (data.SendCurrency === data.ReceiveCurrency) return null

	const requestInit = {
		method: 'POST',
		body: JSON.stringify(data)
	}
	return fetch(`${ROOT_URL}/quotes`, requestInit)
		.then(response => response.json())
		.then(payload => dispatch({ type: FETCH_QUOTE, payload }))
		.catch(error => {
			dispatch({
				type: FETCH_QUOTE_END,
				payload: error.message
			})
		})
}
