import React, { Component } from 'react'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import { formValueSelector, Field, reduxForm } from 'redux-form'
import {
	fetchAssetsList,
	fetchAssetsStatus,
	fetchConsts,
	fetchQuote,
	setCurrentAsset
} from '../../../store/actions'
import cn from 'classnames'
import _ from 'lodash'

class Calculator extends Component {
	constructor(props) {
		super(props)
		this.state = {
			placeholderSendAmount: 100,
			placeholderReceiveAmount: 0,
			rate: 1200,
			action: 'sending',
			intervalId: null,
			interval: 10,
			quoteLoading: false,
			coins: props.assets.list.Receive,
			currencies: props.assets.list.Send,
			coinSearch: '',
			coinSelected: false,
			currencySelected: props.assets.list.Send[0],
			toggleCurrency: false,
			toggleCoin: false,
			search: false,
			active: false
		}

		this.onSubmit = this.onSubmit.bind(this)
		this.updateRate = this.updateRate.bind(this)
		this.updateCoins = this.updateCoins.bind(this)

		this.normalizeSendAmount = this.normalizeSendAmount.bind(this)
		this.normalizeReceiveAmount = this.normalizeReceiveAmount.bind(this)
		this.toReceiveAmount = this.toReceiveAmount.bind(this)
		this.renderButton = this.renderButton.bind(this)

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
			const currencyName = currencySelected.Name
			const coinName = _.defaultTo(
				coinSelected && coinSelected.Name,
				coins[0].Name
			)

			if (sendAmount.length > 0)
				debouceSend(this.props, sendAmount, currencyName, coinName)
			else {
				debouceSend(this.props, placeholderSendAmount, currencyName, coinName)
				this.props.change('receiveAmount', null)
			}
		}

		//if (sendAmount.length > 0) return '' + sendAmount
		//else return sendAmount
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
		// receiveAmount = Number(receiveAmount) < limits.Min.ReceiveCurrency ? String(limits.Min.ReceiveCurrency) : receiveAmount
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
			const currencyName = currencySelected.Name
			const coinName = _.defaultTo(
				coinSelected && coinSelected.Name,
				coins[0].Name
			)

			if (receiveAmount.length > 0) {
				this.setState({ action: 'receiving' })
				debouceReceive(this.props, receiveAmount, currencyName, coinName)
			} else {
				// fetch quote to reset default rate
				debouceSend(this.props, placeholderSendAmount, currencyName, coinName)
				this.props.change('sendAmount', null)
				this.setState({ action: 'sending' })
			}
		}

		return receiveAmount
	}

	initInterval(interval) {
		clearInterval(this.state.intervalId)
		const intervalId = setInterval(this.fetchCalls, interval * 1000)
		this.setState({ intervalId })
	}

	componentDidMount() {
		const coinName = this.props.router.asPath

		const [coin] = this.props.assets.list.Receive.filter(
			asset => asset.SeoURL.toLowerCase() === coinName.toLowerCase()
		)

		this.setState({ active: true })
		// set call fetch interval
		this.initInterval(this.state.interval)
		// fetch call the first time component mounts
		this.fetchCalls()

		// this.setState({
		// 	coinSelected: coin
		// 	// currencySelected: coin
		// })

		addEventListener('keyup', this.onEscape)
		addEventListener('click', this.onClickOutside)
	}

	componentWillUnmount() {
		this.setState({ active: false })
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
		if (this.state.action === 'sending') {
			this.props.fetchQuote({
				SendCurrency: this.state.currencySelected.Name,
				ReceiveCurrency: this.state.coinSelected
					? this.state.coinSelected.Name
					: this.state.coins.length && this.state.coins[0].Name,
				SendAmount: this.props.sendAmount
					? this.props.sendAmount
					: this.state.placeholderSendAmount
			})
		} else if (this.state.action === 'receiving' && this.props.receiveAmount) {
			this.props.fetchQuote({
				SendCurrency: this.state.currencySelected.Name,
				ReceiveCurrency: this.state.coinSelected
					? this.state.coinSelected.Name
					: this.state.coins[0].Name,
				ReceiveAmount: this.props.receiveAmount
			})
		}
	}

	fetchCalls() {
		if (this.props.router.pathname !== 'exchange') {
			this.props.fetchAssetsStatus()
			if (this.props.ctUser) this.props.fetchLimit(this.props.ctUser)
			this.props.fetchConsts()
			this.getQuote()
		}
	}

	componentWillReceiveProps(props) {
		const {
			quote: { QuoteSendAmount, QuoteReceiveAmount, loading },
			sendAmount,
			receiveAmount
		} = props
		const { action, currencySelected } = this.state
		this.setState({ quoteLoading: loading })

		if (sendAmount && action === 'sending') {
			if (sendAmount === QuoteSendAmount)
				this.props.change(
					'receiveAmount',
					parseFloat(QuoteReceiveAmount).toFixed(
						QuoteReceiveAmount == 0 ? 0 : 8
					)
				)
		}
		if (receiveAmount && action === 'receiving' && currencySelected) {
			const { dp } = currencySelected
			if (receiveAmount === QuoteReceiveAmount)
				this.props.change(
					'sendAmount',
					`${parseFloat(QuoteSendAmount).toFixed(2)}`
				)
		}

		this.updateLimit(props)
		this.updateCoins(props)
		this.updateRate(props)
	}

	onSubmit(values) {
		clearInterval(this.state.intervalId)
	}

	renderField({ input, placeholder }) {
		return (
			<div>
				<input
					autoComplete="off"
					spellCheck={false}
					placeholder={placeholder}
					className="form-control p-0"
					{...input}
				/>
			</div>
		)
	}

	onCoinSelected(coin) {
		const pathname = this.props.router.pathname
		if (pathname === '/')
			Router.push(
				`${pathname === '/' ? pathname : pathname + '/'}?buy=${_.kebabCase(
					coin.FullName
				)}`,
				`${pathname === '/' ? pathname : pathname}${_.kebabCase(coin.SeoURL)}`
			)
		this.props.setCurrentAsset(coin.Name)
		this.setState({
			toggleCoin: false,
			coinSearch: ''
		})
	}

	onCurrencySelected(currency) {
		this.setState(
			{
				currencySelected: currency,
				toggleCurrency: false
			},
			() => this.fetchCalls()
		)
	}

	updateLimit({ constants }) {
		// this.setState({
		//   limit: props.limit.limit ? props.limit.limit : this.state.limit,
		//   limits: props.quote.Limits ? props.quote.Limits : this.state.limits
		// })

		if (constants) {
			let interval = constants.Frame1Refresh
			let refreshTime = constants.Frame2Refresh
			if (this.state.interval != interval && this.state.active) {
				this.initInterval(interval)
				this.setState({ interval })
			}
			if (this.state.reviewRefreshTime != refreshTime) {
				this.setState({ reviewRefreshTime: refreshTime })
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
			Object.keys(props.assets.status).forEach((assetPair, index) => {
				if (assetPair.startsWith(this.state.currencySelected.Name)) {
					const asset = props.assets.status[assetPair]
					const coin = props.assets.list.Receive.find(
						coin =>
							assetPair === `${this.state.currencySelected.Name}${coin.Name}`
					)
					if (
						coin &&
						coin.ShowCalculator === true &&
						coin.ShowGlobal === true
					) {
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
			const coinParam = props.assets.currentAsset
			const nextCoin = coinParam
				? updatedCoins.find(coin => coin.Name === coinParam)
				: updatedCoins.find(
					coin =>
						coin.SeoURL.toLowerCase() ===
						this.props.router.asPath.toLowerCase()
				)
			const coinSelected = nextCoin
				? nextCoin
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
					if (prev !== coinSelected.Name) {
						this.fetchCalls()
					}
				}
			)
		}
	}

	renderButton() {
		const { coinSelected } = this.state
		const available = coinSelected && coinSelected.Status === 'AVAILABLE'
		return (
			<button
				type="submit"
				style={{ cursor: 'pointer' }}
				className={cn(
					'btn-block btn-lg btn-exchange text-white no-border btn-success',
					!available ? 'unavailable' : null
				)}
				onClick={e => {
					e.preventDefault()
					if (available) {
						Router.push('/exchange')
					}
				}}>
				{available ? 'Instant Exchange' : 'Currently unavailable'}
			</button>
		)
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

	autoScroll() {
		if (document && document.documentElement.clientWidth < 992) {
			const calcWrapper = document.querySelector('.calculator-wrapper')
			if (calcWrapper) {
				if (this.props.router.pathname === '/dashboard')
					document.querySelector('.dashboard-page').scrollBy({
						top: calcWrapper.getBoundingClientRect().top - 24,
						behavior: 'smooth'
					})
				else
					window.scrollBy({
						top: calcWrapper.getBoundingClientRect().top - 20 || 330,
						behavior: 'smooth'
					})
			}
		}
	}

	toggleDropDown(type) {
		this.autoScroll()
		if (type === 'currency') {
			if (!this.state.toggleCurrency) this.props.fetchAssetsStatus()
			this.setState({
				toggleCurrency: !this.state.toggleCurrency,
				toggleCoin: false,
				coinSearch: ''
			})
		} else if (type === 'coin') {
			if (!this.state.toggleCoin) this.props.fetchAssetsStatus()
			this.setState(
				{ toggleCoin: !this.state.toggleCoin, coinSearch: '' },
				() => {
					const searchInput = document.querySelector('.search-input')
					if (this.state.toggleCoin) {
						searchInput.focus()
					}
				}
			)
		}
	}

	render() {
		const { sendAmount, receiveAmount, quote } = this.props
		const { Message } = quote
		let coins = this.state.coins
		let currencies = this.state.currencies
		if (this.state.coinSearch)
			coins = this.state.coins.filter(coin => this.filterCoins(coin))

		return (
			<div>
				<form>
					<div className="calc-input-wrapper">
						<label
							className={cn(
								'field-label m-0',
								(sendAmount || receiveAmount) && Message ? 'invalid' : null
							)}>
							{(sendAmount || receiveAmount) && Message ? Message : 'You send'}
						</label>
						<div className="calc-field">
							<div className="col-6 bg-input">
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
							<div className="col-6 px-0 d-flex align-items-center">
								<div className="dropdown dropdown-currency-select">
									<a
										className="btn dropdown-toggle"
										// href={
										// 	// document && document.documentElement.clientWidth > 992
										// 	// ?
										// 	'#'
										// 	// : '#main-calc'
										// }
										role="button"
										id="dropdownMenuLink"
										onClick={() => this.toggleDropDown('currency')}>
										{this.state.currencySelected && (
											<div className="text-label currency-label">
												<div className="currency-symbol-wrapper">
													<img
														className="currency-symbol"
														src={this.state.currencySelected.Image}
														alt={this.state.currencySelected.Name}
														onError={({ target }) => {
															if (target.src !== '/static/images/ph-icon.svg')
																target.src = '/static/images/ph-icon.svg'
														}}
													/>
												</div>
												<span
													className="text-left"
													style={{ minWidth: '46px' }}>
													{this.state.currencySelected.Name}
												</span>
												<img
													className="dropdown-arrow"
													src="/static/images/arrow-down.svg"
													alt="Dropdown"
												/>
											</div>
										)}
									</a>
									{this.state.toggleCurrency && (
										<div
											className="dropdown-menu show"
											aria-labelledby="dropdownMenuLink">
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
						<label className="field-label">You receive</label>
						<div className="calc-field">
							<div className="col-6 bg-input">
								<Field
									name="receiveAmount"
									component={this.renderField}
									normalize={this.normalizeReceiveAmount}
									placeholder={!this.state.rate || Message ? '0.00000000' : this.toReceiveAmount(
										this.state.placeholderSendAmount
									).toFixed(8)}
								/>
							</div>
							<div className="col-6 px-0 d-flex align-items-center">
								<div className="dropdown dropdown-currency-select">
									<a
										className="btn dropdown-toggle"
										// href={
										// 	document.documentElement.clientWidth > 992
										// 		? '#'
										// 		: '#main-calc'
										// }
										role="button"
										id="dropdownMenuLink"
										onClick={() => this.toggleDropDown('coin')}>
										{this.state.coinSelected != null && (
											<div className="text-label currency-label">
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
						<h6 className="exchange-rate-label">
							Exchange Rate: {/* <b> */}
							{!this.state.rate || Message
								? '-/-'
								: this.state.rate.toFixed(
									this.state.currencySelected
										? this.state.currencySelected.Dp
										: 2
								) +
								' ' +
								(this.state.currencySelected
									? this.state.currencySelected.Name
									: 'GBP') +
								'/' +
								(this.state.coinSelected
									? this.state.coinSelected.Name
									: 'BTC') +
								' '}
							{/* </b> */}
						</h6>
						<div className="am row">
							<div className="col-md-12">{this.renderButton()}</div>
						</div>
					</div>
				</form>
			</div>
		)
	}

	toReceiveAmount(amount) {
		console.log(this.state.rate);
		return !amount || !this.state.rate ? 0 : amount / this.state.rate
	}
}

const ExchangeableItem = ({ exchangeable, onItemSelected, unavailable }) => (
	<div>
		{
			<a
				className={cn('dropdown-item', unavailable ? 'unavailable' : null)}
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

const debouceSend = _.debounce(
	(props, sendAmount, currency, coin) => {
		props.fetchQuote({
			SendCurrency: currency,
			ReceiveCurrency: coin,
			SendAmount: parseFloat(sendAmount)
		})
	},
	500,
	{ trailing: true }
)

const debouceReceive = _.debounce(
	(props, receiveAmount, currency, coin) => {
		props.fetchQuote({
			SendCurrency: currency,
			ReceiveCurrency: coin,
			ReceiveAmount: parseFloat(receiveAmount)
		})
	},
	500,
	{ trailing: true }
)

const mapStateToProps = state => {
	const selector = formValueSelector('CalcForm')
	const sendAmount = parseFloat(selector(state, 'sendAmount'))
	const receiveAmount = parseFloat(selector(state, 'receiveAmount'))

	return {
		quote: state.quote,
		assets: state.assets,
		constants: state.constants,
		sendAmount,
		receiveAmount
	}
}

const mapDispatchToProps = {
	fetchAssetsList,
	fetchAssetsStatus,
	fetchQuote,
	fetchConsts,
	setCurrentAsset
}

export default reduxForm({ form: 'CalcForm', destroyOnUnmount: false })(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(withRouter(Calculator))
)
