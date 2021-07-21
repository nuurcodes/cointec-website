import React, { Component } from 'react'
import Link from 'next/link'
import Clipboard from 'react-clipboard.js'
import cn from 'classnames'

class TransactionDetail extends Component {
	constructor() {
		super()
		this.state = {
			closed: false
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
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
				node => node.className === 'modal-dialog modal-transaction-detail'
			)
		if (!select) {
			this.onClose()
		}
	}

	render() {
		const { transaction } = this.props
		const linkProps =
			transaction.status === 'COMPLETED'
				? {
						href: transaction.ledgerTxnId
				  }
				: {
						href: `/transaction-tracker?txnID=${transaction.ctTransactionId}`,
						as: `/transaction-tracker/${transaction.ctTransactionId}`
				  }
		return (
			<div
				className="modal fade show"
				id="abandon-order-modal"
				role="dialog"
				data-backdrop="false"
				style={{ display: 'block' }}>
				<div
					className="modal-dialog modal-transaction-detail"
					role="document"
					style={{ transform: this.state.closed ? 'translateY(-120%)' : '' }}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-heading text-left">Transaction detail</h5>
							<button type="button" className="close" onClick={this.onClose}>
								<i className="far fa-times fa-sm" />
							</button>
						</div>
						<div className="modal-body">
							<div className="transaction-details">
								<div className="transaction-field">
									<h6 className="field-label">Transaction status</h6>
									<p
										className={cn(
											'field-value status',
											transaction.status === 'COMPLETED'
												? 'completed'
												: transaction.status === 'FAILED' ||
												  transaction.status === 'CANCELLED'
												? 'failed'
												: ''
										)}>
										{transaction.status}
									</p>
								</div>
								<div className="transaction-field">
									<h6 className="field-label">Send amount</h6>
									<p className="field-value">
										{transaction.sourceAmount.toFixed(
											transaction.sourceCurrency === 'GBP' ? 2 : 8
										)}{' '}
										{transaction.sourceCurrency}
									</p>
								</div>
								<div className="transaction-field">
									<h6 className="field-label">Receive amount</h6>
									<p className="field-value">
										{transaction.destAmount.toFixed(8)}{' '}
										{transaction.destCurrency}
									</p>
								</div>
								<div className="transaction-field position-relative">
									<h6 className="field-label">Wallet address</h6>
									<p className="field-value">
										<a href={transaction.destLink} target="_blank">
											{transaction.dest}
										</a>
										<Clipboard
											data-clipboard-text={transaction.dest}
											onClick={() =>
												this.setState({ showTooltip: true }, () => {
													setTimeout(() => {
														this.setState({
															showTooltip: false
														})
													}, 2000)
												})
											}>
											<i className="far fa-clone" />
										</Clipboard>
										<Tooltip visible={this.state.showTooltip} data="Copied!" />
									</p>
								</div>
								<div className="transaction-field">
									<h6 className="field-label">Exchange rate</h6>
									<p className="field-value">
										{parseFloat(transaction.exchangeRate).toFixed(4)}{' '}
										{transaction.sourceCurrency}/{transaction.destCurrency}
									</p>
								</div>
								<div className="transaction-field">
									<h6 className="field-label">Identifier</h6>
									<p className="field-value">{transaction.ctTransactionId}</p>
								</div>
							</div>

							<Link {...linkProps}>
								<a
									target={transaction.status === 'COMPLETED' ? '_blank' : ''}
									className="blockchain-tracker"
									style={{ display: 'block', textDecoration: 'none' }}>
									{transaction.status === 'COMPLETED'
										? 'Blockchain tracker'
										: 'Transaction tracker'}
									<i className="far fa-external-link" />
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const Tooltip = ({ visible, data }) => {
	return visible === true ? (
		<span className="copied-tooltip">{data}</span>
	) : null
}

export default TransactionDetail
