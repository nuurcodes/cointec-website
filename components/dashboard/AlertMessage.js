import React from 'react'
import Link from 'next/link'

const AlertMessage = ({ onHide, ...props }) => (
	<div className="alert-message" {...props}>
		<div className="d-none d-md-flex justify-content-center align-items-center container position-relative">
			<p>Complete verification to make GBP transactions</p>
			<i className="far fa-long-arrow-right fa-lg" />
			<Link href="/account-verification">
				<a>Get verified</a>
			</Link>
			<a className="btn-hide-alert" onClick={onHide}>
				<i className="far fa-times fa-lg" />
			</a>
		</div>
		<div className="d-flex d-md-none justify-content-center container position-relative">
			<p>Get verified to make GBP transactions</p>
			<a className="btn-hide-alert" onClick={onHide}>
				<i className="far fa-times fa-lg" />
			</a>
		</div>
	</div>
)

export default AlertMessage
