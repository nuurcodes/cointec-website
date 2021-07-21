const { createServer } = require('https')
const fs = require('fs')

const options = {
	key: fs.readFileSync('certs/localhost.key'),
	cert: fs.readFileSync('certs/localhost.crt'),
	requestCert: false,
	rejectUnauthorized: false
}

module.exports = function createSecureServer(server) {
	return createServer(options, server)
}
