import React, { Component } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import {
	addAccount,
	validateSession,
	signOutSession
} from '../../store/actions'
import cn from 'classnames'

const errorMap = {
	400: 'Please check your account details.',
	406: 'Account is not Faster-Payments enabled.',
	409: 'You have already added this account.'
}

class AddRefundAccount extends Component {
	constructor() {
		super()
		this.state = {
			loading: false,
			error: {
				text: null,
				status: null
			}
		}
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentWillReceiveProps(props) {
		if (props.bank) {
			this.setState({ loading: props.bank.loading })

			if (props.bank.error) {
				const { status } = props.bank.error.response
				this.setState({ error: { text: errorMap[status], status } })
			} else this.setState({ error: { text: null, status: null } })

			if (props.bank.addFN && props.bank.addFN.Success) {
			}
		}
	}

	normalizeSortCode(value) {
		if (!value) return value

		const onlyNums = value.replace(/[^\d]/g, '')
		if (onlyNums.length <= 2) return onlyNums

		if (onlyNums.length <= 4)
			return `${onlyNums.slice(0, 2)}-${onlyNums.slice(2)}`

		return `${onlyNums.slice(0, 2)}-${onlyNums.slice(2, 4)}-${onlyNums.slice(
			4,
			6
		)}`
	}

	normalizeAccountNumber(value) {
		if (!value) return value
		const onlyNums = value.replace(/[^\d]/g, '')
		return onlyNums.slice(0, 8)
	}

	handleSubmit(values) {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.addAccount(ctUser, values).catch(err => {
				if (err.response.status === 401) {
					this.props.signOutSession()
				}
			})
		}
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-12">
						<label className="subscribe-email-label mt-0">Account number</label>
						<Field
							name="accountNo"
							normalize={this.normalizeAccountNumber}
							component={this.renderField}
							placeholder="XXXXXXXX"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<label className="subscribe-email-label mt-0">Sort code</label>
						<Field
							name="sortCode"
							normalize={this.normalizeSortCode}
							component={this.renderField}
							placeholder="XX-XX-XX"
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<p
							className={cn(
								'inline-headers info text-center',
								this.state.error.status ? 'text-danger' : null
							)}>
							{this.state.error.text || <br />}
						</p>
					</div>
				</div>
				<div className="row">
					<div className="col-12">{this.renderButton()}</div>
				</div>
				<p className="text-center mt-2">
					<Link to="/">Return to dashboard</Link>
				</p>
			</div>
		)
	}

	renderField(field) {
		const {
			placeholder,
			valid,
			meta: { touched, error }
		} = field
		const className = `form-group ${touched && error ? 'has-warning' : ''} ${
			valid ? 'has-success' : ''
		}  ${valid ? 'has-warning' : ''}`

		return (
			<div className={className}>
				<input
					placeholder={placeholder}
					className="form-control"
					{...field.input}
				/>

				<div className="text-help">{touched ? error : ''}</div>
			</div>
		)
	}

	renderButton() {
		return (
			<button
				onClick={this.props.handleSubmit(this.handleSubmit)}
				className="btn btn-block btn-success btn-lg text-white">
				Add Bank Account
			</button>
		)
	}
}

const validate = values => {
	const errors = {}
	if (!values.sortCode) {
		errors.sortCode = 'Enter Sort Code'
	}

	if (!values.accountNo) {
		errors.accountNo = 'Enter Account No'
	}

	return errors
}

export default reduxForm({
	form: 'AddRefundAccountForm',
	validate
})(
	connect(
		({ auth, bank }) => ({ auth, bank }),
		{ addAccount, validateSession, signOutSession }
	)(AddRefundAccount)
)

AddRefundAccount.propTypes = {
	onSubmit: PropTypes.func
}
