import React from 'react'
import Link from 'next/link'
import cn from 'classnames'
import { Field, reduxForm } from 'redux-form'
import PasswordToggle from './PasswordToggle'

const SignInForm = ({ handleSubmit, maskPassword, toggleMask, loading }) => (
	<form className="signin-form" onSubmit={handleSubmit} noValidate>
		<Field
			name="email"
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
			mask={maskPassword}
			validate={password}
			toggleMask={toggleMask}
			component={renderPasswordField}
		/>

		<Link href="/forgot-password">
			<a className="d-block link-forgot-password">Forgot password?</a>
		</Link>

		<button type="submit" className="btn btn-primary" disabled={loading}>
			{loading ? (
				<div>
					<i className="fas fa-spinner fa-spin" />
				</div>
			) : (
				<span>Sign in</span>
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

const renderPasswordField = ({
	input,
	label,
	placeholder,
	mask,
	toggleMask,
	meta: { touched, error, valid, pristine }
}) => (
	<div className={cn('form-group', touched && error ? 'invalid' : null)}>
		<label htmlFor="password">{touched && error ? error : label}</label>
		<div className="position-relative">
			<input
				id="password"
				{...input}
				type={mask ? 'text' : 'password'}
				className="form-control"
				placeholder={placeholder}
				autoComplete="off"
			/>

			<PasswordToggle visible={mask} onToggle={toggleMask} />
		</div>
	</div>
)

// Validators
const emailAddress = value => {
	const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return !regex.test(value) ? 'Please enter a valid email' : undefined
}
const password = value => (!value ? 'Please enter a valid password' : undefined)

export default reduxForm({
	form: 'SignInForm'
})(SignInForm)
