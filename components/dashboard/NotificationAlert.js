import React from 'react'
import cn from 'classnames'

const types = {
	success: 'alert-success',
	danger: 'alert-danger'
}

const NotificationAlert = ({ children, onHide, type, visible }) =>
	visible ? (
		<div className={cn('alert-message', types[type])}>
			<div className="d-flex justify-content-center align-items-center container position-relative">
				{children}
				{onHide && (
					<a className="btn-hide-alert" onClick={onHide}>
						<i className="far fa-times fa-lg" />
					</a>
				)}
			</div>
		</div>
	) : null

export default NotificationAlert
