import {
	FETCH_POSTS,
	FETCH_POSTS_START,
	FETCH_POSTS_END
} from '../actions/blogs'

const INITIAL_STATE = {
	posts: null,
	loading: false,
	error: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case FETCH_POSTS:
			return {
				...state,
				posts: payload.posts,
				loading: false,
				error: null
			}

		case FETCH_POSTS_START:
			return { ...state, loading: true, error: null }

		case FETCH_POSTS_END:
			return { ...state, loading: false, error: payload }

		default:
			return state
	}
}
