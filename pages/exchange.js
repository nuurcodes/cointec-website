import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import Cookie from 'js-cookie'
import cn from 'classnames'
import { connect } from 'react-redux'

import Header from '../components/Header'
import Calculator from '../components/exchange/Calculator'
import OrderSummary from '../components/exchange/OrderSummary'
import BankTransfer from '../components/exchange/BankTransfer'
import AddBankAccount from '../components/account-settings/AddBankAccount'
import StickyFooter from '../components/StickyFooter'

import { validateSession, getPendingOrder } from '../store/actions'

class Exchange extends Component {
	constructor() {
		super()
		this.state = {
			sendAmount: 0,
			initialSendAmount: 0,
			receiveAmount: 0,
			sendCurrency: 'GBP',
			receiveCurrency: 'BTC',
			action: 'sending',
			rate: 1200,
			wallet: null,
			ctUser: null,
			step: 1,
			addBankAccountModal: false,
			scrolling: false
		}

		this.next = this.next.bind(this)
		this.back = this.back.bind(this)
		this.onConfirm = this.onConfirm.bind(this)
		this.onRestart = this.onRestart.bind(this)
		this.onRateChange = this.onRateChange.bind(this)
		this.renderAmountFrame = this.renderAmountFrame.bind(this)
		this.renderSummaryFrame = this.renderSummaryFrame.bind(this)
		this.renderPaymentFrame = this.renderPaymentFrame.bind(this)
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			this.props.getPendingOrder()
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}

		addEventListener('resize', this.onResize)
		this.onResize()
	}

	componentWillUnmount() {
		removeEventListener('resize', this.onResize)
	}

	onResize = () => {
		const element = document.querySelector('.exchange-page')
		const documentElement = document.documentElement

		this.setState({
			scrolling:
				element && documentElement
					? documentElement.clientHeight < element.scrollHeight
					: false,
			docWidth: documentElement.clientWidth
		})
	}

	next(state) {
		console.log('next', state)
		this.setState(
			{
				...state,
				step: this.state.step + 1
			},
			() => this.onResize()
		)
	}

	back() {
		this.setState({
			step: this.state.step - 1
		})
	}

	onConfirm({ txnID }) {
		Router.push(`/transaction-tracker/${txnID}`)
	}

	onRestart() {
		this.setState(
			{
				step: 1
			},
			() => this.onResize()
		)
	}

	onRateChange(state) {
		this.setState({ ...state })
	}

	render() {
		const { docWidth } = this.state
		return (
			<div
				className="exchange-page full-height"
				style={{ backgroundColor: '#F7F9FA', position: 'absolute' }}>
				<Head>
					<title>Exchange | Cointec</title>
				</Head>
				<Header background="solid">
					<Nav
						step={this.state.step}
						setStep={step => this.setState({ step }, () => this.onResize())}
					/>
				</Header>

				<div className="container">
					<div className="row justify-content-center mb-5">
						<div className="main-wrapper">
							<InnerNav
								step={this.state.step}
								setStep={step => this.setState({ step }, () => this.onResize())}
							/>
							{this.state.step === 1 && this.renderAmountFrame()}
							{this.state.step === 2 && this.renderSummaryFrame()}
							{this.state.step === 3 && this.renderPaymentFrame()}
						</div>
					</div>
				</div>

				<StickyFooter className="bg-white" fixed={!this.state.scrolling} />
				{this.state.addBankAccountModal && (
					<AddBankAccount
						ctUser={this.props.auth.ctUser}
						onClose={() => this.setState({ addBankAccountModal: false })}
					/>
				)}
				<style jsx global>{`
					html {
						background: #f7f9fa;
					}
					#intercom-container {
						display: ${docWidth > 768 ? 'block' : 'none'};
					}
				`}</style>
			</div>
		)
	}

	renderAmountFrame() {
		return (
			<div>
				<div className="form-title-wrapper d-none d-md-flex">
					<img src="/static/images/science.svg" alt="form-icon" />
					<h4 className="form-title">Instant exchange</h4>
				</div>
				<Calculator ctUser={this.props.auth.ctUser} onConfirm={this.next} />
				<p className="terms-statment text-left">
					By continuing you accept our{' '}
					<Link href="/terms">
						<a>Terms of Use</a>
					</Link>
				</p>
			</div>
		)
	}

	renderSummaryFrame() {
		return (
			<div>
				<div className="form-title-wrapper d-none d-md-flex">
					<img src="/static/images/science.svg" alt="form-icon" />
					<h4 className="form-title">Order summary</h4>
				</div>
				<OrderSummary
					sendAmount={this.state.sendAmount}
					initialSendAmount={this.state.initialSendAmount}
					receiveAmount={this.state.receiveAmount}
					sendCurrency={this.state.sendCurrency}
					receiveCurrency={this.state.receiveCurrency}
					ctUser={this.props.auth.ctUser}
					action={this.state.action}
					wallet={this.state.wallet}
					rate={this.state.rate}
					onRateChange={this.onRateChange}
					onConfirm={this.next}
				/>
			</div>
		)
	}

	renderPaymentFrame() {
		return (
			<div>
				<div className="form-title-wrapper d-none d-md-flex">
					<img src="/static/images/science.svg" alt="form-icon" />
					<h4 className="form-title">Make payment</h4>
				</div>
				<BankTransfer
					sendAmount={this.state.sendAmount}
					receiveAmount={this.state.receiveAmount}
					sendCurrency={this.state.sendCurrency}
					receiveCurrency={this.state.receiveCurrency}
					wallet={this.state.wallet}
					rate={this.state.rate}
					ctUser={parseInt(this.props.auth.ctUser)}
					txnID={this.state.txnID}
					onConfirm={this.onConfirm}
					onRestart={this.onRestart}
					onAddAccount={() => this.setState({ addBankAccountModal: true })}
				/>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { pendingStatus } = props.order
		if (pendingStatus) {
			const { Order, Status } = pendingStatus
			const orderStatus = Status ? Object.keys(Status) : []

			if (Status) {
				if (orderStatus.includes('CLEARING')) {
					Router.push(`/transaction-tracker/${Order.TxnId}`)
				} else if (orderStatus.includes('PAYMENT')) {
					this.setState({
						sendAmount: parseFloat(Order.SourceAmount),
						receiveAmount: parseFloat(Order.DestAmount),
						sendCurrency: Order.SourceCurrency,
						receiveCurrency: Order.DestCurrency,
						wallet: Order.Destination,
						txnID: parseInt(Order.TxnId),
						step: 3
					})
				}
			}
		}

		this.onResize()
	}
}

const Nav = props => (
	<div className="container">
		<nav className="navbar navbar-custom navbar-expand-lg navbar-exchange">
			<div className="col-3 d-none d-md-flex">
				<Link href="/">
					<a className="navbar-brand">
						<img
							src="/static/images/footer-logo.svg"
							className="img-fluid mx-auto d-block"
							alt="Logo"
						/>
					</a>
				</Link>
			</div>
			<div
				className={cn(
					'col-6 exchange-nav d-none d-md-block',
					props.step === 2 ? 'step-2' : props.step === 3 ? 'step-3' : ''
				)}>
				<ul>
					<li
						className={cn(
							props.step === 1 ? 'active' : props.step > 1 ? 'passed' : ''
						)}
						onClick={props.step >= 2 ? () => props.setStep(1) : null}>
						Amount
					</li>
					<li
						className={cn(
							props.step === 2 ? 'active' : props.step > 2 ? 'passed' : ''
						)}
						onClick={props.step === 3 ? () => props.setStep(2) : null}>
						Summary
					</li>
					<li className={cn(props.step === 3 ? 'active' : '')}>Payment</li>
				</ul>
			</div>

			<div className="col-6 d-block d-md-none p-0">
				<h5 className="exchange-heading">
					{props.step === 1 && 'Enter amount'}
					{props.step === 2 && 'Order summary'}
					{props.step === 3 && 'Make payment'}
				</h5>
			</div>

			<ul className="col-6 col-md-3 navbar-nav justify-content-end align-items-lg-center text-right">
				<li className="nav-item">
					<Link href="/dashboard">
						<a className="nav-link px-0">
							<i className="far fa-times" />
						</a>
					</Link>
				</li>
			</ul>
		</nav>
	</div>
)

const InnerNav = props => (
	<div
		className={cn(
			'exchange-nav inner d-block d-md-none',
			props.step === 2 ? 'step-2' : props.step === 3 ? 'step-3' : ''
		)}>
		<ul>
			<li
				className={cn(
					props.step === 1 ? 'active' : props.step > 1 ? 'passed' : ''
				)}
				onClick={props.step >= 2 ? () => props.setStep(1) : null}
			/>
			<li
				className={cn(
					props.step === 2 ? 'active' : props.step > 2 ? 'passed' : ''
				)}
				onClick={props.step === 3 ? () => props.setStep(2) : null}
			/>
			<li className={cn(props.step === 3 ? 'active' : '')} />
		</ul>
	</div>
)

export default connect(
	({ auth, order }) => ({ auth, order }),
	{ validateSession, getPendingOrder }
)(withRouter(Exchange))
