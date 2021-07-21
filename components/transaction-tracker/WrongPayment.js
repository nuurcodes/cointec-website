import React, { Component } from 'react'
import PropTypes from 'prop-types'
import WrongPaymentForm from './WrongPaymentForm'

class WrongPayment extends Component {
	render() {
		return (
			<div>
				<p>
					Not to worry, we will refund your payment within 2 business days.
					Select your preferred refund account below and submit.
				</p>

				{this.props.ctUser && (
					<WrongPaymentForm
						ctUser={this.props.ctUser}
						txnID={this.props.txnID}
						addRefundAccount={this.props.addRefundAccount}
						handleRefundAccount={this.props.handleRefundAccount}
						onSubmit={this.props.onSubmit}
					/>
				)}
			</div>
		)
	}
}

export default WrongPayment

WrongPayment.propTypes = {
	onSubmit: PropTypes.func
}
