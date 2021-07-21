import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'

import Header from '../components/Header'
import ForgotPasswordForm from '../components/ForgotPasswordForm'

import { resetPassword } from '../store/actions'

class ForgotPassword extends Component {
	constructor() {
		super()
		this.handleSubmit = this.handleSubmit.bind(this)
		this.resetEmailSent = this.resetEmailSent.bind(this)
	}

	handleSubmit(values) {
		return this.props
			.resetPassword(values)
			.then(() => this.resetEmailSent(values.emailAddress))
			.catch(error => {
				if (error.response.status === 400) {
					throw new SubmissionError({
						emailAddress: 'Account with this email does not exist.'
					})
				}
			})
	}

	resetEmailSent(email) {
		Router.push(`/link-sent?type=reset&email=${email}`, '/link-sent')
	}

	render() {
		const { loading } = this.props.accounts
		const { token } = this.props.router.query

		const description = !token
			? 'Please enter your email address to begin resetting your password.'
			: 'To receive another password reset link, please enter your email below.'

		return (
			<div className="signin-page">
				<Head>
					<title>Forgot Password | Cointec</title>
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
							Forgot password
						</h5>
					</div>
					<hr />

					<ForgotPasswordForm
						loading={loading}
						description={description}
						onSubmit={this.handleSubmit}
					/>
				</section>
			</div>
		)
	}
}

export default connect(
	({ accounts }) => ({ accounts }),
	{ resetPassword }
)(withRouter(ForgotPassword))
