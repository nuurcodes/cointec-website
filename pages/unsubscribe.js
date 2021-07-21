import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { triggerUnsubscribe, unsubscribeEmails } from '../store/actions'
import cn from 'classnames'

import Header from '../components/Header'
import StickyFooter from '../components/StickyFooter'

class Unsubscribe extends Component {
	constructor(props) {
		super(props)
		this.state = {
			header: 'Unsubscribe',
			text: 'Enter your email below to unsubscribe.',
			completed: false
		}
		this.onSubmit = this.onSubmit.bind(this)
		this.onSent = this.onSent.bind(this)
		this.onFailed = this.onFailed.bind(this)
	}

	componentDidMount() {
		const { token } = this.props.router.query
		this.props.triggerUnsubscribe({ token }).then(res => {
			this.setState({
				unsubscribeToken: res.data
			})
		})
	}

	onSubmit(values) {
		console.log(values)

		this.props
			.unsubscribeEmails({
				emailAddress: values.email,
				token: this.state.unsubscribeToken
			})
			.then(() => this.onSent(values.email))
			.catch(error => this.onFailed(error))
	}

	onSent(email) {
		this.setState({
			header: 'You have unsubscribed',
			text: 'You can always resubscribe from your account dashboard.',
			completed: true
		})
	}

	onFailed(error) {
		if (error && error.response.data.Message === 'Already Unsubscribed') {
			this.setState({
				header: 'Already Unsubscribed',
				text: 'You have already unsubscribed.',
				completed: true
			})
		} else {
			this.setState({
				header: 'Check e-mail',
				text: 'No account was found for that e-mail',
				completed: false
			})
		}
	}

	render() {
		return (
			<div
				className="no-access-page full-height"
				style={{ backgroundColor: '#F7F9FA' }}>
				<Head>
					<title>Unsubscribe | Cointec</title>
				</Head>

				<Header>
					<Nav />
				</Header>

				<div className="content-wrapper">
					<div className="alert-box">
						<div className="alert-header">
							<h6 className="heading text-left">{this.state.header}</h6>
						</div>
						<div className="alert-body">
							<p className="message-text">{this.state.text}</p>
							{!this.state.completed && (
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
									<div className="row mt-4">
										<div className="col-md-12">
											<button
												type="submit"
												className={cn('btn btn-block btn-lg', 'btn-primary')}
												disabled={this.props.accounts.loading}>
												{this.props.accounts.loading && (
													<div
														style={{
															display: 'inline-block',
															marginRight: 12
														}}>
														<i className="fas fa-spinner fa-spin" />
													</div>
												)}
												<span>Unsubscribe</span>
											</button>
										</div>
									</div>
								</form>
							)}
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

export default connect(
	({ accounts }) => ({ accounts }),
	{
		triggerUnsubscribe,
		unsubscribeEmails
	}
)(
	reduxForm({
		form: 'UnsubscribeForm'
	})(withRouter(Unsubscribe))
)
