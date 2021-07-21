import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {
	addAccount,
	updateAccount,
	deleteAccount,
	fetchAccounts,
	clearAccountErrors,
	validateSession,
	signOutSession
} from '../../store/actions'
import cn from 'classnames'

const errorMap = {
	default: 'Bank must have Faster Payments enabled',
	400: 'Please check your account details.',
	406: 'Account is not Faster-Payments enabled.',
	409: 'You have already added this account.'
}

class AddBankAccount extends Component {
	constructor() {
		super()
		this.state = {
			closed: false,
			error: { text: null, status: null }
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
		this.onDelete = this.onDelete.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onClose() {
		this.props.clearAccountErrors()
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
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.setState({
				ctUser
			})
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}

		setTimeout(() => {
			addEventListener('click', this.onClickOutside)
		}, 500)
		if (this.props.editAccount) {
			this.props.change('accountName', this.props.editAccount.AccountReference)
			this.props.change('sortCode', this.props.editAccount.SortCode)
			this.props.change('accountNumber', this.props.editAccount.AccountNumber)
		}
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
		if (this.props.editAccount) {
			this.props
				.updateAccount(this.state.ctUser, values, this.props.editAccount.id)
				.then(() => {
					this.props.fetchAccounts(this.state.ctUser)
					this.onClose()
				})
				.catch(err => {
					if (err.response.status === 401) {
						this.props.signOutSession()
					}
				})
		} else {
			this.props
				.addAccount(this.state.ctUser, values)
				.then(() => {
					this.props.fetchAccounts(this.state.ctUser)
					this.onClose()
				})
				.catch(err => {
					if (err.response.status === 401) {
						this.props.signOutSession()
					}
				})
		}
	}

	onDelete() {
		this.props
			.deleteAccount(this.state.ctUser, this.props.editAccount.id)
			.then(() => {
				this.props.fetchAccounts(this.state.ctUser)
				this.onClose()
			})
			.catch(err => {
				if (err.response.status === 401) {
					this.props.signOutSession()
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
							<h5 className="modal-heading text-left">
								{this.props.editAccount
									? 'Edit bank account'
									: 'Add bank account'}
							</h5>
							<hr />
							<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
								<div className="row">
									<div className="col-12">
										<Field
											name="accountName"
											label="Account name"
											className={`mt-4 ${this.props.editAccount ? 'edit' : ''}`}
											placeholder="Primary account"
											component={this.renderField}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-6">
										<Field
											name="accountNumber"
											label="Account number"
											placeholder="33333333"
											normalize={this.normalizeAccountNumber}
											component={this.renderField}
											disabled={this.props.editAccount}
										/>
									</div>
									<div className="col-6">
										<Field
											name="sortCode"
											label="Sort code"
											placeholder="11-22-33"
											normalize={this.normalizeSortCode}
											component={this.renderField}
											disabled={this.props.editAccount}
										/>
									</div>
								</div>
								<div className="row mt-4">
									{this.state.error.text && (
										<div className="col-md-12 mb-2 text-danger">
											{this.state.error.text}
										</div>
									)}
									<div className="col-md-12">
										<button
											type="submit"
											className={cn('btn btn-block btn-lg', 'btn-primary')}
											disabled={this.props.accounts.loading}>
											{this.props.accounts.loading &&
												this.props.accounts.action === 'add' && (
													<div
														style={{
															display: 'inline-block',
															marginRight: 12
														}}>
														<i className="fas fa-spinner fa-spin" />
													</div>
												)}
											<span>
												{!this.props.editAccount
													? 'Add bank account'
													: 'Save changes'}
											</span>
										</button>
									</div>
								</div>
								{this.props.editAccount && (
									<div className="row mt-3">
										<div className="col-md-12">
											<button
												className={cn(
													'btn btn-block btn-lg',
													'btn-outline-danger'
												)}
												type="button"
												onClick={this.onDelete}
												disabled={this.props.accounts.loading}>
												{this.props.accounts.loading &&
													this.props.accounts.action === 'delete' && (
														<div
															style={{
																display: 'inline-block',
																marginRight: 12
															}}>
															<i className="fas fa-spinner fa-spin" />
														</div>
													)}
												<span>Delete bank account</span>
											</button>
										</div>
									</div>
								)}
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}

	normalizeAccountNumber(value) {
		if (!value) {
			return value
		}
		const onlyNums = value.replace(/[^\d]/g, '')

		return onlyNums.slice(0, 8)
	}

	normalizeSortCode(value) {
		if (!value) {
			return value
		}

		const onlyNums = value.replace(/[^\d]/g, '')
		if (onlyNums.length <= 2) {
			return onlyNums
		}
		if (onlyNums.length <= 4) {
			return `${onlyNums.slice(0, 2)}-${onlyNums.slice(2)}`
		}
		return `${onlyNums.slice(0, 2)}-${onlyNums.slice(2, 4)}-${onlyNums.slice(
			4,
			6
		)}`
	}

	renderField({
		placeholder,
		meta: { touched, valid, error },
		label,
		input,
		className,
		type,
		disabled
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
					disabled={disabled}
					{...input}
				/>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		console.log(props.accounts.error)
		if (props.accounts.error) {
			const { status } = props.accounts.error
			this.setState({
				error: {
					text: errorMap[status] ? errorMap[status] : errorMap.default,
					status
				}
			})
		} // else this.setState({ error: { text: errorMap.default, status: null } })
	}
}

const validate = (values, props) => {
	const errors = {}
	// validate inputs from 'values'
	if (!values.accountName) {
		errors.accountName = 'Enter Account Name'
	}

	if (!values.sortCode) {
		errors.sortCode = 'Enter Sort Code'
	}

	if (!values.accountNumber) {
		errors.accountNumber = 'Enter Account Number'
	}

	return errors
}

export default connect(
	({ accounts }) => ({ accounts }),
	{
		addAccount,
		updateAccount,
		deleteAccount,
		fetchAccounts,
		clearAccountErrors,
		validateSession,
		signOutSession
	}
)(
	reduxForm({
		form: 'AddBankAccountForm',
		validate
	})(AddBankAccount)
)
