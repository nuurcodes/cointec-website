import {
	SIGN_UP,
	SIGN_UP_START,
	SIGN_UP_END,
	SIGN_IN,
	SIGN_IN_START,
	SIGN_IN_END,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_START,
	FORGOT_PASSWORD_END,
	FETCH_LIMIT,
	FETCH_LIMIT_START,
	FETCH_LIMIT_END,
	VALIDATE_SESSION,
	SIGN_OUT_SESSION
} from '../actions'

const INITIAL_STATE = {
	loading: false,
	error: null,
	signup: null,
	signin: null,
	forgotpassword: null,
	resetpassword: null,
	ctUser: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case SIGN_UP:
			return {
				...state,
				signup: payload,
				loading: false,
				error: null
			}

		case SIGN_IN:
			return {
				...state,
				signin: payload,
				ctUser: payload.CtUserId,
				loading: false,
				error: null
			}

		case FORGOT_PASSWORD:
			return {
				...state,
				forgotpassword: payload,
				loading: false,
				error: null
			}

		case VALIDATE_SESSION:
			return {
				...state,
				ctUser: payload.ctUser,
				loading: false,
				error: null
			}

		case SIGN_OUT_SESSION:
			return {
				...state,
				ctUser: null,
				loading: false,
				error: null
			}

		case FETCH_LIMIT:
			return { ...state, limit: payload }

		case SIGN_IN_START:
		case SIGN_UP_START:
		case FORGOT_PASSWORD_START:
		case FETCH_LIMIT_START:
			return { ...state, loading: true, error: null }

		case SIGN_UP_END:
		case SIGN_IN_END:
		case FORGOT_PASSWORD_END:
		case FETCH_LIMIT_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
