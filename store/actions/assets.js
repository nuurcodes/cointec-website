import { ROOT_URL } from '..'

export const FETCH_ASSETS_LIST = 'FETCH_ASSETS_LIST'
export const FETCH_ASSETS_LIST_START = 'FETCH_ASSETS_LIST_START'
export const FETCH_ASSETS_LIST_END = 'FETCH_ASSETS_LIST_END'

export const FETCH_TICKERS = 'FETCH_TICKERS'
export const FETCH_TICKERS_START = 'FETCH_TICKERS_START'
export const FETCH_TICKERS_END = 'FETCH_TICKERS_END'

export const FETCH_ASSETS_STATUS = 'FETCH_ASSETS_STATUS'
export const FETCH_ASSETS_STATUS_START = 'FETCH_ASSETS_STATUS_START'
export const FETCH_ASSETS_STATUS_END = 'FETCH_ASSETS_STATUS_END'

export const FETCH_WALLETS = 'FETCH_WALLETS'
export const FETCH_WALLETS_START = 'FETCH_WALLETS_START'
export const FETCH_WALLETS_END = 'FETCH_WALLETS_END'

export const SET_CURRENT_ASSET = 'SET_CURRENT_ASSET'

export const fetchAssetsList = () => async dispatch => {
	dispatch({ type: FETCH_ASSETS_LIST_START })
	try {
		const response = await fetch(`${ROOT_URL}/assets/exchangeables`)
		if (!response.ok) throw new Error(response.statusText)

		const payload = await response.json()
		return dispatch({
			type: FETCH_ASSETS_LIST,
			payload
		})
	} catch (error) {
		dispatch({
			type: FETCH_ASSETS_LIST_END,
			payload: error.message
		})
		throw error
	}
}

export const fetchTickers = () => async dispatch => {
	dispatch({ type: FETCH_TICKERS_START })
	try {
		const response = await fetch(`${ROOT_URL}/quotes/tickers`)
		if (!response.ok) throw new Error(response.statusText)

		const payload = await response.json()
		return dispatch({
			type: FETCH_TICKERS,
			payload
		})
	} catch (error) {
		dispatch({
			type: FETCH_TICKERS_END,
			payload: error.message
		})
		throw error
	}
}

export const fetchAssetsStatus = () => async dispatch => {
	dispatch({ type: FETCH_ASSETS_STATUS_START })

	try {
		const response = await fetch(`${ROOT_URL}/assets/status`)
		if (!response.ok) throw new Error(response.statusText)

		const payload = await response.json()
		return dispatch({
			type: FETCH_ASSETS_STATUS,
			payload
		})
	} catch (error) {
		return dispatch({
			type: FETCH_ASSETS_STATUS_END,
			payload: error.message
		})
	}
}

export const fetchWallets = () => async dispatch => {
	return dispatch({ type: FETCH_WALLETS })
}

export const setCurrentAsset = asset => async dispatch => {
	return dispatch({ type: SET_CURRENT_ASSET, payload: asset })
}
