import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'

import Header from '../components/Header'
import SignInForm from '../components/SignInForm'
import NotificationAlert from '../components/dashboard/NotificationAlert'
import StickyFooter from '../components/StickyFooter'

import {
	signIn,
	showNotificationAlert,
	hideNotificationAlert,
	validateSession
} from '../store/actions'

class Login extends Component {
	constructor() {
		super()
		this.state = {
			maskPassword: false,
			timeout: null
		}
		this.authComplete = this.authComplete.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.toggleMask = this.toggleMask.bind(this)
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			Router.push('/dashboard')
		}
	}

	handleSubmit(values) {
		return this.props
			.signIn(values)
			.then(res => {
				this.authComplete()
			})
			.catch(error => {
				/*if (error.response.status === 403) {
					if (this.state.timeout) clearTimeout(this.state.timeout)
					const timeout = setTimeout(() => {
						this.props.hideNotificationAlert()
					}, 5000)
					const content = (
						<p>
							{error.response.data.Message}
							<b style={{ fontWeight: 600 }}>Contact us for more information</b>
						</p>
					)
					this.props.showNotificationAlert({ content, type: 'danger' })
					this.setState({ timeout })
				} else {
					throw new SubmissionError({
						email: "Incorrect username or password.",
						password: 'Password'
					})
				}*/
				const msg = error.response.data.Message;
				throw new SubmissionError({
					email: msg,
					password: 'Password'
				})
			})
	}

	authComplete() {
		const { query } = Router.router
		if (query && query.redirectPath) Router.push(query.redirectPath)
		else Router.push('/dashboard')
	}

	toggleMask() {
		this.setState({
			maskPassword: !this.state.maskPassword
		})
	}

	render() {
		const { loading, ctUser } = this.props.auth

		return !ctUser ? (
			<div className="signin-page">
				<Head>
					<title>Login | Cointec</title>
				</Head>

				<NotificationAlert
					type={this.props.globals.notificationType}
					visible={this.props.globals.notificationAlert}
					onHide={() => this.props.hideNotificationAlert()}>
					{this.props.globals.notificationContent}
				</NotificationAlert>

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
						<h5 className="form-heading">Log in</h5>
					</div>
					<hr />

					<SignInForm
						loading={loading}
						maskPassword={this.state.maskPassword}
						toggleMask={this.toggleMask}
						onSubmit={this.handleSubmit}
					/>
				</section>
				<p className="have-account">
					Don’t have an account?{' '}
					<Link href="/signup">
						<a>Sign up</a>
					</Link>
				</p>

				<StickyFooter className="d-none d-lg-block" />
			</div>
		) : null
	}
}

export default connect(
	({ auth, globals }) => ({ auth, globals }),
	{ signIn, showNotificationAlert, hideNotificationAlert, validateSession }
)(Login)
