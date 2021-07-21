import React from 'react'

const TransactionAlert = ({ children, onHide }) => (
	<div className="alert-message">
		<div className="d-flex justify-content-center align-items-center container position-relative">
			{children}
			{onHide && (
				<a className="btn-hide-alert" onClick={onHide}>
					<i className="far fa-times fa-lg" />
				</a>
			)}
		</div>
	</div>
)

export default TransactionAlert
