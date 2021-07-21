import { ROOT_URL } from '..'

export const FETCH_EXCHANGE_QUOTE = 'FETCH_EXCHANGE_QUOTE'
export const FETCH_EXCHANGE_QUOTE_START = 'FETCH_EXCHANGE_QUOTE_START'
export const FETCH_EXCHANGE_QUOTE_END = 'FETCH_EXCHANGE_QUOTE_END'

export const fetchQuote = data => dispatch => {
	dispatch({ type: FETCH_EXCHANGE_QUOTE_START })

	if (data.SendCurrency === data.ReceiveCurrency) return null

	const requestInit = {
		method: 'POST',
		body: JSON.stringify(data)
	}
	return fetch(`${ROOT_URL}/quotes`, requestInit)
}

export const updateQuote = payload => dispatch => {
	dispatch({ type: FETCH_EXCHANGE_QUOTE, payload })
}
