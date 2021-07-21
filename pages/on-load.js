import React, { Component } from 'react'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
	validateToken,
	reportFraud,
	showNotificationAlert,
	hideNotificationAlert
} from '../store/actions'

const actions = {
	requestdata: 'request-data',
	exportdata: 'export-data',
	changeemail: 'change-email',
	resetpassword: 'reset-password',
	regainaccess: 'regainaccess',
	closeaccount: 'close-account',
	confirmemail: 'confirm-email'
}

class OnLoad extends Component {
	constructor(props) {
		super(props)
		this.state = {}

		this.tokenExpired = this.tokenExpired.bind(this)
		this.tokenValidated = this.tokenValidated.bind(this)
	}

	componentDidMount() {
		const { action, token, method } = this.props.router.query
		if (method === 'validate') {
			this.props
				.validateToken({
					action: actions[action.toLowerCase().replace(/-/g, '')],
					token
				})
				.then(res => {
					this.tokenValidated(action, method, res.data)
				})
				.catch(error => {
					this.tokenExpired(action)
				})
		} else if (method === 'report-fraud') {
			this.props
				.reportFraud({ action, token })
				.then(res => {
					this.tokenValidated(action, method)
				})
				.catch(error => this.tokenExpired(action))
		}
	}

	tokenExpired(action) {
		if (action) {
			Router.push(`/token-expired/${action}`, `/token-expired?action=${action}`)
		} else {
			Router.push(`/token-expired`)
		}
	}

	tokenValidated(action, method, data) {
		if (method === 'validate') {
			if (action === 'confirmemail' || action === 'confirm-email') {
				const notificationContent = <p>You have confirmed your email address</p>
				this.props.showNotificationAlert({
					content: notificationContent,
					type: 'success'
				})
				setTimeout(() => {
					this.props.hideNotificationAlert()
				}, 5000)

				Router.push('/account-settings')
			} else if (action === 'changeemail' || action === 'change-email') {
				Router.push('/login')
			} else if (
				action === 'resetpassword' ||
				action === 'reset-password' ||
				action === 'regainaccess'
			) {
				const token = data && data.Token
				Router.push(`/reset-password?token=${token}&action=${action}`)
			} else {
				Router.push(`/request-sent/${action}`)
			}
		} else {
			Router.push('/no-access', '/account-frozen')
		}
	}

	render() {
		return (
			<div
				className="d-flex justify-content-center"
				style={{ marginTop: '45vh' }}>
				<i className="fas fa-spinner-third fa-lg fa-spin mr-3 text-primary" />
				<style jsx global>{`
					html body {
						background: none;
						box-shadow: none;
					}
				`}</style>
			</div>
		)
	}
}

export default connect(
	({ accounts }) => ({ accounts }),
	{ validateToken, reportFraud, showNotificationAlert, hideNotificationAlert }
)(withRouter(OnLoad))
