const withSass = require('@zeit/next-sass')

module.exports = withSass({
	webpack: config => {
		const originalEntry = config.entry
		config.entry = async () => {
			const entries = await originalEntry()

			if (
				entries['main.js'] &&
				!entries['main.js'].includes('./libs/polyfills.js')
			) {
				entries['main.js'].unshift('./libs/polyfills.js')
			}

			return entries
		}
		// Fixes npm packages that depend on `fs` module
		config.node = {
			fs: 'empty'
		}

		return config
	}
})
