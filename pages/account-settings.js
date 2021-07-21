import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import cn from 'classnames'

import {
	validateSession,
	signOutSession,
	fetchVerificationStatus,
	fetchVerificationTier,
	fetchUserDetails,
	toggleVerificationAlert,
	showNotificationAlert,
	hideNotificationAlert
} from '../store/actions'

import Nav from '../components/dashboard/Nav'
import AlertMessage from '../components/dashboard/AlertMessage'
import NotificationAlert from '../components/dashboard/NotificationAlert'
import TabsGroup from '../components/account-settings/TabsGroup'
import SettingsMenu from '../components/account-settings/SettingsMenu'
import ConfirmEmail from '../components/account-settings/ConfirmEmail'
import ChangeEmail from '../components/account-settings/ChangeEmail'
import UpdatePassword from '../components/account-settings/UpdatePassword'
import CloseAccount from '../components/account-settings/CloseAccount'
import StickyFooter from '../components/StickyFooter'

class AccountSettings extends Component {
	constructor(props) {
		super(props)
		this.state = {
			confirmEmailModal: false,
			changeEmailModal: false,
			updatePasswordModal: false,
			closeAccountModal: false,
			verificationAlert: false,
			email: null,
			scrolling: false
		}
		this.fetchData = this.fetchData.bind(this)
		this.onConfirmationEmailSent = this.onConfirmationEmailSent.bind(this)
		this.onAccountClosed = this.onAccountClosed.bind(this)
		this.onPasswordUpdated = this.onPasswordUpdated.bind(this)
	}

	componentDidMount() {
		this.fetchData()

		addEventListener('resize', this.onResize)
		this.onResize()
	}

	fetchData() {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.fetchVerificationStatus({ ctUser })
			this.props.fetchVerificationTier({ ctUser })
			this.props.fetchUserDetails(ctUser)
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}
	}

	componentWillUnmount() {
		removeEventListener('resize', this.onResize)
	}

	onResize = () => {
		const element = document.querySelector('.settings-page')
		const documentElement = document.documentElement

		this.setState({
			scrolling:
				element && documentElement
					? documentElement.clientHeight < element.scrollHeight
					: false,
			docWidth: documentElement.clientWidth
		})
	}

	onConfirmationEmailSent() {
		const { EmailAddress } = this.props.accounts.userDetails || {}
		const notificationContent = (
			<p>
				Confirmation email sent to <b>{EmailAddress || ''}</b>
			</p>
		)
		this.setState({
			confirmEmailModal: false
		})

		this.fetchData()
		this.props.showNotificationAlert({
			content: notificationContent,
			type: 'success'
		})
		setTimeout(() => {
			this.props.hideNotificationAlert()
		}, 5000)
	}

	onAccountClosed() {
		const notificationContent = (
			<p>
				Confirmation email sent to{' '}
				<b>
					{(this.props.accounts.userDetails &&
						this.props.accounts.userDetails.EmailAddress) ||
						''}
				</b>
			</p>
		)

		this.fetchData()
		this.props.showNotificationAlert({
			content: notificationContent,
			type: 'success'
		})
		setTimeout(() => {
			this.props.hideNotificationAlert()
		}, 5000)
	}

	onPasswordUpdated() {
		const notificationContent = <p>Your password has been updated</p>
		this.props.showNotificationAlert({
			content: notificationContent,
			type: 'success'
		})
		setTimeout(() => {
			this.props.hideNotificationAlert()
		}, 5000)
	}

	render() {
		const { currentTier } = this.props.verification
		return this.props.auth.ctUser ? (
			<div
				className="settings-page dashboard-page full-height"
				style={{ background: '#F7F9FA', overflowY: 'auto' }}>
				<Head>
					<title>Account settings | Cointec</title>
				</Head>
				<header>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<h2 className="dashboard-heading">Account settings</h2>
					</div>
				</header>
				{/* {this.state.verificationAlert && (
					<AlertMessage
						onHide={() => {
							this.props.toggleVerificationAlert(false)
							this.onResize()
						}}
					/>
				)} */}

				<NotificationAlert
					type={this.props.globals.notificationType}
					visible={this.props.globals.notificationAlert}
					onHide={() => this.props.hideNotificationAlert()}>
					{this.props.globals.notificationContent}
				</NotificationAlert>

				<div
					className="container dashboard-container"
					style={{
						marginBottom: !this.state.scrolling ? 86 : ''
					}}>
					<div className="row">
						<div className="col">
							<div className="content-wrapper p-0 h-auto position-relative">
								<TabsGroup />
								<SettingsMenu title="Your account" />
								<div className="settings-list">
									<div
										className="setting-wrapper"
										style={{
											padding:
												this.props.verification.status &&
												this.props.verification.status.VerificationComplete
													? '36px 32px'
													: ''
										}}>
										<div className="d-flex flex-column flex-md-row">
											<div>
												<h6
													className="setting-name"
													style={{
														marginBottom:
															this.props.verification.status &&
															!this.props.verification.status
																.VerificationComplete
																? '16px'
																: '12px'
													}}>
													Verification status
													{currentTier && (
														<img
															src={
																currentTier.TierName.toLowerCase() !==
																'unverified'
																	? '/static/images/check-success.svg'
																	: '/static/images/check.svg'
															}
															alt="verified"
														/>
													)}
												</h6>
												{currentTier &&
												currentTier.TierName.toLowerCase() !== 'unverified' ? (
													<p className="verification-status">
														<span className="beta-user">
															{currentTier.TierName}
														</span>{' '}
														| <a className="link-setting">upgrade</a>
													</p>
												) : (
													<div>
														<p className="d-none d-md-block">
															Complete verification to increase your limits.
														</p>
														<p className="d-block d-md-none mb-4">
															Get verified to buy with GBP
														</p>
													</div>
												)}
											</div>
											{this.props.verification.status &&
												!this.props.verification.status
													.VerificationComplete && (
													<div className="ml-md-auto">
														<Link href="/account-verification">
															<a className="btn-setting">
																Complete verification
															</a>
														</Link>
													</div>
												)}
										</div>
									</div>
									<div className="setting-wrapper">
										<div className="d-flex flex-column flex-md-row">
											<div>
												<h6 className="setting-name">
													Email address
													{this.props.verification.status && (
														<img
															src={
																!this.props.verification.status.EmailConfirmed
																	? '/static/images/check.svg'
																	: '/static/images/check-success.svg'
															}
															alt="verified"
														/>
													)}
												</h6>
												<p className="mb-4 mb-md-0">
													{(this.props.accounts.userDetails &&
														this.props.accounts.userDetails.EmailAddress) ||
														'email@cointec.co.uk'}
													{' |'}
													<a
														className="link-setting"
														onClick={() =>
															this.setState({ changeEmailModal: true })
														}>
														update
													</a>
												</p>
											</div>
											{this.props.verification.status &&
												!this.props.verification.status.EmailConfirmed && (
													<div className="ml-md-auto">
														<a
															className="btn-setting"
															onClick={() =>
																this.setState({ confirmEmailModal: true })
															}>
															Confirm email address
														</a>
													</div>
												)}
										</div>
									</div>
									<div className="setting-wrapper">
										<div className="d-flex">
											<div>
												<h6 className="setting-name">Password</h6>
												<p>
													************ |
													<a
														className="link-setting"
														onClick={() =>
															this.setState({ updatePasswordModal: true })
														}>
														update
													</a>
												</p>
											</div>
										</div>
									</div>
									<div className="setting-wrapper">
										<div className="d-flex flex-column flex-md-row">
											<div>
												<h6 className="setting-name">Close account</h6>
												<p className="d-none d-lg-block">
													You will lose access to all cointec services
												</p>
												<p className="d-block d-lg-none mb-4 mb-md-0">
													You will lose access to all cointec services
												</p>
											</div>
											<div className="ml-md-auto">
												{this.props.verification &&
													!this.props.verification.loading && (
														<a
															className={cn(
																'btn-setting text-danger',
																this.props.verification.status &&
																	this.props.verification.status
																		.CloseAccountTriggered
																	? 'disabled'
																	: ''
															)}
															onClick={
																this.props.verification.status &&
																!this.props.verification.status
																	.CloseAccountTriggered
																	? () =>
																			this.setState({ closeAccountModal: true })
																	: null
															}>
															Close your account
														</a>
													)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<StickyFooter className="bg-white" fixed={!this.state.scrolling} />
				{this.state.confirmEmailModal && (
					<ConfirmEmail
						emailAddress={
							this.props.accounts.userDetails &&
							this.props.accounts.userDetails.EmailAddress
						}
						ctUser={this.props.auth.ctUser}
						onClose={() => this.setState({ confirmEmailModal: false })}
						onEmailSent={this.onConfirmationEmailSent}
					/>
				)}
				{this.state.changeEmailModal && (
					<ChangeEmail
						emailAddress={
							this.props.accounts.userDetails &&
							this.props.accounts.userDetails.EmailAddress
						}
						ctUser={this.props.auth.ctUser}
						onClose={() => this.setState({ changeEmailModal: false })}
						onEmailSent={this.onConfirmationEmailSent}
					/>
				)}
				{this.state.updatePasswordModal && (
					<UpdatePassword
						ctUser={this.props.auth.ctUser}
						onPasswordUpdated={this.onPasswordUpdated}
						onClose={() => this.setState({ updatePasswordModal: false })}
					/>
				)}
				{this.state.closeAccountModal && (
					<CloseAccount
						emailAddress={
							this.props.accounts.userDetails &&
							this.props.accounts.userDetails.EmailAddress
						}
						onAccountClosed={this.onAccountClosed}
						onClose={() => this.setState({ closeAccountModal: false })}
					/>
				)}

				<style jsx global>{`
					#intercom-container {
						display: ${this.state.docWidth > 768 ? 'block' : 'none'};
					}
				`}</style>
			</div>
		) : null
	}

	componentWillReceiveProps(props) {
		const { globals, verification } = props
		const verificationAlert =
			globals.verificationAlert &&
			!globals.notificationAlert &&
			verification.status &&
			!verification.status.VerificationComplete

		this.setState({
			verificationAlert
		})
	}
}

export default connect(
	({ auth, verification, accounts, globals }) => ({
		auth,
		verification,
		accounts,
		globals
	}),
	{
		validateSession,
		signOutSession,
		fetchVerificationStatus,
		fetchVerificationTier,
		fetchUserDetails,
		toggleVerificationAlert,
		showNotificationAlert,
		hideNotificationAlert
	}
)(withRouter(AccountSettings))
