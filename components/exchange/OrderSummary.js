import React, { Component } from 'react'
import { fetchQuote, fetchConsts } from '../../store/actions'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Recaptcha from 'react-grecaptcha'
import Clipboard from 'react-clipboard.js'
import MinutesFormat from '../MinutesFormat'

// const sitekey = '6Ld5nFUUAAAAANRvB37_utUYF0-keXqw_i105cGm'
const sitekey = '6LcopGcUAAAAALwksZY5mpplDNxtR8trVNiyMyRY'
const dev = process.env.NODE_ENV !== 'production'

class OrderSummary extends Component {
	constructor() {
		super()
		this.state = {
			timerId: null,
			timer: 0,
			buttonIsDisabled: !dev, // true,
			refreshTime: 60,
			showCaptcha: false,
			exchangeRate: null
		}

		this.tick = this.tick.bind(this)
		this.initInterval = this.initInterval.bind(this)
		this.fetchCalls = this.fetchCalls.bind(this)
		this.updateLimit = this.updateLimit.bind(this)
		this.updateRate = this.updateRate.bind(this)
		this.updateSendAmount = this.updateSendAmount.bind(this)
		this.renderButton = this.renderButton.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	tick() {
		if (this.state.timer < this.state.refreshTime) {
			this.setState({ timer: this.state.timer + 1 })
			// if (this.props.sendAmount === 0) {
			// 	this.props.fetchQuote({
			// 		SendCurrency: this.props.sendCurrency,
			// 		ReceiveCurrency: this.props.receiveCurrency,
			// 		SendAmount: this.props.initialSendAmount
			// 	})
			// }
		} else {
			clearInterval(this.state.timerId)
			this.fetchCalls()
		}
	}

	initInterval() {
		clearInterval(this.state.timerId)
		const timerId = setInterval(this.tick, 1000)
		this.setState({ timerId })
	}

	componentWillMount() {
		this.initInterval()
		this.fetchCalls()
	}

	componentWillUnmount() {
		clearInterval(this.state.timerId)
	}

	fetchCalls() {
		if (this.props.action === 'sending') {
			this.props.fetchQuote({
				SendCurrency: this.props.sendCurrency,
				ReceiveCurrency: this.props.receiveCurrency,
				SendAmount: this.props.sendAmount
			})
		} else {
			this.props.fetchQuote({
				SendCurrency: this.props.sendCurrency,
				ReceiveCurrency: this.props.receiveCurrency,
				ReceiveAmount: this.props.receiveAmount
			})
		}
		this.props.fetchConsts()
	}

	onVerify = response => {
		// console.log(response)
		this.setState({ buttonIsDisabled: false })
	}

	onExpired = () => {
		console.log(`Recaptcha expired`)
	}

	renderButton() {
		return (
			<button
				type="submit"
				className="btn-block btn-lg btn-exchange no-border btn-primary"
				disabled={this.state.buttonIsDisabled}>
				Proceed to payment
			</button>
		)
	}

	onSubmit(event) {
		event.preventDefault()
		clearInterval(this.state.timerId)
		this.props.onConfirm({
			rate: this.props.rate !== 0 ? this.props.rate : this.state.exchangeRate
		})
	}

	render() {
		const {
			sendAmount,
			initialSendAmount,
			receiveAmount,
			sendCurrency,
			receiveCurrency,
			rate,
			wallet
		} = this.props

		return (
			<div>
				<div className="main-calc-wrapper order-summary-wrapper">
					<form onSubmit={this.onSubmit}>
						<div className="row">
							<div className="col-12 text-left text-nowrap">
								<label className="field-label">You send</label>
								<p className="field-value">{`${
									sendAmount !== 0
										? sendAmount.toFixed(sendCurrency === 'GBP' ? 2 : 8)
										: initialSendAmount.toFixed(sendCurrency === 'GBP' ? 2 : 8)
								} ${sendCurrency}`}</p>
							</div>
							<div className="col-12 text-left text-nowrap">
								<label className="field-label">You receive</label>
								<p className="field-value">{`${receiveAmount.toFixed(
									8
								)} ${receiveCurrency}`}</p>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 text-left">
								<label className="field-label">Exchange rate</label>
								<p className="field-value">
									{`${
										rate !== 0
											? sendCurrency === 'GBP'
												? rate.toFixed(2)
												: rate.toFixed(8)
											: sendCurrency === 'GBP'
											? this.state.exchangeRate.toFixed(2)
											: this.state.exchangeRate.toFixed(8)
									} ${sendCurrency}/${receiveCurrency}`}
								</p>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 text-left">
								<label className="field-label field-external-wallet d-flex">
									External wallet address
								</label>
								<Clipboard
									className="field-value wallet-field text-nowrap"
									data-clipboard-text={wallet}>
									<div>
										<p>{wallet} </p>
										<i className="ml-2 far fa-clone" />
									</div>
								</Clipboard>
							</div>
						</div>
						<div className="row">
							<div className="col">
								<hr />
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 recaptcha-wrapper">
								<Recaptcha
									sitekey={sitekey}
									callback={this.onVerify}
									expiredCallback={this.onExpired.bind(this)}
									locale="en"
									size="compact"
									data-theme="light"
								/>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col-md-12">{this.renderButton()}</div>
						</div>
					</form>
				</div>
				<p className="text-left mt-3">
					Exchange rate will update in{' '}
					<MinutesFormat seconds={this.state.refreshTime - this.state.timer} />
				</p>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		this.updateLimit(props)
		this.updateRate(props)
		this.updateSendAmount(props)
	}

	updateLimit({ constants }) {
		if (constants) {
			const refreshTime = constants.Frame2Refresh
			if (this.state.refreshTime >= this.state.timer) {
				this.initInterval()
				this.setState({ refreshTime, timer: 0 })
			}
		}
	}

	updateRate({ quote }) {
		if (quote.ExchangeRate !== 0) {
			this.setState({
				exchangeRate: parseFloat(quote.ExchangeRate)
			})
		}
	}

	updateSendAmount({ quote }) {
		this.props.onRateChange({
			sendAmount: quote.QuoteSendAmount,
			receiveAmount: quote.QuoteReceiveAmount,
			rate: quote.ExchangeRate
		})
	}
}

const mapStateToProps = state => {
	return {
		bank: state.bank,
		constants: state.constants,
		quote: state.quote
	}
}

export default connect(
	mapStateToProps,
	{
		fetchQuote,
		fetchConsts
	}
)(OrderSummary)

OrderSummary.propTypes = {
	sendAmount: PropTypes.number,
	initialSendAmount: PropTypes.number,
	receiveAmount: PropTypes.number,
	sendCurrency: PropTypes.string,
	receiveCurrency: PropTypes.string,
	action: PropTypes.string,
	rate: PropTypes.number,
	wallet: PropTypes.string,
	onRateChange: PropTypes.func,
	onConfirm: PropTypes.func
}
