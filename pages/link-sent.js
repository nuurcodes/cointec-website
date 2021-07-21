import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'

import Header from '../components/Header'

import { resetPassword } from '../store/actions'

class LinkSent extends Component {
	constructor() {
		super()
		this.resendEmail = this.resendEmail.bind(this)
	}

	resendEmail(type, email) {
		if (type === 'reset') this.props.resetPassword({ emailAddress: email })
	}

	render() {
		const { type, email } = this.props.router.query
		const { loading } = this.props.accounts
		const heading =
			type === 'activation'
				? 'We sent you an activation link. '
				: type === 'reset'
				? 'We sent you a link to reset your password. '
				: ''

		return (
			<div className="signin-page">
				<Head>
					<title>Check your inbox!</title>
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
							Check your inbox!
						</h5>
					</div>
					<hr />

					<div className="als-content">
						<h1 className="heading-line">{heading}</h1>
						<p className="heading-line">
							If you don't see the message in a few minutes, check your spam
							folder.
						</p>
						<button
							className="btn btn-primary"
							onClick={() => this.resendEmail(type, email)}
							disabled={loading}>
							{loading ? (
								<div>
									<i className="fas fa-spinner fa-spin" />
								</div>
							) : (
								<span>Resend Email</span>
							)}
						</button>
					</div>
				</section>
			</div>
		)
	}
}

export default connect(
	({ accounts }) => ({ accounts }),
	{ resetPassword }
)(withRouter(LinkSent))
