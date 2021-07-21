const express = require('express')
const router = express.Router()
const axios = require('axios')

router.get('/blogs', (request, response) => {
	// https://blog.sendwyre.com
	axios.get('https://medium.com/s/cointalk?format=json').then(res => {
		const { Post, User, Collection, Sequence } = JSON.parse(
			res.data.split('</x>')[1]
		).payload.references
		const posts = Object.keys(Post).map(id => {
			const user = User[Post[id].creatorId]
			const collection = Collection && Collection[Post[id].homeCollectionId]
			const sequence = Sequence && Sequence[Post[id].sequenceId]
			const domain = collection
				? collection.domain
				: `medium.com/s/${sequence.slug}`
			return {
				title: Post[id].title,
				snippet: Post[id].content.subtitle,
				link: `https://${domain}/${Post[id].uniqueSlug}`,
				image: `https://cdn-images-1.medium.com/fit/c/340/217/${
					Post[id].virtuals.previewImage.imageId
				}`,
				user: {
					name: user.name,
					image: `https://cdn-images-1.medium.com/fit/c/52/52/${user.imageId}`,
					link: collection
						? `https://${domain}/@${user.username}`
						: `https://medium.com/@${user.username}`
				},
				publishedAt: Post[id].firstPublishedAt
			}
		})
		response.status(200).send({
			posts
		})
	})
})

router.get(
	'/validate-address/:wallet/:receiveCurrency',
	(request, response) => {
		const wallet = request.params.wallet
		const receiveCurrency =
			request.params.receiveCurrency !== 'PAY'
				? request.params.receiveCurrency
				: 'ETH'
		axios
			.get(`https://shapeshift.io/validateAddress/${wallet}/${receiveCurrency}`)
			.then(res => {
				const data = res.data
				response.status(200).send({
					...data
				})
			})
			.catch(error => {
				response.status(error.response.status).send({
					...error.response
				})
			})
	}
)

router.get('/lookup/:postcode', (request, response) => {
	const postcode = request.params.postcode
	const api_key = 'ak_je7po7xacHD4NsrQBBNpk65vBZORp'
	axios
		.get(
			`https://api.ideal-postcodes.co.uk/v1/postcodes/${postcode}?api_key=${api_key}`
		)
		.then(res => {
			const data = res.data
			response.status(200).send({
				...data
			})
		})
		.catch(error => {
			response.status(error.response.status).send({
				...error.response.data
			})
		})
})

module.exports = router
