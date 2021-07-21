import React, { Component } from 'react'
import Link from 'next/link'
import { abandonOrder, getStatus } from '../../store/actions'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class WrongPayee extends Component {
	constructor() {
		super()
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleSubmit() {
		this.props
			.abandonOrder({
				orderId: this.props.txnID,
				ctUser: this.props.ctUser,
				reason: this.props.reason
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
					Click the button below to confirm you have set to the wrong payee and
					cancel the transaction.
				</p>
				<p>
					We advise that you contact Faster Payments. Mentioning cryptocurrency
					or digital currency may reduce the chances of getting your funds back.
				</p>
				<div className="mt-4">
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
				<p className="mt-3 mb-5">
					<Link href="/">
						<a>Contact Faster Payments</a>
					</Link>
				</p>
			</div>
		)
	}
}

export default connect(
	({ order }) => ({ order }),
	{ abandonOrder, getStatus }
)(WrongPayee)

WrongPayee.propTypes = {
	onSubmit: PropTypes.func
}
