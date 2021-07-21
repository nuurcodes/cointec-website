import React, { Component } from 'react'
import Router from 'next/router'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import cn from 'classnames'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MinutesFormat from '../MinutesFormat'
import {
	fetchAccounts,
	fetchConsts,
	getStatus,
	createOrder,
	clearOrder,
	showTransactionAlert,
	signOutSession
} from '../../store/actions'

class BankTransfer extends Component {
	constructor() {
		super()
		this.state = {
			timerId: null,
			timer: 0,
			refreshTime: 10,
			sourceAccount: null,
			expired: false,
			expires: 0
		}

		this.tick = this.tick.bind(this)
		this.initInterval = this.initInterval.bind(this)
		this.fetchCalls = this.fetchCalls.bind(this)
		this.startPayment = this.startPayment.bind(this)
		this.restart = this.restart.bind(this)
		// this.handleChange = this.handleChange.bind(this)
		this.renderButton = this.renderButton.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	initInterval() {
		clearInterval(this.state.timerId)
		const timerId = setInterval(this.tick, 1000)
		this.setState({ timerId })
	}

	tick() {
		const { pendingStatus } = this.props.order
		let secondsLeft = 0
		const secondsNow = Math.round(new Date().getTime() / 1000)
		if (pendingStatus && pendingStatus.Status) {
			secondsLeft = pendingStatus.Status.EXPIRES - secondsNow
		} else {
			secondsLeft = this.state.expires - secondsNow
		}
		if (secondsLeft > 0) {
			this.setState({ secondsLeft })
		} else {
			clearInterval(this.state.timerId)
			this.setState({ expired: true })
		}
	}

	componentDidMount() {
		// setTimeout(() => {
		this.startPayment()
		// }, 500)
	}

	componentWillUnmount() {
		clearInterval(this.state.timerId)
	}

	fetchCalls() {
		this.props.fetchConsts()
	}

	startPayment() {
		const createdAt = Math.round(new Date().getTime() / 1000.0)
		if (!this.props.txnID) {
			this.props
				.createOrder({
					destAmount: this.props.receiveAmount,
					sourceAmount: this.props.sendAmount,
					destCurrency: this.props.receiveCurrency,
					sourceCurrency: this.props.sendCurrency,
					exchangeRate: this.props.rate,
					dest: this.props.wallet,
					ctUser: this.props.ctUser,
					createdAt
				})
				.then(({ data }) => {
					if (data) {
						this.setState({
							expires: createdAt + data.PaymentWindow * 60
						})
					}
				})
				.catch(error => {
					if (error.response.status === 409) {
						const txnID = error.response.data.Message.split(
							/[[\]]{1,2}/
						)[1].replace('CT', '')
						this.props.showTransactionAlert()
						Router.push(
							`/transaction-tracker?txnID=${txnID}`,
							`/transaction-tracker/${txnID}`
						)
					}
					if (error.response.status === 403) {
						Router.push(`/request-sent/orderrejected`)
					}
				})
		}
		this.initInterval()
		this.fetchCalls()
		this.setState({ expired: false })
	}

	restart() {
		this.props.onRestart()
	}

	handleChange(account) {
		this.setState({ sourceAccount: account })
	}

	renderButton() {
		if (this.props.sendCurrency === 'GBP')
			return (
				<button
					type="submit"
					className={cn(
						'btn-block btn-lg btn-exchange no-border',
						'btn-primary'
					)}
					disabled={!this.state.sourceAccount}>
					I have made payment
				</button>
			)
		else
			return (
				<button
					type="submit"
					className={cn(
						'btn-block btn-lg btn-exchange no-border',
						'btn-primary'
					)}
					disabled={!this.props.depositAddress}>
					I have made payment
				</button>
			)
	}

	onSubmit() {
		const {
			sendFromAccount,
			order,
			ctUser,
			sendCurrency,
			depositAddress,
			txnID
		} = this.props
		if (sendCurrency === 'GBP') {
			this.props
				.clearOrder({
					orderId: txnID ? txnID : order.create.CtTransactionId,
					accountId: this.state.sourceAccount.id,
					ctUser
				})
				.then(() => {
					this.props.onConfirm({
						txnID: txnID ? txnID : order.create.CtTransactionId
					})
				})
		} else {
			this.props.clearOrder({
				orderId: txnID ? txnID : order.create.CtTransactionId,
				accountId: null,
				ctUser
			})
		}
	}

	renderScreen() {
		const { sendAmount, accounts, order } = this.props
		const { owner, sortCode, accountNumber } =
			order.pendingStatus && order.pendingStatus.BrokerAccount
				? order.pendingStatus.BrokerAccount
				: (order.create && order.create.BrokerAccount) || {}

		return (
			<div>
				<div className="main-calc-wrapper make-payment-wrapper">
					<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
						<div className="row">
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Beneficiary</label>
								<p className="field-value">{owner || <br />}</p>
							</div>
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Payment type</label>
								<p className="field-value">Bank Transfer</p>
							</div>
						</div>
						<div className="row">
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Account number</label>
								<p className="field-value">{accountNumber || 'XXXXXXXX'}</p>
							</div>
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Sort code</label>
								<p className="field-value">{sortCode || 'XX-XX-XX'}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Reference</label>
								<p className="field-value m-0">
									{order.pendingStatus && order.pendingStatus.OrderReference
										? order.pendingStatus.OrderReference
										: (order.create && order.create.OrderReference) ||
										  'XXXXXXXX'}
								</p>
							</div>
							<div className="col-6 text-left text-nowrap">
								<label className="field-label">Amount</label>
								<p className="field-value m-0">{sendAmount.toFixed(2)} GBP</p>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<hr />
							</div>
						</div>
						<div className="row">
							<div className="col-12 text-left">
								<label className="field-label">Send from</label>
								{/* <Field
									name="sendFrom"
									component="select"
									className="custom-select accounts-select"
									onChange={this.handleChange}>
									{accounts.list &&
										accounts.list.map(account => (
											<option value={account.id} key={account.id}>
												{account.BankName} - {account.SortCode}
											</option>
										))}
									<option value="addBank">Add a new bank</option>
								</Field> */}
								<div className="dropdown accounts-dropdown">
									<a
										className="dropdown-toggle"
										id="dropdownMenuButton"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false">
										<span className="account-source">
											{this.state.sourceAccount
												? `${this.state.sourceAccount.BankName} (${
														this.state.sourceAccount.SortCode
												  })`
												: 'Send From'}
										</span>
										{/* <span>Primary account</span> */}
										<i className="far fa-angle-down" />
									</a>
									<div
										className="dropdown-menu"
										aria-labelledby="dropdownMenuButton">
										<div className="accounts-list">
											{accounts.list &&
												accounts.list.map(account => (
													<a
														className="dropdown-item d-flex justify-content-between"
														key={account.id}
														onClick={this.handleChange.bind(this, account)}>
														<div className="bank-account-name">
															{account.BankName}
														</div>
														<div className="bank-account-sortcode">
															{account.SortCode}
														</div>
													</a>
												))}
										</div>
										<div
											className="add-bank-account"
											onClick={this.props.onAddAccount}>
											Add bank account
											<img
												className="add-account-icon"
												src="/static/images/add-plus.svg"
												alt="add account"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col-md-12">{this.renderButton()}</div>
						</div>
					</form>
				</div>
				{!this.state.expired &&
				((this.props.order.create && this.props.accounts.list) ||
					this.props.txnID) ? (
					<p className="text-left mt-3">
						Transaction will expire in{' '}
						<MinutesFormat seconds={this.state.secondsLeft} />
					</p>
				) : (
					<p className="text-left" style={{ marginTop: 11 }}>
						Transaction expired -{' '}
						<a className="restart-link" onClick={this.restart}>
							Click to restart
						</a>
					</p>
				)}
			</div>
		)
	}

	render() {
		// if (!this.state.expired) {
		if (this.props.sendCurrency === 'GBP') {
			if (this.props.order.create && this.props.accounts.list) {
				return this.renderScreen()
			} else if (this.props.order.loading || this.props.accounts.loading) {
				return (
					<div className="main-calc-wrapper d-flex">
						<div className="h-100 m-auto" style={{ color: '#045CC7' }}>
							<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
						</div>
					</div>
				)
			} else {
				return this.renderScreen()
				// return (
				// 	<div className="main-calc-wrapper">
				// 		<div className="row">
				// 			<div className="col-12">
				// 				<h2 className="mt-5">Oops something went wrong</h2>
				// 				<img
				// 					className="mt-4"
				// 					src="/static/images/error.svg"
				// 					alt="error"
				// 				/>
				// 				<p className="mt-4">
				// 					We are working on getting the error fixed. Please try to
				// 					refresh the page or restart the process in a few minutes.
				// 				</p>
				// 			</div>
				// 		</div>
				// 	</div>
				// )
			}
		} else {
			// if (this.props.order.create) {
			// 	return (
			// 		<div className="main-calc-wrapper mt-5">
			// 			<form onSubmit={this.onSubmit}>
			// 				<div className="row">
			// 					<div className="col-12 text-left">
			// 						<label className="field-label m-0">Amount</label>
			// 						<p className="field-value">
			// 							{this.props.sendAmount.toFixed(8) || <br />}
			// 						</p>
			// 					</div>
			// 				</div>
			// 				<div className="row">
			// 					<div className="col-12">
			// 						<hr className="mt-0" />
			// 					</div>
			// 				</div>
			// 				<div className="row">
			// 					<div className="col-12 text-left">
			// 						<Field
			// 							name="depositAddress"
			// 							label="BTC deposit address"
			// 							component={this.renderWalletField}
			// 							placeholder="Deposit Address"
			// 						/>
			// 					</div>
			// 				</div>
			// 				<div className="row mt-4">
			// 					<div className="col-md-12">{this.renderButton()}</div>
			// 				</div>
			// 			</form>
			// 		</div>
			// 	)
			// } else if (this.props.order.loading) {
			// 	return (
			// 		<div className="main-calc-wrapper d-flex">
			// 			<div className="h-100 m-auto" style={{ color: '#045CC7' }}>
			// 				<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
			// 			</div>
			// 		</div>
			// 	)
			// } else {
			// 	return (
			// 		<div className="main-calc-wrapper">
			// 			<div className="row">
			// 				<div className="col-12">
			// 					<h2 className="mt-5">Oops something went wrong</h2>
			// 					<img
			// 						className="mt-4"
			// 						src="/static/images/error.svg"
			// 						alt="error"
			// 					/>
			// 					<p className="mt-4">
			// 						We are working on getting the error fixed. Please try to
			// 						refresh the page or restart the process in a few minutes.
			// 					</p>
			// 				</div>
			// 			</div>
			// 		</div>
			// 	)
			// }
		}
		// } else {
		// return (
		// 	<div className="main-calc-wrapper">
		// 		<div className="row">
		// 			<div className="col-12">
		// 				<h2 className="mt-5">Payement timeout</h2>
		// 				<img
		// 					className="mt-4"
		// 					src="/static/images/error.svg"
		// 					alt="error"
		// 				/>
		// 				<p className="mt-4">
		// 					Oops, looks like you ran out of time. Click the link below to
		// 					restart the transaction.
		// 				</p>
		// 				<button className="btn-back" onClick={() => this.restart()}>
		// 					<span>Restart</span>
		// 				</button>
		// 			</div>
		// 		</div>
		// 	</div>
		// )
		// }
	}

	renderWalletField(field) {
		const {
			placeholder,
			meta: { touched, valid, error, asyncValidating },
			label
		} = field

		return (
			<div
				className={cn(
					'calc-input-wrapper',
					'text-left',
					touched && !valid ? 'invalid' : null
				)}>
				<label className="field-label m-0">
					{!touched ? label : valid ? label : error}
				</label>
				<div className="calc-field mt-2">
					<div className="col-12">
						<input
							id="input-wallet-addr"
							autoComplete="off"
							spellCheck={false}
							placeholder={placeholder}
							className="form-control no-border p-0"
							{...field.input}
						/>
						{asyncValidating && (
							<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
						)}
					</div>
				</div>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { accounts, order, constants, ctUser, sendCurrency, txnID } = props

		if (sendCurrency === 'GBP') {
			if (!txnID && (!order.create || !accounts.list)) {
				clearInterval(this.state.timerId)
			} else {
				if (constants) {
					const refreshTime = !txnID
						? constants.PaymentWindow * 60
						: order.pendingStatus.Status.EXPIRES -
						  Math.round(new Date().getTime() / 1000)
					if (this.state.refreshTime >= this.state.timer) {
						this.initInterval()
						this.setState({ refreshTime, timer: 0 })
					}
				}
			}

			if (!accounts.list && !accounts.loading)
				this.props.fetchAccounts(ctUser).catch(err => {
					if (err.response.status === 401) {
						this.props.signOutSession()
					}
				})

			// if (accounts.list && !accounts.loading && !accounts.list.length)
			// 	$('#add-bank-account-modal').modal('toggle')

			// if (!this.props.sendFromAccount) {
			// 	const sendFromAccount =
			// 		accounts.list && accounts.list.length && accounts.list[0]
			// 	if (sendFromAccount) {
			// 		const sendFrom = sendFromAccount.id
			// 		props.change('sendFrom', sendFrom)
			// 		props.change('sendFromAccount', sendFromAccount)
			// 	}
			// }
			if (!this.state.sourceAccount) {
				const sourceAccount =
					accounts.list && accounts.list.length && accounts.list[0]
				if (sourceAccount) {
					this.setState({ sourceAccount })
				}
			}
		} else {
			if (!order.create) {
				clearInterval(this.state.timerId)
			} else {
				const refreshTime = order.create.PaymentWindow * 60
				if (this.state.refreshTime >= this.state.timer) {
					this.initInterval()
					this.setState({ refreshTime, timer: 0 })
				}
				this.props.change(
					'depositAddress',
					order.create.BrokerAccount.DepositAddress
				)
			}
		}
	}
}

const mapStateToProps = state => {
	const selector = formValueSelector('BankTransfer')
	const depositAddress = selector(state, 'depositAddress')
	return {
		order: state.order,
		constants: state.constants,
		accounts: state.accounts,
		depositAddress
	}
}

export default reduxForm({ form: 'ExchangeForm' })(
	connect(
		mapStateToProps,
		{
			fetchAccounts,
			fetchConsts,
			getStatus,
			createOrder,
			clearOrder,
			showTransactionAlert,
			signOutSession
		}
	)(BankTransfer)
)

BankTransfer.propTypes = {
	sendAmount: PropTypes.number,
	receiveAmount: PropTypes.number,
	sendCurrency: PropTypes.string,
	receiveCurrency: PropTypes.string,
	rate: PropTypes.number,
	wallet: PropTypes.string,
	ctUser: PropTypes.number,
	onConfirm: PropTypes.func,
	onRestart: PropTypes.func,
	onAddAccount: PropTypes.func
}
