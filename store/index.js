import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise'
import reducers from './reducers'

export const ROOT_URL = 'https://api.staging.cointec.co.uk'
export function initializeStore(initialState = {}) {
	return createStore(reducers, initialState, applyMiddleware(thunk, promise))
}
