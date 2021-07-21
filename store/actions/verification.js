import { ROOT_URL } from '..'
import axios from 'axios'
import { validateSession, signOutSession } from './auth'

export const FETCH_VERIFICATION_STATUS = 'FETCH_VERIFICATION_STATUS'
export const FETCH_VERIFICATION_STATUS_START = 'FETCH_VERIFICATION_STATUS_START'
export const FETCH_VERIFICATION_STATUS_END = 'FETCH_VERIFICATION_STATUS_END'

export const FETCH_VERIFICATION_TIER = 'FETCH_VERIFICATION_TIER'
export const FETCH_VERIFICATION_TIER_START = 'FETCH_VERIFICATION_TIER_START'
export const FETCH_VERIFICATION_TIER_END = 'FETCH_VERIFICATION_TIER_END'

export const FETCH_VERIFICATION_OVERVIEW = 'FETCH_VERIFICATION_OVERVIEW'
export const FETCH_VERIFICATION_OVERVIEW_START =
	'FETCH_VERIFICATION_OVERVIEW_START'
export const FETCH_VERIFICATION_OVERVIEW_END = 'FETCH_VERIFICATION_OVERVIEW_END'

export const GET_REHIVE_ID = 'GET_REHIVE_ID'
export const GET_REHIVE_ID_START = 'GET_REHIVE_ID_START'
export const GET_REHIVE_ID_END = 'GET_REHIVE_ID_END'

export const GET_REHIVE_TOKEN = 'GET_REHIVE_TOKEN'
export const GET_REHIVE_TOKEN_START = 'GET_REHIVE_TOKEN_START'
export const GET_REHIVE_TOKEN_END = 'GET_REHIVE_TOKEN_END'

export const DELETE_REHIVE_TOKEN = 'DELETE_REHIVE_TOKEN'
export const DELETE_REHIVE_TOKEN_START = 'DELETE_REHIVE_TOKEN_START'
export const DELETE_REHIVE_TOKEN_END = 'DELETE_REHIVE_TOKEN_END'

export const fetchVerificationStatus = ({ ctUser }) => dispatch => {
	dispatch({ type: FETCH_VERIFICATION_STATUS_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.get(`${ROOT_URL}/verification/${ctUser}/basic/`, { headers })
		.then(response => {
			dispatch({
				type: FETCH_VERIFICATION_STATUS,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: FETCH_VERIFICATION_STATUS_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}

export const fetchVerificationTier = ({ ctUser }) => dispatch => {
	dispatch({ type: FETCH_VERIFICATION_TIER_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.get(`${ROOT_URL}/verification/${ctUser}/tier`, { headers })
		.then(response => {
			dispatch({
				type: FETCH_VERIFICATION_TIER,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: FETCH_VERIFICATION_TIER_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}

export const fetchVerificationOverview = ({ ctUser }) => dispatch => {
	dispatch({ type: FETCH_VERIFICATION_OVERVIEW_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.get(`${ROOT_URL}/verification/${ctUser}/overview/`, { headers })
		.then(response => {
			dispatch({
				type: FETCH_VERIFICATION_OVERVIEW,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: FETCH_VERIFICATION_OVERVIEW_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}

export const getRehiveId = ({ ctUser }) => dispatch => {
	dispatch({ type: GET_REHIVE_ID_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.get(`${ROOT_URL}/verification/${ctUser}/rehive/user`, { headers })
		.then(response => {
			dispatch({
				type: GET_REHIVE_ID,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: GET_REHIVE_ID_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}

export const getRehiveToken = ({ ctUser }) => dispatch => {
	dispatch({ type: GET_REHIVE_TOKEN_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.get(`${ROOT_URL}/verification/${ctUser}/rehive/token`, { headers })
		.then(response => {
			dispatch({
				type: GET_REHIVE_TOKEN,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: GET_REHIVE_TOKEN_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}

export const deleteRehiveToken = ({ ctUser }) => dispatch => {
	dispatch({ type: DELETE_REHIVE_TOKEN_START })

	const session = dispatch(validateSession())
	const headers = {
		'Content-Type': 'application/json',
		...session
	}

	return axios
		.delete(`${ROOT_URL}/verification/${ctUser}/rehive/token`, { headers })
		.then(response => {
			dispatch({
				type: DELETE_REHIVE_TOKEN,
				payload: response.data
			})
			return response
		})
		.catch(error => {
			dispatch({
				type: DELETE_REHIVE_TOKEN_END,
				payload: error
			})
			if (error && error.response && error.response.status === 401) {
				dispatch(signOutSession())
			}
		})
}
