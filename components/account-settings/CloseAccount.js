import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { closeAccount } from '../../store/actions'
import cn from 'classnames'

class CloseAccount extends Component {
	constructor() {
		super()
		this.state = {
			closed: false,
			error: null
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onClose() {
		this.setState(
			{
				closed: true
			},
			() => {
				setTimeout(() => {
					this.props.onClose()
				}, 300)
			}
		)
	}

	componentDidMount() {
		setTimeout(() => {
			addEventListener('click', this.onClickOutside)
		}, 500)
	}

	componentWillUnmount() {
		removeEventListener('click', this.onClickOutside)
	}

	onClickOutside = event => {
		const composedPath = el => {
			var path = []
			while (el) {
				path.push(el)
				if (el.tagName === 'HTML') {
					path.push(document)
					path.push(window)
					return path
				}
				el = el.parentElement
			}
		}
		let path = event.path || (event.composedPath && event.composedPath())
		if (!path) {
			path = composedPath(event.target)
		}
		const select =
			path &&
			path.find(
				node => node.className === 'modal-dialog modal-account-settings'
			)
		if (!select) {
			this.onClose()
		}
	}

	onSubmit(values) {
		this.props
			.closeAccount({
				emailAddress: this.props.emailAddress,
				password: values.password
			})
			.then(res => {
				this.props.onAccountClosed()
				this.onClose()
			})
			.catch(error => {
				console.log(error.response)
				if (error.response.status === 400) {
					this.setState({
						error: 'Cannot close account with pending transactions'
					})
				}
			})
	}

	render() {
		return (
			<div
				className="modal fade show"
				id="abandon-order-modal"
				role="dialog"
				data-backdrop="false"
				style={{ display: 'block' }}>
				<div
					className="modal-dialog modal-account-settings"
					role="document"
					style={{ transform: this.state.closed ? 'translateY(-120%)' : '' }}>
					<div className="modal-content">
						<div className="modal-body">
							<button type="button" className="close" onClick={this.onClose}>
								<i className="far fa-times fa-xs" />
							</button>
							<h5 className="modal-heading text-left">Close your account</h5>
							<hr />
							<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
								<div className="row">
									<div className="col-12">
										<p className="modal-message">
											We will send you a confirmation email with a link to close
											your account.
										</p>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Field
											name="password"
											label="Password"
											type="password"
											placeholder="••••••••"
											className="mt-0"
											validate={password}
											component={this.renderField}
										/>
									</div>
								</div>
								<div className="row mt-4">
									{this.state.error && (
										<div
											className="col-md-12 mb-3 text-danger"
											style={{ fontSize: 14, lineHeight: 'normal' }}>
											{this.state.error}
										</div>
									)}
									<div className="col-md-12">
										<button
											type="submit"
											className={cn('btn btn-block btn-lg', 'btn-danger')}>
											Permenantly close my account
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
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

// Validators
const password = value => (!value ? 'Please enter a valid password' : undefined)

export default connect(
	({ accounts }) => ({ accounts }),
	{ closeAccount }
)(
	reduxForm({
		form: 'CloseAccountForm'
	})(CloseAccount)
)
