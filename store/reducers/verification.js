import {
	FETCH_VERIFICATION_STATUS,
	FETCH_VERIFICATION_STATUS_START,
	FETCH_VERIFICATION_STATUS_END,
	FETCH_VERIFICATION_TIER,
	FETCH_VERIFICATION_TIER_START,
	FETCH_VERIFICATION_TIER_END,
	FETCH_VERIFICATION_OVERVIEW,
	FETCH_VERIFICATION_OVERVIEW_START,
	FETCH_VERIFICATION_OVERVIEW_END,
	GET_REHIVE_ID,
	GET_REHIVE_ID_START,
	GET_REHIVE_ID_END,
	GET_REHIVE_TOKEN,
	GET_REHIVE_TOKEN_START,
	GET_REHIVE_TOKEN_END,
	DELETE_REHIVE_TOKEN,
	DELETE_REHIVE_TOKEN_START,
	DELETE_REHIVE_TOKEN_END,
	SIGN_OUT_SESSION
} from '../actions'

const INITIAL_STATE = {
	overview: null,
	status: null,
	currentTier: null,
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_VERIFICATION_STATUS:
			// const data = { ...payload, CloseAccountTriggered: true }
			return { ...state, status: payload, loading: false, error: null }

		case FETCH_VERIFICATION_TIER:
			// const data = { ...payload, Id: 2, TierName: 'Beta User' }
			return { ...state, currentTier: payload, loading: false, error: null }

		case GET_REHIVE_ID:
		case GET_REHIVE_TOKEN:
		case DELETE_REHIVE_TOKEN:
			return { ...state, ...payload, loading: false, error: null }

		case FETCH_VERIFICATION_OVERVIEW:
			// const IdItems = [...payload.IdItems]
			// IdItems[2].Status = 'Declined'
			// IdItems[2].Message = 'Reupload rejected documents'
			// const overview = { FrontendProgress: 'ATTENTIONIDENTITY', IdItems }
			return { ...state, overview: payload, loading: false, error: null }

		case FETCH_VERIFICATION_STATUS_START:
		case FETCH_VERIFICATION_TIER_START:
		case FETCH_VERIFICATION_OVERVIEW_START:
		case GET_REHIVE_ID_START:
		case GET_REHIVE_TOKEN_START:
		case DELETE_REHIVE_TOKEN_START:
			return { ...state, loading: true, error: null }

		case FETCH_VERIFICATION_STATUS_END:
		case FETCH_VERIFICATION_TIER_END:
		case FETCH_VERIFICATION_OVERVIEW_END:
		case GET_REHIVE_ID_END:
		case GET_REHIVE_TOKEN_END:
		case DELETE_REHIVE_TOKEN_END:
			return { ...state, loading: false, error: payload }

		case SIGN_OUT_SESSION:
			return INITIAL_STATE

		default:
			return state
	}
}
