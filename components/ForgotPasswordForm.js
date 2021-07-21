import React from 'react'
import cn from 'classnames'
import { Field, reduxForm } from 'redux-form'

const ForgotPasswordForm = ({ handleSubmit, description, loading }) => (
	<form className="als-content" onSubmit={handleSubmit} noValidate>
		<h5 className="heading-line">{description}</h5>

		<Field
			name="emailAddress"
			type="email"
			label="Email"
			placeholder="email@cointec.co.uk"
			autoComplete="email"
			validate={emailAddress}
			component={renderEmailField}
		/>

		<button type="submit" className="btn btn-primary" disabled={loading}>
			{loading ? (
				<div>
					<i className="fas fa-spinner fa-spin" />
				</div>
			) : (
				<span>Send reset email</span>
			)}
		</button>
	</form>
)

const renderEmailField = ({
	input,
	label,
	placeholder,
	autoComplete,
	type,
	meta: { touched, error }
}) => (
	<div className={cn('form-group', touched && error ? 'invalid' : null)}>
		<label>{touched && error ? error : label}</label>
		<input
			{...input}
			type={type}
			className="form-control"
			placeholder={placeholder}
			autoComplete={autoComplete ? autoComplete : 'off'}
		/>
	</div>
)

// Validators
const emailAddress = value => {
	const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return !regex.test(value) ? 'Please enter a valid email' : undefined
}

export default reduxForm({
	form: 'ForgotPasswordForm'
})(ForgotPasswordForm)
