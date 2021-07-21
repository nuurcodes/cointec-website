import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {
	requestData,
	exportData,
	requestConfirmEmail,
	changeEmail,
	resetPassword,
	closeAccount
} from '../store/actions'
import cn from 'classnames'

import Header from '../components/Header'
import NotificationAlert from '../components/dashboard/NotificationAlert'
import StickyFooter from '../components/StickyFooter'

class TokenExpired extends Component {
	constructor(props) {
		super(props)
		this.state = {
			notificationAlert: false,
			notificationContent: null
		}
		this.onSubmit = this.onSubmit.bind(this)
	}

	componentDidMount() {}

	onSubmit(values) {
		console.log(values)
		const action = this.props.router.query.action
			.toLowerCase()
			.replace(/[^a-zA-Z]/g, '')

		if (action === 'requestdata') {
			this.props
				.requestData({
					emailAddress: values.email,
					password: '' //values.password
				})
				.then(() => this.onSent(values.email))
		} else if (action === 'exportdata') {
			this.props
				.exportData({
					emailAddress: values.email,
					password: '' //values.password
				})
				.then(() => this.onSent(values.email))
		} else if (action === 'confirmemail') {
			this.props
				.requestConfirmEmail({
					emailAddress: values.email
				})
				.then(() => this.onSent(values.email))
		} else if (action === 'changeemail') {
			this.props
				.changeEmail({
					emailAddress: values.email,
					password: '' //values.password
				})
				.then(() => this.onSent(values.email))
		} else if (action === 'resetpassword' || action === 'regainaccess') {
			this.props
				.resetPassword({
					emailAddress: values.email
				})
				.then(() => this.onSent(values.email))
		} else if (action === 'closeaccount') {
			this.props
				.closeAccount({
					emailAddress: values.email,
					password: '' //values.password
				})
				.then(() => this.onSent(values.email))
		}
	}

	onSent(email) {
		const notificationContent = (
			<p>
				Confirmation email sent to <b>{email}</b>
			</p>
		)
		this.setState({
			notificationAlert: true,
			notificationContent
		})
		setTimeout(() => {
			this.setState({
				notificationAlert: false
			})
		}, 5000)
	}

	render() {
		const { action } = this.props.router.query

		return (
			<div
				className="no-access-page full-height"
				style={{ backgroundColor: '#F7F9FA' }}>
				<Head>
					<title>Token Expired | Cointec</title>
				</Head>

				<NotificationAlert
					type="success"
					visible={this.state.notificationAlert}
					onHide={() => this.setState({ notificationAlert: false })}>
					{this.state.notificationContent}
				</NotificationAlert>

				<Header>
					<Nav />
				</Header>

				<div className="content-wrapper">
					<div className="alert-box">
						<div className="alert-header">
							{action && (
								<h6 className="heading text-left">{action} token expired</h6>
							)}
							{!action && <h6 className="heading text-left">Token expired</h6>}
						</div>
						<div className="alert-body">
							<p className="message-text">
								You can re-submit the request by entering your email below.
							</p>
							<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
								<div className="row">
									<div className="col-12">
										<Field
											name="email"
											label="Email"
											type="email"
											placeholder="email@cointec.co.uk"
											autoComplete="email"
											className="mt-4"
											validate={emailAddress}
											component={this.renderField}
										/>
									</div>
								</div>
								{/* {(action === 'requestdata' ||
									action === 'exportdata' ||
									action === 'closeaccount') && (
									<div className="row">
										<div className="col-12">
											<Field
												name="password"
												label="Password"
												type="password"
												placeholder="••••••••"
												className="mt-4"
												validate={password}
												component={this.renderField}
											/>
										</div>
									</div>
								)} */}
								<div className="row mt-4">
									<div className="col-md-12">
										<button
											type="submit"
											className={cn('btn btn-block btn-lg', 'btn-primary')}
											disabled={this.props.accounts.loading}>
											{this.props.accounts.loading && (
												<div
													style={{ display: 'inline-block', marginRight: 12 }}>
													<i className="fas fa-spinner fa-spin" />
												</div>
											)}
											<span>Resubmit request</span>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<StickyFooter className="bg-white" fixed={true} />
			</div>
		)
	}

	renderField({
		placeholder,
		meta: { touched, valid, error },
		label,
		input,
		className,
		type
	}) {
		return (
			<div
				className={cn(
					'field-wrapper',
					className,
					touched && !valid ? 'invalid' : null
				)}>
				<label className="field-label">
					{!touched ? label : valid ? label : error}
				</label>
				<input
					autoComplete="off"
					spellCheck={false}
					placeholder={placeholder}
					className="form-control"
					type={type}
					{...input}
				/>
			</div>
		)
	}
}

const Nav = () => (
	<div className="container">
		<nav className="navbar navbar-custom navbar-expand-lg navbar-exchange">
			<div className="col-3 d-none d-md-flex">
				<Link href="/">
					<a className="navbar-brand">
						<img
							src="/static/images/footer-logo.svg"
							className="img-fluid mx-auto d-block"
							alt="Logo"
						/>
					</a>
				</Link>
			</div>
		</nav>
	</div>
)

// Validators
const emailAddress = value => {
	const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return !regex.test(value) ? 'Please enter a valid email' : undefined
}
const password = value => (!value ? 'Please enter a valid password' : undefined)

export default connect(
	({ accounts }) => ({ accounts }),
	{
		requestData,
		exportData,
		requestConfirmEmail,
		changeEmail,
		resetPassword,
		closeAccount
	}
)(
	reduxForm({
		form: 'TokenExpiredForm'
	})(withRouter(TokenExpired))
)
