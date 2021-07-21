import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import { connect } from 'react-redux'
import { updatePassword } from '../../store/actions'
import cn from 'classnames'

class UpdatePassword extends Component {
	constructor() {
		super()
		this.state = {}
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
		return this.props
			.updatePassword({
				ctUser: this.props.ctUser,
				password: values.password,
				newPassword: values.newPassword
			})
			.then(res => {
				console.log(res)
				this.props.onPasswordUpdated()
				this.onClose()
			})
			.catch(error => {
				if (error) {
					if (error.response.status === 401) {
						throw new SubmissionError({
							password: 'Incorrect current password'
						})
					} else if (error.response.status === 400) {
						throw new SubmissionError({
							newPassword: error.response.data.Message
						})
					}
				}
			})
		// this.props.onClose()
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
							<h5 className="modal-heading text-left">Update password</h5>
							<hr />
							<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
								<div className="row">
									<div className="col-12">
										<Field
											name="password"
											label="Current password"
											type="password"
											placeholder="••••••••"
											className="mt-4"
											validate={passwordRequired}
											component={this.renderField}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Field
											name="newPassword"
											label="New password"
											type="password"
											placeholder="••••••••"
											validate={[
												passwordRequired,
												passwordLength,
												passwordLetter,
												passwordNumber
											]}
											component={this.renderPasswordField}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Field
											name="confirmNewPassword"
											label="Confirm New password"
											type="password"
											placeholder="••••••••"
											validate={[
												passwordRequired,
												passwordLength,
												passwordLetter,
												passwordNumber
											]}
											component={this.renderPasswordField}
										/>
									</div>
								</div>
								<div className="row mt-4">
									{/* {this.props.accounts.error && (
										<div className="col-md-12 mb-2 text-danger">
											Incorrect current password
										</div>
									)} */}
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
											<span>Update password</span>
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

	renderPasswordField({
		placeholder,
		meta: { touched, valid, error, pristine },
		label,
		input,
		className,
		type
	}) {
		return (
			<div
				className={cn(
					'field-wrapper position-relative',
					className,
					touched && error ? 'invalid' : !pristine && valid ? 'valid' : null
				)}>
				<label className="field-label">
					{!touched ? label : valid ? label : error}
				</label>
				<input
					autoComplete="off"
					spellCheck={false}
					placeholder={placeholder}
					className="form-control password"
					type={type}
					{...input}
				/>

				<div className="typing-validator">
					<div>8 or more characters</div>
				</div>
			</div>
		)
	}
}

// Validators
const passwordRequired = value =>
	!value ? 'Please enter a valid password' : undefined
const passwordLength = value =>
	!value || value.length < 8
		? 'Password must consist of 8 or more characters'
		: undefined
const passwordLetter = value =>
	!/[a-zA-Z]/.test(value)
		? 'Password must contain at least 1 letter'
		: undefined
const passwordNumber = value =>
	!/[0-9]/.test(value) ? 'Password must contain at least 1 number' : undefined

export default connect(
	({ accounts }) => ({ accounts }),
	{ updatePassword }
)(
	reduxForm({
		form: 'UpdatePasswordForm',
		validate: values => {
			const errors = {}
			if (values.newPassword !== values.confirmNewPassword) {
				errors.confirmNewPassword = 'Confirm password does not match'
			}
			return errors
		}
	})(UpdatePassword)
)
