const express = require('express')
const next = require('next')
const createSecureServer = require('./createSecureServer')
const api = require('./api')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const secure = dev === true // set 'true' in development mode for ssl
const app = next({ dev })
const handle = app.getRequestHandler()
const httpsRedirect = (req, res, next) => {
	if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
		return res.redirect('https://' + req.headers.host + req.url)
	}
	next()
}

const Receive = require('../assets').Receive

app
	.prepare()
	.then(() => {
		const server = express()

		// server.use(httpsRedirect)

		server.use('/api', api)

		server.get('/buy-*', (req, res) => {
			const query = {
				buy: req.params[0]
			}
			const coin = Receive.find(
				coin => coin.SeoURL.toLowerCase() === `/buy-${req.params[0]}`
			)
			if (coin && coin.ShowGlobal === false) {
				app.render404(req, res)
			} else {
				app.render(req, res, '/', query)
			}
		})

		// server.get('/transaction-tracker/:txnID', (req, res) => {
		// 	app.render(req, res, '/transaction-tracker', { txnID: req.params.txnID })
		// })

		server.get('/learn/:pathname', (req, res) => {
			app.render(req, res, `/${req.params.pathname}`)
		})

		server.get('/account-settings/:pathname', (req, res) => {
			app.render(req, res, `/${req.params.pathname}`)
		})

		server.get('/forgot-password/:token', (req, res) => {
			app.render(req, res, `/forgot-password`, { token: req.params.token })
		})

		server.get('/validate', (req, res) => {
			app.render(req, res, `/on-load`, {
				action: req.query.action,
				token: req.query.token,
				method: 'validate'
			})
		})

		// server.get('/report-fraud', (req, res) => {
		// 	app.render(req, res, `/on-load`, {
		// 		action: req.query.action,
		// 		token: req.query.token,
		// 		method: 'report-fraud'
		// 	})
		// })

		server.get('/token-expired/:action', (req, res) => {
			app.render(req, res, `/token-expired`, {
				action: req.params.action
			})
		})

		server.get('/request-sent/:action', (req, res) => {
			app.render(req, res, `/alert-message`, {
				action: req.params.action
			})
		})

		// server.get('/account-frozen', (req, res) => {
		// 	app.render(req, res, `/no-access`, { type: 'locked' })
		// })

		// server.get('/account-closed', (req, res) => {
		// 	app.render(req, res, `/no-access`, { type: 'closed' })
		// })

		server.get('/aml-kyc-policy', (req, res) => {
			app.render(req, res, `/security`)
		})

		server.get('/blogs', (req, res) => {
			app.render(req, res, `/blog`)
		})

		server.get('/unsubscribe', (req, res) => {
			app.render(req, res, `/unsubscribe`, { token: req.query.token })
		})

		server.get('*', handle)

		const appServer = secure ? createSecureServer(server) : server
		appServer.listen(port, err => {
			if (err) throw err
			const prefix = secure ? 'https' : 'http'
			console.log(`> Ready on ${prefix}://localhost:${port}`)
		})
	})
	.catch(ex => {
		console.error(ex.stack)
		process.exit(1)
	})
