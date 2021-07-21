import React, { Component } from 'react'
import { abandonOrder, getStatus } from '../../store/actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class NoPayment extends Component {
	constructor() {
		super()
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit() {
		this.props
			.abandonOrder({
				orderId: this.props.txnID,
				ctUser: this.props.ctUser,
				reason: 'NOPAYMENT'
			})
			.then(() => {
				this.props.getStatus({
					orderId: this.props.txnID,
					ctUser: this.props.ctUser
				})
				this.props.onSubmit()
			})
	}

	render() {
		return (
			<div>
				<p>
					Click the button below to confirm you have not made payment. This will
					cancel the transaction.
				</p>
				<div className="mt-4 mb-5">
					<button
						className="btn btn-danger w-100"
						style={{ padding: '12px', borderRadius: '2px' }}
						onClick={this.handleSubmit}>
						{this.props.order.loading ? (
							<div>
								<i className="fas fa-spinner fa-spin" />
							</div>
						) : (
							<span>I have not made payment</span>
						)}
					</button>
				</div>
			</div>
		)
	}
}

export default connect(
	({ order }) => ({ order }),
	{ abandonOrder, getStatus }
)(NoPayment)

NoPayment.propTypes = {
	onSubmit: PropTypes.func
}
