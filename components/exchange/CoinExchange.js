import React, { Component } from 'react'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import cn from 'classnames'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MinutesFormat from '../MinutesFormat'
import {
	fetchConsts,
	getStatus,
	createOrder,
	clearOrder
} from '../../store/actions'

class BankTransfer extends Component {
	constructor() {
		super()
		this.state = {
			timerId: null,
			timer: 0,
			refreshTime: 10,
			expired: false
		}

		this.tick = this.tick.bind(this)
		this.initInterval = this.initInterval.bind(this)
		this.fetchCalls = this.fetchCalls.bind(this)
		this.startPayment = this.startPayment.bind(this)
		this.restart = this.restart.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.renderButton = this.renderButton.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	initInterval() {
		clearInterval(this.state.timerId)
		const timerId = setInterval(this.tick, 1000)
		this.setState({ timerId })
	}

	tick() {
		if (this.state.timer < this.state.refreshTime) {
			this.setState({ timer: this.state.timer + 1 })
		} else {
			clearInterval(this.state.timerId)
			this.setState({ expired: true })
		}
	}

	componentWillMount() {
		this.startPayment()
	}

	componentWillUnmount() {
		clearInterval(this.state.timerId)
	}

	fetchCalls() {
		this.props.fetchConsts()
	}

	startPayment() {
		const createdAt = Math.round(new Date().getTime() / 1000.0)
		this.props.createOrder({
			destAmount: this.props.receiveAmount,
			sourceAmount: this.props.sendAmount,
			destCurrency: this.props.receiveCurrency,
			sourceCurrency: this.props.sendCurrency,
			exchangeRate: this.props.rate,
			dest: this.props.wallet,
			ctUser: this.props.ctUser,
			createdAt
		})
		this.setState({ expired: false })
		this.initInterval()
		this.fetchCalls()
	}

	restart() {
		this.props.onRestart()
	}

	renderButton() {
		return (
			<button
				type="submit"
				className={cn('btn-block btn-lg btn-exchange no-border', 'btn-primary')}
				disabled={!this.props.depositAddress}>
				Proceed to payment
			</button>
		)
	}

	onSubmit(event) {
		event.preventDefault()
		const { order, ctUser, depositAddress } = this.props
		this.props.clearOrder({
			orderId: order.create.CtTransactionId,
			accountId: null,
			ctUser
		})
	}

	render() {
		if (!this.state.expired) {
			if (this.props.order.create) {
				return (
					<div className="main-calc-wrapper">
						<form onSubmit={this.onSubmit}>
							<div className="row">
								<div className="col-12 text-left">
									<label className="field-label m-0">Amount</label>
									<p className="field-value">
										{this.props.sendAmount.toFixed(8) || <br />}
									</p>
								</div>
							</div>
							<div className="row">
								<div className="col-12">
									<hr className="mt-0" />
								</div>
							</div>
							<div className="row">
								<div className="col-12 text-left">
									<Field
										name="depositAddress"
										label="BTC deposit address"
										component={this.renderWalletField}
										placeholder="Deposit Address"
									/>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-md-12">{this.renderButton()}</div>
							</div>
						</form>
					</div>
				)
			} else if (this.props.order.loading) {
				return (
					<div className="main-calc-wrapper d-flex">
						<div className="h-100 m-auto" style={{ color: '#045CC7' }}>
							<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
						</div>
					</div>
				)
			} else {
				return (
					<div className="main-calc-wrapper">
						<div className="row">
							<div className="col-12">
								<h2 className="mt-5">Oops something went wrong</h2>
								<img
									className="mt-4"
									src="/static/images/error.svg"
									alt="error"
								/>
								<p className="mt-4">
									We are working on getting the error fixed. Please try to
									refresh the page or restart the process in a few minutes.
								</p>
							</div>
						</div>
					</div>
				)
			}
		} else {
			return (
				<div className="main-calc-wrapper">
					<div className="row">
						<div className="col-12">
							<h2 className="mt-5">Payement timeout</h2>
							<img
								className="mt-4"
								src="/static/images/error.svg"
								alt="error"
							/>
							<p className="mt-4">
								Oops, looks like you ran out of time. Click the link below to
								restart the transaction.
							</p>
							<button className="btn-back" onClick={() => this.restart()}>
								<span>Restart</span>
							</button>
						</div>
					</div>
				</div>
			)
		}
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
		const { order } = props

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

const mapStateToProps = state => {
	const depositAddress = selector(state, 'depositAddress')
	return {
		order: state.order,
		constants: state.constants,
		depositAddress
	}
}

export default reduxForm({ form: 'ExchangeForm' })(
	connect(
		mapStateToProps,
		{
			fetchConsts,
			getStatus,
			createOrder,
			clearOrder
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
	onRestart: PropTypes.func
}
