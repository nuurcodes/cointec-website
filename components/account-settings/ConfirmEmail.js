import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { requestConfirmEmail } from '../../store/actions'
import cn from 'classnames'

class ConfirmEmail extends Component {
	constructor() {
		super()
		this.state = {
			closed: false
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}

	onClose() {
		this.setState(
			{
				closed: true
			},
			() => {
				setTimeout(() => {
					this.props.onClose()
				}, 300)
			}
		)
	}

	componentDidMount() {
		setTimeout(() => {
			addEventListener('click', this.onClickOutside)
		}, 500)
	}

	componentWillUnmount() {
		removeEventListener('click', this.onClickOutside)
	}

	onClickOutside = event => {
		const composedPath = el => {
			var path = []
			while (el) {
				path.push(el)
				if (el.tagName === 'HTML') {
					path.push(document)
					path.push(window)
					return path
				}
				el = el.parentElement
			}
		}
		let path = event.path || (event.composedPath && event.composedPath())
		if (!path) {
			path = composedPath(event.target)
		}
		const select =
			path &&
			path.find(
				node => node.className === 'modal-dialog modal-account-settings'
			)
		if (!select) {
			this.onClose()
		}
	}

	onSubmit() {
		this.props
			.requestConfirmEmail({
				ctUser: this.props.ctUser,
				emailAddress: this.props.emailAddress
			})
			.then(res => {
				console.log(res)
				this.props.onEmailSent()
			})
	}

	render() {
		return (
			<div
				className="modal fade show"
				id="abandon-order-modal"
				role="dialog"
				data-backdrop="false"
				style={{ display: 'block' }}>
				<div
					className="modal-dialog modal-account-settings"
					role="document"
					style={{ transform: this.state.closed ? 'translateY(-120%)' : '' }}>
					<div className="modal-content">
						<div className="modal-body">
							<button type="button" className="close" onClick={this.onClose}>
								<i className="far fa-times fa-xs" />
							</button>
							<h5 className="modal-heading text-left">Confirm email address</h5>
							<hr />
							<form onSubmit={this.props.handleSubmit(this.onSubmit)}>
								<div className="row">
									<div className="col-12">
										<p className="modal-message">
											We’ve sent a confirmation email to{' '}
											<span className="semi">{this.props.emailAddress}.</span>{' '}
											If you can’t find the email please check your junk folder.
										</p>
									</div>
								</div>
								<div className="row mt-0">
									<div className="col-md-12">
										<button
											type="submit"
											className={cn('btn btn-block btn-lg', 'btn-primary')}
											disabled={this.props.accounts.loading}>
											{this.props.accounts.loading && (
												<div
													style={{ display: 'inline-block', marginRight: 12 }}>
													<i className="fas fa-spinner fa-spin" />
												</div>
											)}
											<span>Resend confirmation email</span>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	({ accounts }) => ({ accounts }),
	{ requestConfirmEmail }
)(
	reduxForm({
		form: 'ConfirmEmailForm'
	})(ConfirmEmail)
)
