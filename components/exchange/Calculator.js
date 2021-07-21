import React, { Component } from 'react'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cn from 'classnames'
import {
	fetchQuote,
	fetchConsts,
	fetchAssetsList,
	fetchAssetsStatus
} from '../../store/actions'
import _ from 'lodash'
import CAValidator from 'cryptocurrency-address-validator'
import { Send, Receive } from '../../assets'

class Calculator extends Component {
	constructor(props) {
		super(props)
		this.state = {
			placeholderSendAmount: 100,
			placeholderReceiveAmount: 0,
			rate: 0,
			currencySymbol: '£',
			limit: 0,
			buttonIsDisabled: false,
			action: 'sending',
			intervalId: null,
			interval: 10,
			quoteLoading: false,
			coins: props.assets.list.Receive,
			currencies: props.assets.list.Send,
			coinSearch: '',
			coinSelected:
				props.assets.list.Receive.find(
					asset => asset.Name === props.assets.currentAsset
				) || false,
			currencySelected: props.assets.list.Send[0],
			toggleCurrency: false,
			toggleCoin: false,
			search: false,
			defaultCoin: 'BTC',
			active: false
			// fetchQuote: null
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.updateLimit = this.updateLimit.bind(this)
		this.updateRate = this.updateRate.bind(this)
		this.updateCoins = this.updateCoins.bind(this)
		this.updateButtonState = this.updateButtonState.bind(this)

		this.normalizeSendAmount = this.normalizeSendAmount.bind(this)
		this.normalizeReceiveAmount = this.normalizeReceiveAmount.bind(this)
		this.convertToReceiveAmount = this.convertToReceiveAmount.bind(this)
		this.convertToSendAmount = this.convertToSendAmount.bind(this)

		this.fetchCalls = this.fetchCalls.bind(this)
		this.getQuote = this.getQuote.bind(this)
		this.onCoinSelected = this.onCoinSelected.bind(this)
		this.onCurrencySelected = this.onCurrencySelected.bind(this)
		this.toggleDropDown = this.toggleDropDown.bind(this)
		this.toggleSearch = this.toggleSearch.bind(this)
	}

	normalizeSendAmount(value, previousValue) {
		const {
			currencySelected,
			coinSelected,
			placeholderSendAmount,
			coins
		} = this.state

		const decimalPoint = _.defaultTo(currencySelected && currencySelected.Dp, 2)

		let sendAmount = value.replace(/[^\d.]/g, '')
		let pos = sendAmount.indexOf('.')

		this.setState({ action: 'sending' })

		if (pos >= 0) {
			// prevent an extra decimal point
			if (sendAmount.indexOf('.', pos + 1) > 0)
				sendAmount = sendAmount.substring(0, pos + 1)

			// allow up to 2 dp
			if (sendAmount.length - pos > 2)
				sendAmount = sendAmount.substring(0, pos + 1 + decimalPoint)
		}

		if (value !== previousValue) {
			const coinName = _.defaultTo(
				coinSelected && coinSelected.Name,
				coins[0].Name
			)

			// let fetchQuote
			if (sendAmount.length > 0) {
				debouceSend(this.props, sendAmount, currencySelected, coinName)
			} else {
				debouceSend(
					this.props,
					placeholderSendAmount,
					currencySelected,
					coinName
				)
				this.props.change('receiveAmount', null)
			}
			// this.setState({ fetchQuote })
		}

		// if (sendAmount.length > 0)
		// 	return (
		// 		(currencySelected ? currencySelected.Symbol : '£') + ' ' + sendAmount
		// 	)
		// else
		return sendAmount
	}

	normalizeReceiveAmount(value, previousValue) {
		const {
			currencySelected,
			coinSelected,
			placeholderSendAmount,
			coins
		} = this.state

		let decimalPoint = 8
		let receiveAmount = value.replace(/[^\d.]/g, '')
		let pos = receiveAmount.indexOf('.')

		if (pos >= 0) {
			// prevent an extra decimal point
			if (receiveAmount.indexOf('.', pos + 1) > 0)
				receiveAmount = receiveAmount.substring(0, pos + 1)
			// allow up to 2 dp
			if (receiveAmount.length - pos > 2)
				receiveAmount = receiveAmount.substring(0, pos + 1 + decimalPoint)
		}

		if (value !== previousValue) {
			const coinName = _.defaultTo(
				coinSelected && coinSelected.Name,
				coins[0].Name
			)

			if (receiveAmount.length > 0) {
				this.setState({ action: 'receiving' })
				debouceReceive(this.props, receiveAmount, currencySelected, coinName)
			} else {
				// fetch quote to reset default rate
				debouceSend(
					this.props,
					placeholderSendAmount,
					currencySelected,
					coinName
				)
				this.props.change('sendAmount', null)
				this.setState({ action: 'sending' })
			}
		}

		return receiveAmount
	}

	initInterval(interval) {
		clearInterval(this.state.intervalId)
		let intervalId = setTimeout(this.fetchCalls, interval * 1000)
		// let intervalId = setInterval(this.fetchCalls, interval * 1000)
		// store intervalId in the state so it can be accessed later to clear it
		this.setState({ intervalId })
	}

	componentDidMount() {
		this.setState({ active: true }, () => {
			// set call fetch interval
			this.initInterval(this.state.interval)
			// fetch call the first time component mounts
			this.fetchCalls()
		})
		addEventListener('keyup', this.onEscape)
		addEventListener('click', this.onClickOutside)
	}

	componentWillUnmount() {
		this.setState({ active: false })
		// if (this.state.fetchQuote) this.state.fetchQuote.cancel()
		clearInterval(this.state.intervalId)
		removeEventListener('keyup', this.onEscape)
		removeEventListener('click', this.onClickOutside)
	}

	onEscape = event => {
		if (event.keyCode === 27) {
			if (this.state.toggleCoin) {
				this.toggleDropDown('coin')
			}
			if (this.state.toggleCurrency) {
				this.toggleDropDown('currency')
			}
		}
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
			path.find(node => node.className === 'dropdown dropdown-currency-select')
		if (!select) {
			this.setState({
				toggleCoin: false,
				toggleCurrency: false,
				coinSearch: ''
			})
		}
	}

	getQuote() {
		const SendCurrency = this.state.currencySelected.Name
		const ReceiveCurrency = this.state.coinSelected
			? this.state.coinSelected.Name
			: this.state.coins[0].Name

		if (this.state.action === 'sending') {
			return this.props.fetchQuote({
				SendCurrency,
				ReceiveCurrency,
				SendAmount: this.props.sendAmount
					? this.props.sendAmount
					: this.state.placeholderSendAmount
			})
		} else if (this.state.action === 'receiving' && this.props.receiveAmount) {
			return this.props.fetchQuote({
				SendCurrency,
				ReceiveCurrency,
				ReceiveAmount: this.props.receiveAmount
			})
		}
	}

	fetchCalls() {
		if (!this.state.active) return
		this.props.fetchAssetsStatus()
		this.props.fetchConsts()
		this.getQuote()
	}

	componentWillReceiveProps(props) {
		const { quote, sendAmount, receiveAmount } = props
		const { QuoteSendAmount, QuoteReceiveAmount, loading } = quote
		const { action, currencySelected } = this.state
		this.setState({ quoteLoading: loading })

		if (sendAmount && action === 'sending') {
			if (sendAmount === QuoteSendAmount) {
				const dp = QuoteReceiveAmount ? 8 : 0
				this.props.change(
					'receiveAmount',
					parseFloat(QuoteReceiveAmount).toFixed(dp)
				)
			}
		}

		if (receiveAmount && action === 'receiving' && currencySelected) {
			const { Dp } = currencySelected
			if (receiveAmount === QuoteReceiveAmount)
				this.props.change(
					'sendAmount',
					`${parseFloat(QuoteSendAmount).toFixed(
						QuoteSendAmount == 0 ? 0 : Dp
					)}`
				)
		}

		this.updateLimit(props)
		this.updateCoins(props)
		this.updateRate(props)
		this.updateButtonState(props)
	}

	searchCoin({ target }) {
		this.setState({
			coinSearch: target.value
		})
	}

	filterCoins(coin) {
		let word = this.state.coinSearch.toLowerCase().trim()
		if (coin.Name.toLowerCase().startsWith(word)) {
			return true
		}

		if (coin.FullName.toLowerCase().startsWith(word)) {
			return true
		}

		if (coin.Keywords.startsWith(word)) {
			return true
		}
		return false
	}

	toggleSearch() {
		this.setState({ search: !this.state.search })
	}

	toggleDropDown(type) {
		if (type === 'currency') {
			if (!this.state.toggleCurrency) this.props.fetchAssetsStatus()
			this.setState({
				toggleCurrency: !this.state.toggleCurrency,
				toggleCoin: false,
				coinSearch: ''
			})
		} else if (type === 'coin') {
			if (!this.state.toggleCoin) this.props.fetchAssetsStatus()
			this.setState({ toggleCoin: !this.state.toggleCoin, coinSearch: '' })
		}
	}

	convertToReceiveAmount(amount) {
		return !amount || !this.state.rate ? 0 : amount / this.state.rate
	}

	convertToSendAmount(amount) {
		return amount * this.state.rate
	}

	updateLimit({ constants }) {
		if (constants) {
			let interval = constants.Frame1Refresh
			// this.state.interval !== interval &&
			if (this.state.active) {
				this.initInterval(interval)
				this.setState({ interval })
			}
		}
	}

	updateRate(props) {
		this.setState({
			rate: parseFloat(props.quote.ExchangeRate)
		})
	}

	updateCoins(props) {
		let updatedCoins = []

		if (props.assets.status && this.state.currencySelected) {
			Object.keys(props.assets.status).forEach(assetPair => {
				if (assetPair.startsWith(this.state.currencySelected.Name)) {
					const asset = props.assets.status[assetPair]
					const coin = props.assets.list.Receive.find(
						coin =>
							assetPair === `${this.state.currencySelected.Name}${coin.Name}`
					)
					if (coin) {
						coin.DefaultQuoteAmount = asset.Send.DefaultQuoteAmount
						coin.Status = asset.Send.Status
						updatedCoins.push(coin)
					}
				}
			})
			updatedCoins = updatedCoins.sort((c1, c2) => c1.Position - c2.Position)

			const prev = this.state.coinSelected
				? this.state.coinSelected.Name
				: false
			const preSelectedCoin = updatedCoins.find(
				coin => coin.Name === props.preSelectedCoin
			)
			const coinSelected = this.state.coinSelected
				? updatedCoins.find(coin => coin.Name === this.state.coinSelected.Name)
				: preSelectedCoin
					? preSelectedCoin
					: updatedCoins.length
						? updatedCoins[0]
						: false

			this.setState(
				{
					coins: updatedCoins,
					coinSelected,
					placeholderSendAmount: coinSelected
						? coinSelected.DefaultQuoteAmount
						: this.state.placeholderSendAmount
				},
				() => {
					this.props.change(
						'receiveCurrency',
						coinSelected ? coinSelected.Name : false
					)
					if (coinSelected && prev != coinSelected.Name) {
						this.fetchCalls()
					}
				}
			)
		}
	}

	updateButtonState(props) {
		this.setState({
			buttonIsDisabled: props.sendAmount
				? (props.quote.Limits && props.quote.Limits.Max.SendCurrency) <
				props.sendAmount ||
				(props.quote.Limits && props.quote.Limits.Min.SendCurrency) >
				props.sendAmount ||
				!props.wallet ||
				props.asyncValidating ||
				!props.valid
				: true
		})
	}

	renderField(field) {
		const {
			placeholder,
			meta: { touched, valid, error }
		} = field

		return (
			<div>
				<input
					autoComplete="off"
					spellCheck={false}
					placeholder={placeholder}
					onBlur={field.input.onBlur}
					className="form-control no-border p-0"
					{...field.input}
				/>
			</div>
		)
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
				<label className="field-label">
					{!touched ? label : valid ? label : error}
				</label>
				<div className="calc-field">
					<div className="col-12">
						<input
							id="input-wallet-addr"
							autoComplete="off"
							spellCheck={false}
							placeholder={placeholder}
							className="form-control no-border p-0"
							{...field.input}
						/>
						{asyncValidating ? (
							<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
						) : (
								''
							)}
					</div>
				</div>
			</div>
		)
	}

	renderButton() {
		return (
			<button
				type="submit"
				className="btn-block btn-lg btn-exchange no-border"
				disabled={this.state.buttonIsDisabled}>
				Instant exchange
			</button>
		)
	}

	onCoinSelected(coin) {
		this.setState(
			{
				coinSelected: coin,
				toggleCoin: false,
				coinSearch: ''
			},
			() => {
				this.fetchCalls()
				setTimeout(() => {
					// trigger form validation with delay
					const addrInput = document.getElementById('input-wallet-addr')
					addrInput.focus()
					addrInput.blur()
				}, 300)
			}
		)
	}

	onCurrencySelected(currency) {
		this.setState(
			{
				currencySelected: currency,
				toggleCurrency: false
			},
			() => {
				if (this.props.sendAmount)
					this.props.change(
						'sendAmount',
						parseFloat(this.props.sendAmount).toFixed(currency.Dp)
					)
				this.fetchCalls()
			}
		)
	}

	onSubmit(event) {
		event.preventDefault()
		clearInterval(this.state.intervalId)
		this.props.onConfirm({
			sendAmount: this.props.sendAmount,
			initialSendAmount: this.props.sendAmount,
			receiveAmount: this.props.receiveAmount,
			sendCurrency: this.state.currencySelected.Name,
			receiveCurrency: _.defaultTo(
				this.state.coinSelected && this.state.coinSelected.Name,
				'BTC'
			),
			action: this.state.action,
			rate: this.state.rate,
			wallet: this.props.wallet
		})
	}

	render() {
		let coins = this.state.coins
		let currencies = this.state.currencies
		if (this.state.coinSearch)
			coins = this.state.coins.filter(coin => this.filterCoins(coin))

		const {
			sendAmount,
			receiveAmount,
			quote: { Limits, Message, Direction }
		} = this.props

		const ExchangeableItem = ({
			exchangeable,
			onItemSelected,
			unavailable
		}) => (
				<div>
					{
						<a
							className={cn('dropdown-item', unavailable ? 'unavailable' : null)}
							// onClick={unavailable ? null : () => onItemSelected(exchangeable)}
							onClick={() => onItemSelected(exchangeable)}>
							<div className="text-label currency-label">
								<div className="currency-symbol-wrapper fluid justify-content-between">
									<div className="col-8 text-left text-truncate currency-fullname p-0">
										<img
											className="currency-symbol"
											src={exchangeable.Image}
											alt={exchangeable.Name}
										/>
										<span>{exchangeable.FullName}</span>
									</div>
									<div className="col-4 text-right p-0">
										<b>{exchangeable.Name}</b>
									</div>
								</div>
							</div>
						</a>
					}
				</div>
			)

		return (
			<div className="main-calc-wrapper">
				<form onSubmit={this.onSubmit}>
					<div
						className={cn(
							'calc-input-wrapper text-left',
							Message ? 'invalid' : null
						)}>
						<label className="field-label">
							{Message ? Message : 'You send'}
						</label>
						<div className="calc-field">
							<div className="col-6 pr-0">
								<Field
									name="sendAmount"
									component={this.renderField}
									normalize={this.normalizeSendAmount}
									placeholder={this.state.placeholderSendAmount.toFixed(
										this.state.currencySelected
											? this.state.currencySelected.Dp
											: 2
									)}
								/>
							</div>
							<div className="col-6 pr-0 d-flex align-items-center d-flex align-items-center">
								<div className="dropdown dropdown-currency-select">
									<a
										className="btn dropdown-toggle"
										role="button"
										id="dropdownMenuLink"
										onClick={() => this.toggleDropDown('currency')}>
										<div
											className="text-label currency-label"
											style={{ maxWidth: 150, marginLeft: 'auto' }}>
											<div className="currency-symbol-wrapper">
												<img
													className="currency-symbol"
													src={this.state.currencySelected.Image}
													alt={this.state.currencySelected.Name}
												/>
											</div>
											<span className="text-left" style={{ minWidth: '46px' }}>
												{this.state.currencySelected.Name}
											</span>
											<img
												className="dropdown-arrow"
												src="/static/images/arrow-down.svg"
												alt="Dropdown"
											/>
										</div>
									</a>
									{this.state.toggleCurrency && (
										<div
											className="dropdown-menu show"
											aria-labelledby="dropdownMenuLink">
											<div className="search-item">
												<input
													className="search-input"
													placeholder="Coming Soon"
													type="text"
													name="lname"
													disabled
												/>
											</div>

											<div className="dropdown-items-wrapper">
												{currencies.map(currency => (
													<ExchangeableItem
														key={currency.Name}
														exchangeable={currency}
														onItemSelected={this.onCurrencySelected}
													/>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="calc-input-wrapper text-left">
						<label className="field-label">You receive</label>
						<div className="calc-field">
							<div className="col-6 pr-0">
								<Field
									name="receiveAmount"
									component={this.renderField}
									normalize={this.normalizeReceiveAmount}
									placeholder={this.convertToReceiveAmount(
										this.state.placeholderSendAmount
									).toFixed(8)}
								/>
							</div>
							<div className="col-6 pr-0 d-flex align-items-center">
								<div className="dropdown dropdown-currency-select">
									<a
										className="btn dropdown-toggle"
										role="button"
										id="dropdownMenuLink"
										onClick={() => this.toggleDropDown('coin')}>
										{this.state.coinSelected && (
											<div
												className="text-label currency-label"
												style={{ maxWidth: 150, marginLeft: 'auto' }}>
												<div className="currency-symbol-wrapper">
													<img
														className="currency-symbol"
														src={this.state.coinSelected.Image}
														alt={this.state.coinSelected.Name}
													/>
												</div>
												<span
													className="text-left"
													style={{ minWidth: '46px' }}>
													{this.state.coinSelected.Name}
												</span>
												<img
													className="dropdown-arrow"
													src="/static/images/arrow-down.svg"
													alt="Dropdown"
												/>
											</div>
										)}
									</a>
									{this.state.toggleCoin && (
										<div
											className="dropdown-menu show"
											aria-labelledby="dropdownMenuLink">
											<div className="search-item">
												<input
													className="search-input"
													placeholder="Search"
													type="search"
													value={this.state.coinSearch}
													onClick={this.toggleSearch}
													onChange={this.searchCoin.bind(this)}
												/>
												<img
													className="search-symbol"
													src="/static/images/dropdown-search.svg"
													alt="Search"
												/>
											</div>
											<div className="dropdown-items-wrapper">
												{coins.length ? (
													coins.map(coin => (
														<ExchangeableItem
															key={coin.Name}
															exchangeable={coin}
															unavailable={coin.Status !== 'AVAILABLE'}
															onItemSelected={this.onCoinSelected}
														/>
													))
												) : (
														<div className="px-3">No results</div>
													)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<Field
						name="receiveCurrency"
						component={field => <input type="hidden" {...field.input} />}
					/>
					<Field
						name="wallet"
						label="Wallet address"
						component={this.renderWalletField}
						placeholder="Wallet Address"
					/>
					<h6 className="exchange-rate">
						<b>
							Exchange Rate:{' '}
							{!this.state.rate || this.props.quote.Message
								? '-/-'
								: (this.state.currencySelected
									? this.state.currencySelected.Symbol
									: this.state.currencySymbol) +
								' ' +
								(this.state.currencySelected
									? this.state.rate.toFixed(this.state.currencySelected.Dp)
									: this.state.rate.toFixed(2)) +
								'/' +
								(this.state.coinSelected
									? this.state.coinSelected.Name
									: 'BTC') +
								' '}
						</b>
					</h6>
					<div className="row">
						<div className="col-md-12">{this.renderButton()}</div>
					</div>
				</form>
			</div>
		)
	}
}

const mapStateToProps = state => {
	const selector = formValueSelector('CalcForm')
	// let sendAmount = '"' + selector(state, 'sendAmount')
	// sendAmount = Number.parseFloat(sendAmount.split(' ')[1])
	const sendAmount = parseFloat(selector(state, 'sendAmount'))
	const receiveAmount = parseFloat(selector(state, 'receiveAmount'))
	const wallet = selector(state, 'wallet')

	return {
		quote: state.quote,
		assets: state.assets,
		constants: state.constants,
		wallet,
		sendAmount,
		receiveAmount
	}
}

const debouceSend = _.debounce(
	(props, sendAmount, currency, coin) =>
		props.fetchQuote({
			SendCurrency: currency.Name,
			ReceiveCurrency: coin,
			SendAmount: parseFloat(sendAmount)
		}),
	500,
	{ trailing: true }
)

const debouceReceive = _.debounce(
	(props, receiveAmount, currency, coin) => {
		props.fetchQuote({
			SendCurrency: currency.Name,
			ReceiveCurrency: coin,
			ReceiveAmount: parseFloat(receiveAmount)
		})
	},
	500,
	{ trailing: true }
)

const asyncValidate = ({ wallet, receiveCurrency }) => {
	const error = { wallet: 'Invalid wallet address' }

	let receiveCurrencyArray = [
		'AUR',
		'BVC',
		'BIO',
		'BTC',
		'BCH',
		'BTG',
		'BTCP',
		'BTCZ',
		'CLO',
		'ADA',
		'DASH',
		'DCR',
		'DGB',
		'DOGE',
		'EOS',
		'ETH',
		'ETC',
		'ETZ',
		'FRC',
		'GRLC',
		'HUSH',
		'KMD',
		'IOTA',
		'ICON',
		'LTC',
		'MEC',
		'XMR',
		'NMC',
		'NANO',
		'NEO',
		'GAS',
		'NEM',
		'PPC',
		'XPM',
		'PTS',
		'QASH',
		'QTUM',
		'XRB',
		'REN',
		'XRP',
		'SNG',
		'XLM',
		'TRX',
		'VTC',
		'VeChain',
		'VOT',
		'ZEC',
		'ZCL',
		'ZEN'
	]

	let matches = Receive.filter(v => v.Name.includes(receiveCurrency))
	if (
		receiveCurrencyArray.indexOf(receiveCurrency) > -1 ||
		matches[0].Type == 'ERC20'
	) {
		if (matches[0].Type == 'ERC20') {
			var valid = CAValidator.validate(wallet, 'ETH')
		} else {
			var valid = CAValidator.validate(wallet, receiveCurrency)
		}

		if (valid) {
			return Promise.resolve(valid)
		} else {
			return Promise.reject(error)
		}
	} else {
		const validateUrl = '/api/validate-address'
		return wallet
			? fetch(`${validateUrl}/${wallet}/${receiveCurrency}`)
				.then(res => res.json())
				.then(res => {
					if (!res.isvalid) throw error
				})
			: Promise.reject(error)
	}
}

export default reduxForm({
	form: 'CalcForm',
	destroyOnUnmount: false,
	asyncValidate,
	asyncChangeFields: ['wallet', 'receiveCurrency'],
	asyncBlurFields: ['wallet']
})(
	connect(
		mapStateToProps,
		{
			fetchQuote,
			fetchConsts,
			fetchAssetsStatus,
			fetchAssetsList
		}
	)(Calculator)
)

Calculator.propTypes = {
	onConfirm: PropTypes.func,
	ctUser: PropTypes.any
}
