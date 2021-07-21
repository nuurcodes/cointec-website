import { ROOT_URL } from '..'

export const FETCH_CONSTANTS = 'FETCH_CONSTANTS'
export const FETCH_CONSTANTS_START = 'FETCH_CONSTANTS_START'
export const FETCH_CONSTANTS_END = 'FETCH_CONSTANTS_END'

export const fetchConsts = () => async dispatch => {
	dispatch({ type: FETCH_CONSTANTS_START })

	try {
		const response = await fetch(`${ROOT_URL}/service/status`)
		if (!response.ok) throw new Error(response.statusText)

		const payload = await response.json()
		return dispatch({
			type: FETCH_CONSTANTS,
			payload
		})
	} catch (error) {
		return dispatch({
			type: FETCH_CONSTANTS_END,
			payload: error.message
		})
	}
}
