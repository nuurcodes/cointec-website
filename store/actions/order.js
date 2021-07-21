import axios from 'axios'
import { ROOT_URL } from '..'
import { validateSession, signOutSession } from './auth'

export const CREATE_ORDER = 'CREATE_ORDER'
export const CREATE_ORDER_START = 'CREATE_ORDER_START'
export const CREATE_ORDER_END = 'CREATE_ORDER_END'

export const CLEAR_ORDER = 'CLEAR_ORDER'
export const CLEAR_ORDER_START = 'CLEAR_ORDER_START'
export const CLEAR_ORDER_END = 'CLEAR_ORDER_END'

export const ABANDON_ORDER = 'ABANDON_ORDER'
export const ABANDON_ORDER_START = 'ABANDON_ORDER_START'
export const ABANDON_ORDER_END = 'ABANDON_ORDER_END'

export const REFUND_PAYMENT = 'REFUND_PAYMENT'
export const REFUND_PAYMENT_START = 'REFUND_PAYMENT_START'
export const REFUND_PAYMENT_END = 'REFUND_PAYMENT_END'

export const STATUS_ORDER = 'STATUS_ORDER'
export const STATUS_ORDER_START = 'STATUS_ORDER_START'
export const STATUS_ORDER_END = 'STATUS_ORDER_END'

export const GET_PENDING_ORDER = 'GET_PENDING_ORDER'
export const GET_PENDING_ORDER_START = 'GET_PENDING_ORDER_START'
export const GET_PENDING_ORDER_END = 'GET_PENDING_ORDER_END'

export const FETCH_ORDERS = 'FETCH_ORDERS'
export const FETCH_ORDERS_START = 'FETCH_ORDERS_START'
export const FETCH_ORDERS_END = 'FETCH_ORDERS_END'

export function createOrder({
	destAmount,
	sourceAmount,
	sourceCurrency,
	destCurrency,
	exchangeRate,
	dest,
	ctUser,
	createdAt
}) {
	let info = {
		ctUser,
		orderReference: 58852233,
		status: 'PAYMENT',
		paymentAccountId: '',
		createdAt,
		source: 'Cointec',
		dest,
		sourceCurrency,
		sourceAmount,
		destCurrency,
		destAmount,
		exchangeRate
	}
	// console.log('createOrder', info)
	return dispatch => {
		const session = dispatch(validateSession())
		const headers = { ...session }
		dispatch({
			type: CREATE_ORDER_START,
			payload: null
		})
		return axios
			.post(`${ROOT_URL}/orders/create/buy`, info, { headers })
			.then(response => {
				dispatch({
					type: CREATE_ORDER,
					payload: response.data
				})
				return response
			})
			.catch(error => {
				dispatch({
					type: CREATE_ORDER_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
				throw error
			})
	}
}

export function clearOrder({ orderId, accountId, ctUser }) {
	// console.log('clearing order: ', orderId, accountId)
	return dispatch => {
		dispatch({
			type: CLEAR_ORDER_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		return axios
			.get(`${ROOT_URL}/orders/clearing/${orderId}/${accountId}`, { headers })
			.then(response => {
				dispatch({
					type: CLEAR_ORDER,
					payload: response.data
				})
				return response
			})
			.catch(error => {
				dispatch({
					type: CLEAR_ORDER_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
				throw error
			})
	}
}

export function abandonOrder({ orderId, ctUser, reason }) {
	console.log('abandon order: ', orderId)
	return dispatch => {
		dispatch({
			type: ABANDON_ORDER_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		const data = {
			AbandonReason: reason
		}
		return axios
			.post(`${ROOT_URL}/orders/abandon/${orderId}`, data, { headers })
			.then(response => {
				dispatch({
					type: ABANDON_ORDER,
					payload: response.data
				})
			})
			.catch(error => {
				dispatch({
					type: ABANDON_ORDER_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
				throw error
			})
	}
}

export function refundPayment({ orderId, ctUser, dest }) {
	return dispatch => {
		dispatch({
			type: REFUND_PAYMENT_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		const data = {
			RefundDestination: dest
		}
		return axios
			.post(`${ROOT_URL}/orders/refund/${orderId}`, data, { headers })
			.then(response => {
				dispatch({
					type: REFUND_PAYMENT,
					payload: response.data
				})
			})
			.catch(error => {
				dispatch({
					type: REFUND_PAYMENT_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
			})
	}
}

export function fetchOrders() {
	return dispatch => {
		dispatch({
			type: FETCH_ORDERS_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		return axios
			.get(`${ROOT_URL}/orders`, { headers })
			.then(response => {
				dispatch({
					type: FETCH_ORDERS,
					payload: response.data
				})
			})
			.catch(error => {
				dispatch({
					type: FETCH_ORDERS_END,
					payload: error
				})
				throw error
			})
	}
}

export function getStatus({ orderId }) {
	console.log('status order: ', orderId)
	return dispatch => {
		dispatch({
			type: STATUS_ORDER_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		return axios
			.get(`${ROOT_URL}/orders/status/${orderId}`, { headers })
			.then(response => {
				dispatch({
					type: STATUS_ORDER,
					payload: response.data
				})
				return response
			})
			.catch(error => {
				dispatch({
					type: STATUS_ORDER_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
				throw error
			})
	}
}

export function getPendingOrder() {
	return dispatch => {
		dispatch({
			type: GET_PENDING_ORDER_START,
			payload: null
		})

		const session = dispatch(validateSession())
		const headers = { ...session }
		const ctUser = session['CT-ACCOUNT-ID']
		return axios
			.get(`${ROOT_URL}/orders/pending/${ctUser}`, { headers })
			.then(response => {
				dispatch({
					type: GET_PENDING_ORDER,
					payload: response.data
				})
				return response
			})
			.catch(error => {
				dispatch({
					type: GET_PENDING_ORDER_END,
					payload: error
				})
				if (error && error.response && error.response.status === 401) {
					dispatch(signOutSession())
				}
				throw error
			})
	}
}
