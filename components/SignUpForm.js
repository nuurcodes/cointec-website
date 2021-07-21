import React from 'react'
import cn from 'classnames'
import { Field, reduxForm } from 'redux-form'
import PasswordToggle from './PasswordToggle'

const SignUpForm = ({ handleSubmit, maskPassword, toggleMask, loading }) => (
	<form className="signup-form" onSubmit={handleSubmit} noValidate>
		<Field
			name="emailAddress"
			type="email"
			label="Email"
			placeholder="email@cointec.co.uk"
			autoComplete="email"
			validate={emailAddress}
			component={renderEmailField}
		/>

		<Field
			name="password"
			label="Password"
			placeholder="••••••••"
			validate={[passwordLength, passwordLetter, passwordNumber]}
			mask={maskPassword}
			toggleMask={toggleMask}
			component={renderPasswordField}
		/>

		<button type="submit" className="btn btn-primary" disabled={loading}>
			{loading ? (
				<div>
					<i className="fas fa-spinner fa-spin" />
				</div>
			) : (
				<span>Create an account</span>
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
			spellCheck={false}
			autoComplete={autoComplete ? autoComplete : 'off'}
		/>
	</div>
)

const renderPasswordField = ({
	input,
	label,
	placeholder,
	mask,
	toggleMask,
	meta: { touched, error, valid, pristine }
}) => (
	<div
		className={cn(
			'form-group',
			touched && error ? 'invalid' : !pristine && valid ? 'valid' : null
		)}>
		<label htmlFor="password">{touched && error ? error : label}</label>
		<div className="position-relative">
			<input
				id="password"
				{...input}
				type={mask ? 'text' : 'password'}
				className="form-control password"
				placeholder={placeholder}
				autoComplete="off"
			/>

			<PasswordToggle visible={mask} onToggle={toggleMask} />

			<div className="typing-validator">
				<div>8 or more characters</div>
			</div>
		</div>
	</div>
)

// Validators
const emailAddress = value => {
	const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return !regex.test(value) ? 'Please enter a valid email' : undefined
}
const passwordLength = value =>
	!value || value.length < 8
		? 'Password must consist of 8 or more characters'
		: undefined
const passwordLetter = value =>
	!/[a-zA-Z]/.test(value)
		? 'Password must contain at least 1 letter'
		: undefined
const passwordNumber = value =>
	!/[0-9]/.test(value) ? 'Password must contain at least 1 number' : undefined

export default reduxForm({
	form: 'SignUpForm'
})(SignUpForm)
