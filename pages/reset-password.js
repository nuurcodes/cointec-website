import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'

import Header from '../components/Header'
import ResetPasswordForm from '../components/ResetPasswordForm'
import { SubmissionError } from 'redux-form'

import {
	resetPasswordByToken,
	regainAccessByToken,
	showNotificationAlert,
	hideNotificationAlert
} from '../store/actions'

class ResetPassword extends Component {
	constructor() {
		super()
		this.state = {
			maskPassword: false,
			maskConfirmPassword: false
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.passwordUpdated = this.passwordUpdated.bind(this)
		this.toggleMask = this.toggleMask.bind(this)
		this.toggleConfirmMask = this.toggleConfirmMask.bind(this)
	}

	toggleMask() {
		this.setState({
			maskPassword: !this.state.maskPassword
		})
	}

	toggleConfirmMask() {
		this.setState({
			maskConfirmPassword: !this.state.maskConfirmPassword
		})
	}

	handleSubmit(values) {
		if (this.props.router.query.action === 'regainaccess') {
			return this.props
				.regainAccessByToken({ token: this.props.router.query.token, values })
				.then(res => {
					console.log(res)
					this.passwordUpdated()
				})
				.catch(error => {
					if (error.response.status === 400) {
						throw new SubmissionError({
							password: 'Your new password must be different',
							newPassword: 'Confirm new password'
						})
					} else {
						Router.push(
							`/token-expired/resetpassword`,
							`/token-expired?action=resetpassword`
						)
					}
				})
		} else {
			return this.props
				.resetPasswordByToken({ token: this.props.router.query.token, values })
				.then(res => {
					console.log(res)
					this.passwordUpdated()
				})
				.catch(error => {
					if (error.response.status === 400) {
						throw new SubmissionError({
							password: 'Your new password must be different',
							newPassword: 'Confirm new password'
						})
					} else {
						Router.push(
							`/token-expired/resetpassword`,
							`/token-expired?action=resetpassword`
						)
					}
				})
		}
	}

	passwordUpdated() {
		const notificationContent = <p>Your password has been updated</p>
		this.props.showNotificationAlert({
			content: notificationContent,
			type: 'success'
		})
		setTimeout(() => {
			this.props.hideNotificationAlert()
		}, 5000)
		Router.push(`/login`)
	}

	render() {
		const { loading } = this.props.accounts

		return (
			<div className="signin-page">
				<Head>
					<title>Reset password | Cointec</title>
				</Head>
				<Header background="gradient">
					<div className="sg-logo text-center position-relative">
						<Link href="/">
							<a>
								<img src="/static/images/logo-white.svg" alt="logo" />
							</a>
						</Link>
					</div>
				</Header>
				<section className="form-wrapper">
					<div className="form-heading-wrapper">
						<h5 className="form-heading">
							<Link href="/login">
								<a>
									<i className="far fa-arrow-left mr-3" />
								</a>
							</Link>
							Reset password
						</h5>
					</div>
					<hr />

					<ResetPasswordForm
						maskPassword={this.state.maskPassword}
						toggleMask={this.toggleMask}
						maskConfirmPassword={this.state.maskConfirmPassword}
						toggleConfirmMask={this.toggleConfirmMask}
						loading={loading}
						onSubmit={this.handleSubmit}
					/>
				</section>
			</div>
		)
	}
}

export default connect(
	({ accounts }) => ({ accounts }),
	{
		resetPasswordByToken,
		regainAccessByToken,
		showNotificationAlert,
		hideNotificationAlert
	}
)(withRouter(ResetPassword))
