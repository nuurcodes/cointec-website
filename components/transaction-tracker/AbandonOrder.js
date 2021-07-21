import React, { Component } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import WrongPayment from './WrongPayee'
import AddRefundAccount from './AddRefundAccount'
import WrongPayee from './WrongPayee'
import NoPayment from './NoPayment'

class AbandonOrder extends Component {
	constructor() {
		super()
		this.state = {
			reason: null,
			addRefundAccount: false
		}
		this.reasonSelected = this.reasonSelected.bind(this)
		this.handleRefundAccount = this.handleRefundAccount.bind(this)
		this.back = this.back.bind(this)
		this.onClose = this.onClose.bind(this)
		this.getTitle = this.getTitle.bind(this)
	}

	getTitle() {
		const { reason, addRefundAccount } = this.state
		let title = 'Select what went wrong'
		if (reason) {
			if (reason === 'WRONGAMOUNT') {
				title = addRefundAccount
					? 'Add your refund account'
					: 'I sent the wrong amount of GBP'
			} else if (reason === 'WRONGPAYEE') {
				title = 'I sent to the wrong payee'
			} else if (reason === 'NOPAYMENT') {
				title = 'I did not make payment'
			}
		}
		return title
	}

	reasonSelected(reason) {
		this.setState({ reason, addRefundAccount: false })
	}

	handleRefundAccount() {
		this.setState({ addRefundAccount: true })
	}

	back() {
		this.setState({
			reason: null,
			addRefundAccount: false
		})
	}

	onClose() {
		this.props.onClose()
	}

	render() {
		return (
			<div
				className="modal fade show"
				id="abandon-order-modal"
				role="dialog"
				data-backdrop="false"
				style={{ display: 'block' }}>
				<div className="modal-dialog modal-abandon" role="document">
					<div className="modal-content">
						<div className="modal-body">
							<button type="button" className="close" onClick={this.onClose}>
								<span aria-hidden="true">&times;</span>
							</button>

							<h5 className="modal-heading text-left">
								{this.state.reason && (
									<a
										className="back"
										onClick={
											!this.state.addRefundAccount
												? this.back
												: () => this.reasonSelected('WRONGAMOUNT')
										}>
										<i className="far fa-arrow-left" />
									</a>
								)}
								{this.getTitle()}
							</h5>
							<hr />

							{!this.state.reason && (
								<SelectReason reasonSelected={this.reasonSelected} />
							)}
							{this.state.reason === 'WRONGAMOUNT' &&
								(!this.state.addRefundAccount ? (
									<WrongPayment
										txnID={this.props.txnID}
										ctUser={this.props.ctUser}
										reason={'WRONGAMOUNT'}
										addRefundAccount={this.state.addRefundAccount}
										handleRefundAccount={this.handleRefundAccount}
										onSubmit={this.onClose}
									/>
								) : (
									<AddRefundAccount />
								))}
							{this.state.reason === 'WRONGPAYEE' && (
								<WrongPayee
									reason={'WRONGPAYEE'}
									txnID={this.props.txnID}
									ctUser={this.props.ctUser}
									onSubmit={this.onClose}
								/>
							)}
							{this.state.reason === 'NOPAYMENT' && (
								<NoPayment
									txnID={this.props.txnID}
									ctUser={this.props.ctUser}
									onSubmit={this.onClose}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const SelectReason = ({ reasonSelected }) => (
	<div>
		<div>
			<button
				className="btn btn-option"
				onClick={() => reasonSelected('WRONGAMOUNT')}>
				I sent the wrong amount of GBP
			</button>
			<button
				className="btn btn-option"
				onClick={() => reasonSelected('WRONGPAYEE')}>
				I sent to the wrong payee
			</button>
			<button
				className="btn btn-option"
				onClick={() => reasonSelected('NOPAYMENT')}>
				I did not make payment
			</button>
		</div>

		<p className="my-3">
			Can’t find what you’re looking for?{' '}
			<Link href="/">
				<a>Contact us</a>
			</Link>
		</p>
	</div>
)

export default AbandonOrder

AbandonOrder.propTypes = {
	onClose: PropTypes.func
}
