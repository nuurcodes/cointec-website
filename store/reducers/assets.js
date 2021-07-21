import {
	FETCH_ASSETS_LIST,
	FETCH_ASSETS_LIST_START,
	FETCH_ASSETS_LIST_END,
	FETCH_ASSETS_STATUS,
	FETCH_ASSETS_STATUS_START,
	FETCH_ASSETS_STATUS_END,
	FETCH_WALLETS,
	FETCH_WALLETS_START,
	FETCH_WALLETS_END,
	FETCH_TICKERS,
	FETCH_TICKERS_START,
	FETCH_TICKERS_END,
	SET_CURRENT_ASSET
} from '../actions/assets'

import { Send, Receive } from '../../assets'

const INITIAL_STATE = {
	list: {
		Send,
		Receive
	},
	tickers: null,
	wallets: null,
	status: null,
	currentAsset: null,
	loading: false,
	error: null
}

const Wallets = ['MEW', 'MetaMask', 'Exodus', 'Jaxx']

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_ASSETS_LIST:
			const Send = payload.Send.reverse()
			const Receive = payload.Receive
			const list = { Send, Receive }
			return { ...state, list, wallets, loading: false, error: null }

		case FETCH_ASSETS_STATUS:
			return { ...state, status: payload }

		case FETCH_WALLETS:
			const wallets = {}
			Wallets.forEach(wallet => {
				wallets[wallet] = state.list.Receive.filter(coin =>
					coin.Wallets.includes(wallet)
				).map(coin => coin.Name)
			})
			return { ...state, wallets }

		case FETCH_TICKERS:
			return { ...state, tickers: payload }

		case SET_CURRENT_ASSET:
			return { ...state, currentAsset: payload, loading: false }

		case FETCH_ASSETS_LIST_START:
		case FETCH_ASSETS_STATUS_START:
		case FETCH_WALLETS_START:
		case FETCH_TICKERS_START:
			return { ...state, loading: true, error: null }

		case FETCH_ASSETS_LIST_END:
		case FETCH_ASSETS_STATUS_END:
		case FETCH_WALLETS_END:
		case FETCH_TICKERS_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
