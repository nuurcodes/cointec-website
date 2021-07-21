import React, { Component } from 'react'
import Link from 'next/link'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import {
	fetchAccounts,
	abandonOrder,
	refundPayment,
	getStatus,
	signOutSession
} from '../../store/actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class WrongPaymentForm extends Component {
	constructor() {
		super()
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		if (this.props.ctUser)
			this.props.fetchAccounts(this.props.ctUser).catch(err => {
				if (err.response.status === 401) {
					this.props.signOutSession()
				}
			})
	}

	handleSubmit() {
		this.props
			.abandonOrder({
				orderId: this.props.txnID,
				ctUser: this.props.ctUser,
				reason: 'WRONGAMOUNT'
			})
			.then(() => {
				const { AccountNumber, SortCode } = this.props.refundAccount
				this.props.refundPayment({
					orderId: this.props.txnID,
					ctUser: this.props.ctUser,
					dest: `${AccountNumber} ${SortCode}`
				})
				this.props.getStatus({
					orderId: this.props.txnID,
					ctUser: this.props.ctUser
				})
				this.props.onSubmit()
			})
	}

	render() {
		const { accounts } = this.props.bank
		return (
			<div>
				<div className="row">
					<div className="col-12 text-left">
						<Field
							name="refundTo"
							component="select"
							className="custom-select accounts-select"
							onChange={this.handleChange}>
							{accounts &&
								accounts.map(account => (
									<option value={account.id} key={account.id}>
										{account.BankName} - {account.SortCode}
									</option>
								))}
							<option value="addBank">Refund to another account</option>
						</Field>
					</div>
				</div>
				<div className="row mt-4">
					<div className="col-12">
						<button
							className="btn btn-success w-100"
							onClick={this.handleSubmit}>
							{!this.props.order.abandon && this.props.order.loading ? (
								<div>
									<i className="fas fa-spinner fa-spin" />
								</div>
							) : (
								<span>Submit refund request</span>
							)}
						</button>
					</div>
				</div>
				<p
					className="text-center mt-2 mb-0"
					style={{
						visibility: this.props.order.abandon ? 'visible' : 'hidden'
					}}>
					Account details submitted, thank you.
				</p>
				<p className="text-center mt-2">
					<Link href="/">
						<a>Return to dashboard</a>
					</Link>
				</p>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { accounts } = props.bank

		if (props.refundTo === 'addBank' && !props.addRefundAccount) {
			props.handleRefundAccount()
		}

		if (!props.refundAccount && props.refundTo !== 'addBank' && accounts) {
			const [refundAccount] = accounts
			if (refundAccount) {
				const refundTo = refundAccount.id
				props.change('refundTo', refundTo)
				props.change('refundAccount', refundAccount)
			}
		}
	}
}

const mapStateToProps = state => {
	const selector = formValueSelector('WrongPaymentForm')
	const refundTo = selector(state, 'refundTo')
	const refundAccount =
		state.bank.accounts &&
		state.bank.accounts.find(account => account.id == refundTo)
	return {
		order: state.order,
		bank: state.bank,
		refundTo,
		refundAccount
	}
}

export default reduxForm({ form: 'WrongPaymentForm' })(
	connect(
		mapStateToProps,
		{ fetchAccounts, abandonOrder, refundPayment, getStatus, signOutSession }
	)(WrongPaymentForm)
)

WrongPaymentForm.propTypes = {
	onSubmit: PropTypes.func
}
