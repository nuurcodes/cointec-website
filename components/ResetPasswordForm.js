import React from 'react'
import cn from 'classnames'
import { Field, reduxForm } from 'redux-form'
import PasswordToggle from '../components/PasswordToggle'

const ResetPasswordForm = ({
	handleSubmit,
	maskPassword,
	toggleMask,
	maskConfirmPassword,
	toggleConfirmMask,
	loading
}) => (
	<form className="als-content" onSubmit={handleSubmit} noValidate>
		<Field
			name="password"
			label="New password"
			placeholder="••••••••"
			validate={[passwordLength, passwordLetter, passwordNumber]}
			mask={maskPassword}
			toggleMask={toggleMask}
			component={renderPasswordField}
		/>

		<Field
			name="newPassword"
			label="Confirm new password"
			placeholder="••••••••"
			validate={[passwordLength, passwordLetter, passwordNumber]}
			mask={maskConfirmPassword}
			toggleMask={toggleConfirmMask}
			component={renderPasswordField}
		/>

		<button type="submit" className="btn btn-primary" disabled={loading}>
			{loading ? (
				<div>
					<i className="fas fa-spinner fa-spin" />
				</div>
			) : (
				<span>Reset password</span>
			)}
		</button>
	</form>
)

const renderField = ({
	input,
	label,
	placeholder,
	mask,
	toggleMask,
	meta: { touched, error, valid, pristine }
}) => (
	<div className={cn('form-group', touched && error ? 'invalid' : null)}>
		<label>{touched && error ? error : label}</label>
		<div className="password-validation position-relative">
			<input
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
const required = value => (!value ? 'This field is required' : undefined)
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
	form: 'ResetPasswordForm',
	validate: values => {
		const errors = {}
		if (values.password !== values.newPassword) {
			errors.newPassword = 'Confirm password does not match'
		}
		return errors
	}
})(ResetPasswordForm)
