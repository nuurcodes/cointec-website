import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { validateSession, signOutSession } from '../store/actions'

import StickyFooter from '../components/StickyFooter'

const pageTitles = {
	locked: 'Account Locked',
	closed: 'Account Closed'
}

const headings = {
	locked: 'Account temporarily locked',
	closed: 'Your account has been closed'
}

const messages = {
	locked: `It looks like someone has made unauthorized access to your account. We will review this incident and unlock your account within 24 hours.`,
	closed: `Sorry to see you go. You’re account has now been closed and you will no longer be able to use our services. See you again soon.`
}

class NoAccess extends Component {
	constructor() {
		super()
		this.state = {}
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			this.props.signOutSession(null)
		}
	}

	render() {
		const { type } = this.props.router.query

		const title = pageTitles[type] || pageTitles['closed']
		const heading = headings[type] || headings['closed']
		const message = messages[type] || messages['closed']

		return (
			<div
				className="no-access-page full-height"
				style={{ backgroundColor: '#F7F9FA' }}>
				<Head>
					<title>{title} | Cointec</title>
				</Head>

				<div className="content-wrapper">
					<div className="sg-logo text-center position-relative">
						<Link href="/">
							<a>
								<img src="/static/images/footer-logo.svg" alt="logo" />
							</a>
						</Link>
					</div>
					<div className="alert-box">
						<div className="alert-header">
							<h6 className="heading">{heading}</h6>
						</div>
						<div className="alert-body">
							<p className="message-text">{message}</p>
						</div>
					</div>
				</div>

				<StickyFooter className="bg-white" fixed={true} />
			</div>
		)
	}
}

export default connect(
	null,
	{ validateSession, signOutSession }
)(withRouter(NoAccess))
