import axios from 'axios'

export const FETCH_POSTS = 'FETCH_POSTS'
export const FETCH_POSTS_START = 'FETCH_POSTS_START'
export const FETCH_POSTS_END = 'FETCH_POSTS_END'

export const fetchPosts = () => dispatch => {
	dispatch({ type: FETCH_POSTS_START })

	return axios
		.get('/api/blogs')
		.then(res => {
			const payload = res.data
			return dispatch({
				type: FETCH_POSTS,
				payload
			})
		})
		.catch(error => {
			dispatch({
				type: FETCH_POSTS_END,
				payload: error.message
			})
			throw error
		})
}
