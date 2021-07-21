import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import cn from 'classnames'

class AddBankAccount extends Component {
	constructor() {
		super()
		this.state = {
			closed: false
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
		this.onDelete = this.onDelete.bind(this)
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

	onSubmit(event) {
		event.preventDefault()
		this.onClose()
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
							<h5 className="modal-heading text-left">Add bank account</h5>
							<hr />
							<form onSubmit={this.onSubmit}>
								<div className="row">
									<div className="col-12">
										<Field
											name="accountName"
											label="Account name"
											className="mt-4"
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
										/>
									</div>
									<div className="col-6">
										<Field
											name="sortCode"
											label="Sort code"
											placeholder="11-22-33"
											normalize={this.normalizeSortCode}
											component={this.renderField}
										/>
									</div>
								</div>
								<div className="row mt-4">
									<div className="col-md-12">
										<button
											type="submit"
											className={cn('btn btn-block btn-lg', 'btn-primary')}>
											Add bank account
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
}

export default reduxForm({
	form: 'AddBankAccountForm'
})(AddBankAccount)
