import React, { Component } from 'react'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import {
	fetchUserDetails,
	saveUserDetails,
	lookupPostcode
} from '../../store/actions'
import cn from 'classnames'
import _ from 'lodash'

class BasicDetails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			manualAddress: false,
			postcodeMenu: false,
			errorMessage: null
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.toggleManual = this.toggleManual.bind(this)
		this.lookupPostalcode = this.lookupPostalcode.bind(this)
		this.onAddressChange = this.onAddressChange.bind(this)
	}

	componentWillMount() {
		this.props.fetchUserDetails(this.props.ctUser).then(() => {
			const { accounts } = this.props
			if (accounts && accounts.userDetails) {
				this.props.change('firstName', accounts.userDetails.FirstName)
				this.props.change('lastName', accounts.userDetails.LastName)
				this.props.change('birthDate', accounts.userDetails.DateOfBirth)
				this.props.change('postCode', accounts.userDetails.Postcode)
				this.props.change('address1', accounts.userDetails.AddressLine1)
				this.props.change('address2', accounts.userDetails.AddressLine2)
				this.props.change('town', accounts.userDetails.Town)
			}
		})
	}

	componentDidMount() {
		addEventListener('click', this.onClickOutside)
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
			path && path.find(node => node.className === 'lookup-dropdown-menu')
		if (!select) {
			this.setState({
				postcodeMenu: false
			})
		}
	}

	onSubmit(values) {
		this.props
			.saveUserDetails(this.props.ctUser, this.props.emailAddress, values)
			.then(res => {
				if (res && res.data && res.data.Success) this.props.onConfirm()
			})
			.catch(err => {
				if (err && err.response.data) {
					this.setState({
						errorMessage: err.response.data.Message
					})
					setTimeout(() => {
						this.setState({
							errorMessage: null
						})
					}, 3000)
				}
			})
	}

	toggleManual() {
		this.setState({
			manualAddress: true
		})
	}

	lookupPostalcode() {
		if (!this.state.postcodeMenu) {
			if (this.props.postCode)
				this.props.lookupPostcode(this.props.postCode).then(r => {
					this.setState({
						postcodeMenu: true
					})
				})
		} else {
			this.setState({
				postcodeMenu: false
			})
		}
	}

	onAddressChange(address) {
		this.props.change('address1', address.line_1)
		this.props.change(
			'address2',
			address.line_2 + (address.line_3 ? ', ' : '') + address.line_3
		)
		this.props.change('town', address.postal_county)
		this.toggleManual()
	}

	render() {
		return (
			<div className="card-wrapper text-left">
				<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
					<div className="row">
						<div className="col-12">
							<h5 className="heading">Your profile</h5>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-md-6">
							<Field
								name="firstName"
								label="First name"
								component={this.renderField}
							/>
						</div>
						<div className="col-12 col-md-6">
							<Field
								name="lastName"
								label="Last name"
								component={this.renderField}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-12 col-md-6">
							<Field
								name="birthDate"
								label="Date of bith"
								// type="date"
								component={this.renderField}
								placeholder="DD/MM/YYYY"
								normalize={this.normalizeBirthDate}
							/>
						</div>
					</div>
					<div className="row d-none d-md-flex">
						<div className="col-12">
							<hr />
						</div>
					</div>
					<div className="row mt-2 mt-md-0">
						<div className="col-12">
							<h5 className="heading">Your address</h5>
						</div>
					</div>
					{!this.state.manualAddress
						? [
								<div className="row" key={0}>
									<div className="col-12 col-md-6">
										<a
											className="manually-link d-block d-md-none"
											onClick={this.toggleManual}>
											Enter manually
										</a>
										<Field
											name="postCode"
											label="Post code"
											component={this.renderField}
											className="m-0"
											placeholder="Enter post code"
										/>
									</div>
									<div className="col-12 col-md-6">
										<a className="btn-field" onClick={this.lookupPostalcode}>
											Lookup postal code
										</a>
										{this.state.postcodeMenu && (
											<div className="lookup-dropdown-menu dropdown-menu show">
												{this.props.postcodes.result ? (
													this.props.postcodes.result.map((address, index) => (
														<div
															className="dropdown-item"
															key={index}
															onClick={() => this.onAddressChange(address)}>
															{`${address.line_1}${address.line_2 ? ', ' : ''}${
																address.line_2
															}${address.line_3 ? ', ' : ''}${
																address.line_3
															}, ${address.postal_county}, ${address.postcode}`}
														</div>
													))
												) : (
													<div className="dropdown-item no-highlight">
														No result
													</div>
												)}
											</div>
										)}
									</div>
								</div>,
								<div className="row d-none d-md-flex" key={1}>
									<div className="col-12">
										<a className="form-link" onClick={this.toggleManual}>
											Enter address manually
										</a>
									</div>
								</div>
						  ]
						: [
								<div className="row" key={0}>
									<div className="col-12 col-md-6">
										<Field
											name="address1"
											label="Address Line 1"
											component={this.renderField}
										/>
									</div>
									<div className="col-12 col-md-6">
										<Field
											name="address2"
											label="Address Line 2"
											component={this.renderField}
										/>
									</div>
								</div>,
								<div className="row" key={1}>
									<div className="col-12 col-md-6">
										<Field
											name="town"
											label="Town/City"
											component={this.renderField}
											className="m-md-0"
										/>
									</div>
									<div className="col-12 col-md-6">
										<Field
											name="postCode"
											label="Post Code"
											component={this.renderField}
											className="m-0"
										/>
									</div>
								</div>
						  ]}
					{this.state.errorMessage && (
						<div className="row">
							<div className="col-12">
								<p className="error-message">{this.state.errorMessage}</p>
							</div>
						</div>
					)}
					<div className="row mt-4">
						<div className="col-md-12">
							<button
								type="submit"
								className={cn(
									'btn btn-block btn-lg btn-exchange',
									'btn-success'
								)}>
								Proceed to next step
							</button>
						</div>
					</div>
				</form>
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

	normalizeBirthDate(value) {
		if (!value) {
			return value
		}
		const onlyNums = value.replace(/[^\d]/g, '')

		if (onlyNums.length <= 2) {
			return onlyNums
		}
		if (onlyNums.length <= 4) {
			return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}`
		}
		return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(
			4,
			8
		)}`
	}

	componentWillReceiveProps(props) {}
}

const mapStateToProps = state => {
	const selector = formValueSelector('VerificationForm')
	let firstName = selector(state, 'firstName')
	let lastName = selector(state, 'lastName')
	let birthDate = selector(state, 'birthDate')
	let address1 = selector(state, 'address1')
	let address2 = selector(state, 'address2')
	let town = selector(state, 'town')
	let postCode = selector(state, 'postCode')
	return {
		accounts: state.accounts,
		postcodes: state.postcodes,
		firstName,
		lastName,
		birthDate,
		address1,
		address2,
		town,
		postCode
	}
}

export default reduxForm({
	form: 'VerificationForm'
})(
	connect(
		mapStateToProps,
		{ fetchUserDetails, saveUserDetails, lookupPostcode }
	)(BasicDetails)
)
