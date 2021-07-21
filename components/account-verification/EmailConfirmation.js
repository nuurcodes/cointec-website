import React, { Component } from 'react'
import Link from 'next/link'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {
	fetchVerificationOverview,
	requestConfirmEmail
} from '../../store/actions'
import _ from 'lodash'

import LoadingCircle from '../LoadingCircle'

class EmailConfirmation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			timeout: null
		}
		this.onResendEmail = this.onResendEmail.bind(this)
	}

	componentDidMount() {
		this.initInterval()
	}

	componentWillUnmount() {
		if (this.state.timeout) clearTimeout(this.state.timeout)
	}

	initInterval() {
		if (this.state.timeout) clearTimeout(this.state.timeout)
		const timeout = setTimeout(() => {
			this.props.fetchVerificationOverview({ ctUser: this.props.ctUser })
		}, 5000)
		this.setState({ timeout })
	}

	onResendEmail() {
		this.props.requestConfirmEmail({
			ctUser: this.props.ctUser,
			emailAddress: this.props.emailAddress
		})
		// .then(() => {
		// 	this.props.onResendEmail()
		// })
		this.props.onResendEmail()
	}

	render() {
		return (
			<div>
				<p className="confirmation-message">
					We’ve sent a confirmation email to{' '}
					<span className="email-address">
						{this.props.emailAddress || 'youremail@gmail.com'}
					</span>
					. If you can’t find the email please check your junk folder.
				</p>
				<a className="confirmation-link" onClick={this.onResendEmail}>
					{/* {this.props.accounts.loading && (
						<i className="fas fa-spinner fa-spin" style={{ marginRight: 12 }} />
					)} */}
					Resend confirmation email
				</a>
				<div className="loading-circle">
					<LoadingCircle />
					{/* <LoadingCircle infinite={false} progress={this.state.progress} /> */}
				</div>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { overview } = props.verification
		if (overview) {
			const { FrontendProgress } = overview
			if (FrontendProgress === 'CONFIRMEMAIL') {
				this.initInterval()
			}
		}
	}
}

export default reduxForm({
	form: 'VerificationForm'
})(
	connect(
		({ accounts, verification }) => ({ accounts, verification }),
		{ fetchVerificationOverview, requestConfirmEmail }
	)(EmailConfirmation)
)
