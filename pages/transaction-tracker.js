import React, { Component } from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import Moment from 'react-moment'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import {
	abandonOrder,
	getStatus,
	fetchConsts,
	hideTransactionAlert,
	validateSession
} from '../store/actions'

import Header from '../components/Header'
import TransactionAlert from '../components/dashboard/TransactionAlert'
import AbandonOrder from '../components/transaction-tracker/AbandonOrder'

class TransactionTracker extends Component {
	constructor() {
		super()
		this.state = {
			timerId: null,
			refreshTime: 10,
			abandonOrderModal: false,
			ctUser: null
		}
		this.initInterval = this.initInterval.bind(this)
		this.fetchStatus = this.fetchStatus.bind(this)
	}

	componentDidMount() {
		this.fetchStatus()
		this.initInterval()
	}

	componentWillUnmount() {
		this.props.hideTransactionAlert()
		clearInterval(this.state.timerId)
	}

	initInterval() {
		clearInterval(this.state.timerId)
		const timerId = setInterval(this.fetchStatus, this.state.refreshTime * 1000)
		this.setState({ timerId })
	}

	fetchStatus() {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.setState({ ctUser })
			this.props
				.getStatus({
					orderId: this.props.router.query.txnID,
					ctUser
				})
				.then(res => {
					if (res.status === 202) {
						Router.push(
							`/transaction-expired?txnID=${this.props.router.query.txnID}`,
							`/transaction-expired`
						)
					}
				})
		} else {
			const redirectPath =
				this.props.router.pathname + '/' + this.props.router.query.txnID
			Router.push(`/login?redirectPath=${redirectPath}`)
		}
	}

	render() {
		const { loading, status } = this.props.order
		return (
			<div className="full-height" style={{ backgroundColor: '#f4f7fa' }}>
				<Head>
					<title>Transaction Tracker | Cointec</title>
				</Head>

				{this.props.globals.transactionAlert && (
					<TransactionAlert>
						<p>Transaction already in progress</p>
					</TransactionAlert>
				)}

				<Header background="solid">
					<Nav heading="Transaction tracker" cancelLink="/dashboard" />
				</Header>

				<div className="container">
					<div className="row justify-content-center">
						{/* {!this.props.order.error && ( */}
						<div className="col-12 col-md-8 col-lg-6 col-xl-5 px-lg-4 text-center">
							<div className="form-title-wrapper d-none d-md-flex">
								<img src="/static/images/science.svg" alt="form-icon" />
								<h4 className="form-title">Transaction tracker</h4>
							</div>
							<div className="transaction-tracker-wrapper">
								{status && (
									<TransactionStatus
										Status={status.Status}
										Order={status.Order}
										ExchangeTransactions={status.ExchangeTransactions}
										cancelOrder={() =>
											this.setState({ abandonOrderModal: true })
										}
										loading={loading}
									/>
								)}
							</div>
						</div>
						{/* )} */}
						{/* {this.props.order.error && (
							<div
								className="col-12 col-md-8 col-lg-6 col-xl-5 px-lg-4 text-center"
								style={{ marginTop: 120 }}>
								<div className="alert-box">
									<div className="alert-header">
										<h6 className="heading text-left">
											Transaction {this.props.router.query.txnID} not found
										</h6>
									</div>
									<div className="alert-body">
										<p className="message-text">
											We were unable to find this transaction. Visit your{' '}
											<Link href="/transactions">
												<a>transaction history</a>
											</Link>{' '}
											to see all pending and historic transactions.
										</p>
									</div>
								</div>
							</div>
						)} */}
					</div>
				</div>

				{this.state.abandonOrderModal && (
					<AbandonOrder
						txnID={this.props.router.query.txnID}
						ctUser={this.props.auth.ctUser}
						onClose={() => this.setState({ abandonOrderModal: false })}
					/>
				)}
			</div>
		)
	}

	componentWillReceiveProps(props) {
		if (props.order.error) {
			clearInterval(this.state.timerId)
		}
		const Status = get(props.order.status, 'Order.Status')
		if (Status === 'PAYMENT') {
			Router.push('/exchange')
		}
	}
}

const TransactionStatus = ({
	Status: {
		CLEARING,
		EXPIRED,
		SETTLED,
		REVIEW,
		TERMINATED,
		SENT,
		FAILED,
		ABANDONED,
		HASHNOTFOUND
	},
	ExchangeTransactions,
	Order,
	cancelOrder
}) => {
	const { DestinationWallet, ...Data } = ExchangeTransactions
	const exchangePairs = Order.Source.split(',').filter(
		pair => !pair.includes('Commission')
	)
	const [pair] = exchangePairs.reverse()
	const exchangeName = pair.split(':')[0].toUpperCase()
	const Exchange =
		Data &&
		Object.keys(Data).length &&
		Data[Object.keys(Data).find(txn => txn.includes(exchangeName))]
	// const Exchange =
	// 	Data && Object.keys(Data).length && Data[Object.keys(Data).reverse()[0]]
	const cancelled = ABANDONED || EXPIRED
	return (
		<div>
			{(cancelled || (TERMINATED && !CLEARING)) && (
				<TransactionCancelled
					ABANDONED={ABANDONED}
					EXPIRED={EXPIRED}
					TERMINATED={TERMINATED}
				/>
			)}
			{!(cancelled || (TERMINATED && !CLEARING)) && (
				<PaymentSent CLEARING={CLEARING} FAILED={FAILED} />
			)}
			{!(cancelled || (TERMINATED && !CLEARING)) && (
				<PaymentReceived
					CLEARING={CLEARING}
					REVIEW={REVIEW}
					TERMINATED={TERMINATED}
					SETTLED={SETTLED}
					FAILED={FAILED}
				/>
			)}
			{!(cancelled || (TERMINATED && !CLEARING)) && (CLEARING && !FAILED) && (
				<CoinSent
					Exchange={Exchange}
					DestinationWallet={DestinationWallet}
					SETTLED={SETTLED}
					FAILED={FAILED}
					TERMINATED={TERMINATED}
					SENT={SENT}
					HASHNOTFOUND={HASHNOTFOUND}
					Order={Order}
				/>
			)}
			{!(
				SETTLED ||
				REVIEW ||
				TERMINATED ||
				SENT ||
				FAILED ||
				ABANDONED ||
				EXPIRED
			) ? (
				<div className="cancel-transaction-link mt-3 text-left">
					Changed your mind?{' '}
					<a href="javascript:void(0)" onClick={cancelOrder}>
						Cancel the transaction
					</a>
				</div>
			) : (
				''
			)}
		</div>
	)
}

const TransactionCancelled = ({ ABANDONED, EXPIRED, TERMINATED }) => (
	<div className="coin-sent-wrapper error mt-3">
		<div className="d-flex justify-content-between card-tracking">
			<div>
				<i className="far fa-times fa-lg mr-3" />
				{ABANDONED
					? 'Transaction cancelled'
					: TERMINATED
					? 'Transaction error'
					: 'Transaction expired'}
			</div>
			<span className="transaction-time">
				{ABANDONED ? (
					<Moment format="hh:mm A">{ABANDONED * 1000}</Moment>
				) : TERMINATED ? (
					<Moment format="hh:mm A">{TERMINATED * 1000}</Moment>
				) : (
					<Moment format="hh:mm A">{EXPIRED * 1000}</Moment>
				)}
			</span>
		</div>
		{ABANDONED && (
			<div className="description">
				{/* We have recieved your refund request. We will be in touch within 24
				hours to arrange payment. */}
				You have cancelled the transaction.
			</div>
		)}
		{TERMINATED && (
			<div className="description">
				Sorry, we were unable to fulfill your order. Any payments received from
				your account will be refunded within 2 business days.
			</div>
		)}
		{!ABANDONED && !TERMINATED && (
			<div className="description">
				Sorry, we were unable to fulfill your order. Any payments received from
				your account will be refunded within 2 business days.
			</div>
		)}
		<Link href="/dashboard">
			<a className="btn-follow-blockchain">
				<i className="fas fa-paper-plane" />
				Return to dashboard
			</a>
		</Link>
	</div>
)

const PaymentSent = ({ CLEARING, FAILED }) => {
	const iconClass = cn(
		'far',
		'fa-lg mr-3',
		FAILED || CLEARING ? 'fa-check' : 'fa-spinner-third fa-spin'
	)
	return (
		<div className={cn('d-flex justify-content-between card-tracking')}>
			<div>
				<i className={iconClass} />
				You sent payment
			</div>
			<span className="transaction-time">
				{CLEARING && <Moment format="hh:mm A">{CLEARING * 1000}</Moment>}
			</span>
		</div>
	)
}

const PaymentReceived = ({ CLEARING, REVIEW, TERMINATED, SETTLED, FAILED }) => {
	return CLEARING ? (
		<div
			className={cn(
				'coin-sent-wrapper mt-3',
				(REVIEW || TERMINATED) && !SETTLED
					? 'error'
					: !SETTLED
					? 'in-progress'
					: ''
			)}>
			<div
				className={cn(
					'd-flex justify-content-between card-tracking',
					(REVIEW || TERMINATED) && !SETTLED
						? 'error'
						: !SETTLED
						? 'in-progress'
						: ''
				)}>
				<div>
					{(REVIEW || TERMINATED) && !SETTLED ? (
						<i className="far fa-times fa-lg mr-3" />
					) : !SETTLED ? (
						<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
					) : (
						<i className="far fa-check fa-lg mr-3" />
					)}
					{(REVIEW || TERMINATED) && !SETTLED
						? 'Payment error'
						: 'We received payment'}
				</div>
				<span className="transaction-time">
					{SETTLED ? (
						<Moment format="hh:mm A">{SETTLED * 1000}</Moment>
					) : TERMINATED ? (
						<Moment format="hh:mm A">{TERMINATED * 1000}</Moment>
					) : REVIEW ? (
						<Moment format="hh:mm A">{REVIEW * 1000}</Moment>
					) : (
						''
					)}
				</span>
			</div>
			{(REVIEW || TERMINATED) && !SETTLED ? (
				<div className="description">
					Sorry, we were unable to fulfill your order. Any payments received
					from your account will be refunded within 2 business days.
				</div>
			) : (
				''
			)}
		</div>
	) : FAILED && !CLEARING ? (
		<div className="coin-sent-wrapper mt-3 error">
			<div className="d-flex justify-content-between card-tracking error">
				<div>
					<i className="far fa-times fa-lg mr-3" />
					No payment received
				</div>
			</div>
			<div className="description">
				Sorry, your order has been cancelled as we have not received your
				payment. If you have made a payment,{' '}
				<Link href="/">
					<a style={{ fontWeight: 600 }}>contact us.</a>
				</Link>
			</div>
			<Link href="/dashboard">
				<a className="btn-follow-blockchain">Return to dashboard</a>
			</Link>
		</div>
	) : (
		<div className="d-flex justify-content-between card-tracking disabled mt-3">
			<div>
				<i className="far fa-minus fa-lg mr-3" />
				We received payment
			</div>
		</div>
	)
}

const CoinSent = ({
	Exchange,
	DestinationWallet,
	SETTLED,
	FAILED,
	TERMINATED,
	SENT,
	HASHNOTFOUND,
	Order
}) => {
	return SETTLED ? (
		<div
			className={cn(
				'coin-sent-wrapper mt-3',
				FAILED || TERMINATED
					? 'error'
					: !SENT
					? 'in-progress'
					: SENT
					? 'sent'
					: ''
			)}>
			<div className="d-flex justify-content-between card-tracking">
				<div>
					{!(FAILED || TERMINATED) && !SETTLED ? (
						<i className="far fa-minus fa-lg mr-3" />
					) : FAILED || TERMINATED ? (
						<i className="far fa-times fa-lg mr-3" />
					) : !SENT ? (
						<i className="fas fa-spinner-third fa-lg fa-spin mr-3" />
					) : (
						<i className="far fa-check fa-lg mr-3" />
					)}
					{FAILED || TERMINATED ? 'Transaction error' : 'Assets Sent'}
				</div>
				<span className="transaction-time">
					{TERMINATED ? (
						<Moment format="hh:mm A">{TERMINATED * 1000}</Moment>
					) : FAILED ? (
						<Moment format="hh:mm A">{FAILED * 1000}</Moment>
					) : (
						SENT && <Moment format="hh:mm A">{SENT * 1000}</Moment>
					)}
				</span>
			</div>
			{FAILED || TERMINATED ? (
				<div className="description">
					Sorry, we were unable to fulfill your order. Any payments received
					from your account will be refunded within 2 business days.
				</div>
			) : SENT ? (
				<div className="description">
					<b>
						{Order.DestAmount} {Order.DestCurrency}
					</b>{' '}
					was sent to your external wallet. Your coins are on the blockchain on
					the way to your wallet.
				</div>
			) : (
				''
			)}
			{!(FAILED || TERMINATED) && DestinationWallet ? (
				HASHNOTFOUND ? (
					<a
						href={DestinationWallet.Address}
						className="btn-follow-blockchain"
						target="_blank">
						<i className="fas fa-paper-plane" />
						Follow on the blockchain
					</a>
				) : Exchange &&
				  !Exchange.TransactionHash.includes(Exchange.ExchangeId) ? (
					<a
						href={Exchange.TransactionHash}
						className="btn-follow-blockchain"
						target="_blank">
						<i className="fas fa-paper-plane" />
						Follow on the blockchain
					</a>
				) : (
					''
				)
			) : (
				''
			)}
			{FAILED || TERMINATED ? (
				<Link href="/dashboard">
					<a className="btn-follow-blockchain">
						<i className="fas fa-paper-plane" />
						Return to dashboard
					</a>
				</Link>
			) : (
				''
			)}
		</div>
	) : (
		<div className="d-flex justify-content-between card-tracking disabled mt-3">
			<div>
				<i className="far fa-minus fa-lg mr-3" />
				Assets Sent
			</div>
		</div>
	)
}

const Nav = ({ heading, cancelLink = '/' }) => (
	<div className="container">
		<nav className="navbar navbar-custom navbar-expand-lg navbar-dark px-0 py-3 py-md-3">
			<div className="col-8 d-none d-md-flex">
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
			<div className="col-8 d-block d-md-none">
				<h5 className="exchange-heading">{heading}</h5>
			</div>

			<ul className="col-4 navbar-nav justify-content-end align-items-lg-center text-right">
				<li className="nav-item">
					<Link href={cancelLink}>
						<a className="nav-link">
							<i className="far fa-times" />
						</a>
					</Link>
				</li>
			</ul>
		</nav>
	</div>
)

export default connect(
	({ auth, order, globals }) => ({ auth, order, globals }),
	{
		abandonOrder,
		getStatus,
		fetchConsts,
		hideTransactionAlert,
		validateSession
	}
)(withRouter(TransactionTracker))

TransactionTracker.propTypes = {
	heading: PropTypes.string
}
