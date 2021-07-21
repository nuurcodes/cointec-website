import {
	TOGGLE_VERIFICATION_ALERT,
	SHOW_TRANSACTION_ALERT,
	HIDE_TRANSACTION_ALERT,
	SHOW_NOTIFICATION_ALERT,
	HIDE_NOTIFICATION_ALERT
} from '../actions'

const INITIAL_STATE = {
	verificationAlert: true,
	transactionAlert: false,
	notificationAlert: false,
	notificationContent: null,
	notificationType: null
}

export default (state = INITIAL_STATE, { type, payload }) => {
	switch (type) {
		case TOGGLE_VERIFICATION_ALERT:
			return { ...state, ...payload }

		case SHOW_TRANSACTION_ALERT:
			return { ...state, transactionAlert: true }

		case HIDE_TRANSACTION_ALERT:
			return { ...state, transactionAlert: false }

		case SHOW_NOTIFICATION_ALERT:
			return {
				...state,
				notificationAlert: true,
				notificationContent: payload.content,
				notificationType: payload.type
			}

		case HIDE_NOTIFICATION_ALERT:
			return {
				...state,
				notificationAlert: false,
				notificationContent: null,
				notificationType: null
			}

		default:
			return state
	}
}
