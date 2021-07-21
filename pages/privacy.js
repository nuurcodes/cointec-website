import React, { Component } from 'react'
import Head from 'next/head'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
	fetchMessagingPreferences,
	setMessagingPreferences,
	fetchVerificationStatus,
	toggleVerificationAlert,
	fetchUserDetails,
	validateSession
} from '../store/actions'

import Nav from '../components/dashboard/Nav'
import AlertMessage from '../components/dashboard/AlertMessage'
import NotificationAlert from '../components/dashboard/NotificationAlert'
import TabsGroup from '../components/account-settings/TabsGroup'
import SettingsMenu from '../components/account-settings/SettingsMenu'
import RequestData from '../components/account-settings/RequestData'
import StickyFooter from '../components/StickyFooter'

const preferenceDetail = {
	Orders: {
		name: 'My orders',
		description: 'notifications for completed orders.'
	},
	Marketing: {
		name: 'New coins and features',
		description: 'latest product information.'
	}
}

class Privacy extends Component {
	constructor(props) {
		super(props)
		this.state = {
			saved: false,
			requestDataModal: false,
			scrolling: false,
			notificationAlert: false,
			dataAction: null,
			messagingPreferences: [
				{
					id: 'Orders',
					name: 'My transfers',
					description: 'notifications about where your coins are.',
					active: false
				},
				{
					id: 'Marketing',
					name: 'New coins and features',
					description: 'our latest and greatest work, sent monthly at most.',
					shortDescription: 'latest product information',
					active: false
				}
			]
		}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.onConfirmationEmailSent = this.onConfirmationEmailSent.bind(this)
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.fetchUserDetails(ctUser)
			this.props.fetchVerificationStatus({ ctUser })
			this.props.fetchMessagingPreferences({ ctUser })
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}

		addEventListener('resize', this.onResize)
		this.onResize()
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

	handleInputChange(event) {
		const target = event.target
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name
		const data = this.state.messagingPreferences.reduce(
			(preferences, { id, active }) => ({ ...preferences, [id]: active }),
			{}
		)
		data[name] = value
		console.log(data)
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.setMessagingPreferences({ ctUser, data }).then(() => {
				this.setState({
					saved: true
				})
				setTimeout(() => {
					this.setState({
						saved: false
					})
				}, 1000)
			})
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}
		// const messagingPreferences = this.state.messagingPreferences
		// messagingPreferences.find(setting => setting.id == name).active = value
	}

	onConfirmationEmailSent() {
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
		this.setState({
			notificationAlert: true,
			notificationContent
		})
		setTimeout(() => {
			this.setState({
				notificationAlert: false
			})
		}, 5000)
	}

	render() {
		const { docWidth } = this.state
		return (
			<div
				className="settings-page dashboard-page full-height"
				style={{ background: '#F7F9FA', overflowY: 'auto' }}>
				<Head>
					<title>Privacy | Cointec</title>
				</Head>
				<header>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<h2 className="dashboard-heading">Account settings</h2>
					</div>
				</header>
				{/* {this.props.globals.verificationAlert &&
					!this.state.notificationAlert &&
					this.props.verification.status &&
					!this.props.verification.status.VerificationComplete && (
						<AlertMessage
							onHide={() => {
								this.props.toggleVerificationAlert(false)
								this.onResize()
							}}
						/>
					)} */}

				<NotificationAlert
					type="success"
					visible={this.state.notificationAlert}
					onHide={() => this.setState({ notificationAlert: false })}>
					{this.state.notificationContent}
				</NotificationAlert>

				<div
					className="container dashboard-container"
					style={{
						marginBottom: !this.state.scrolling ? 86 : ''
					}}>
					<div className="row">
						<div className="col">
							<div className="content-wrapper p-0 h-auto">
								<TabsGroup />
								<SettingsMenu title="Privacy" />
								<div className="privacy">
									<div className="setting-group">
										<h6 className="heading">Notifications</h6>
										<div>
											{this.state.messagingPreferences.map(setting => (
												<label
													className="notification-setting"
													key={setting.id}>
													<span className="setting-name">{setting.name}</span>
													<span
														className={
															setting.shortDescription
																? 'd-none d-lg-inline'
																: 'd-none d-md-inline'
														}>
														{' '}
														- {setting.description}
													</span>
													<span
														className={
															setting.shortDescription
																? 'd-none d-md-inline d-lg-none'
																: 'd-none'
														}>
														{' '}
														- {setting.shortDescription}
													</span>
													<input
														type="checkbox"
														checked={setting.active}
														name={setting.id}
														onChange={this.handleInputChange}
													/>
													<span />
												</label>
											))}
										</div>
										<div>
											{this.state.saved && !this.props.accounts.loading && (
												<p
													className="saved d-inline d-md-none"
													style={{ marginBottom: 12, marginTop: 8 }}>
													Changes saved
												</p>
											)}
											{this.props.accounts.loading && (
												<p
													className="saved d-inline d-md-none"
													style={{ marginBottom: 12, marginTop: 8 }}>
													Changes saved
												</p>
											)}
										</div>
										<div className="d-flex justify-content-between">
											<p className="tc-stat">
												There are some things that we’ll always need to tell you
												about like changes to our T&C’s.
											</p>
											{this.state.saved && !this.props.accounts.loading && (
												<span className="saved d-none d-md-inline">Saved</span>
											)}
											{this.props.accounts.loading && (
												<span className="saved d-none d-md-inline">
													<i className="fas fa-spinner fa-spin" />
												</span>
											)}
										</div>
									</div>
									<hr className="m-0" />
									<div className="setting-wrapper">
										<div className="d-flex flex-column flex-md-row">
											<div>
												<h6 className="setting-name">Data request</h6>
												<p className="d-none d-lg-block">
													Request your data in a human-readable file.
												</p>
												<p className="mb-4 mb-md-0 d-block d-lg-none">
													Request your data in a human-readable file.
												</p>
											</div>
											<div className="ml-md-auto">
												<a
													className="btn-setting"
													onClick={() =>
														this.setState({
															requestDataModal: true,
															dataAction: 'request'
														})
													}>
													Data access request
												</a>
											</div>
										</div>
									</div>
									<hr className="m-0" />
									<div className="setting-wrapper">
										<div className="d-flex flex-column flex-md-row">
											<div>
												<h6 className="setting-name">Export Data</h6>
												<p className="d-none d-lg-block">
													Export your data in a machine-readable format.
												</p>
												<p className="mb-4 mb-md-0 d-block d-lg-none">
													Export your data in a machine-readable file.
												</p>
											</div>
											<div className="ml-md-auto">
												<a
													className="btn-setting"
													onClick={() =>
														this.setState({
															requestDataModal: true,
															dataAction: 'export'
														})
													}>
													Export your data
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<StickyFooter className="bg-white" fixed={!this.state.scrolling} />
				{this.state.requestDataModal && (
					<RequestData
						ctUser={this.props.auth.ctUser}
						emailAddress={
							this.props.accounts.userDetails &&
							this.props.accounts.userDetails.EmailAddress
						}
						action={this.state.dataAction}
						onClose={() => this.setState({ requestDataModal: false })}
						onRequestSent={this.onConfirmationEmailSent}
					/>
				)}
				<style jsx global>{`
					#intercom-container {
						display: ${docWidth > 768 ? 'block' : 'none'};
					}
				`}</style>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { messagingPreferences } = props.accounts
		console.log(messagingPreferences)
		if (messagingPreferences) {
			this.setState({
				messagingPreferences: Object.keys(messagingPreferences).map(key => {
					return {
						id: key,
						...preferenceDetail[key],
						active: messagingPreferences[key]
					}
				})
			})
		}
	}
}

export default connect(
	({ auth, accounts, verification, globals }) => ({
		auth,
		accounts,
		verification,
		globals
	}),
	{
		fetchMessagingPreferences,
		setMessagingPreferences,
		fetchVerificationStatus,
		toggleVerificationAlert,
		fetchUserDetails,
		validateSession
	}
)(withRouter(Privacy))
