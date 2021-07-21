import React, { Component } from 'react'
import Head from 'next/head'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
	fetchAccounts,
	fetchVerificationStatus,
	toggleVerificationAlert,
	validateSession,
	signOutSession
} from '../store/actions'

import Nav from '../components/dashboard/Nav'
import AlertMessage from '../components/dashboard/AlertMessage'
import TabsGroup from '../components/account-settings/TabsGroup'
import SettingsMenu from '../components/account-settings/SettingsMenu'
import AddBankAccount from '../components/account-settings/AddBankAccount'
import StickyFooter from '../components/StickyFooter'

const colors = [
	'#7433FF',
	'#0779C6',
	'#E83860',
	'#AA3939',
	'#729C34',
	'#363377',
	'#AA8E39',
	'#E76900',
	'#850297',
	'#00A643'
]

class BankAccounts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ctUser: null,
			addBankAccountModal: false,
			editAccount: null,
			scrolling: false,
			accountsAvailable: false
		}
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.fetchVerificationStatus({ ctUser })
			this.props.fetchAccounts(ctUser).catch(err => {
				if (err.response.status === 401) {
					this.props.signOutSession()
				}
			})
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

	render() {
		const { docWidth } = this.state
		return (
			<div
				className="settings-page dashboard-page full-height"
				style={{ background: '#F7F9FA', overflowY: 'auto' }}>
				<Head>
					<title>Bank Accounts | Cointec</title>
				</Head>
				<style jsx global>{`
					#intercom-container {
						display: ${docWidth > 768 ? 'block' : 'none'};
					}
				`}</style>
				<header>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<h2 className="dashboard-heading">Account settings</h2>
					</div>
				</header>
				{/* {this.props.verification.status &&
					!this.props.verification.status.VerificationComplete && (
						<AlertMessage
							onHide={() => {
								this.props.toggleVerificationAlert(false)
								this.onResize()
							}}
						/>
					)} */}
				<div
					className="container dashboard-container"
					style={{
						marginBottom: !this.state.scrolling ? 86 : ''
					}}>
					<div className="row">
						<div className="col">
							<div className="content-wrapper p-0 h-auto">
								<TabsGroup />
								<SettingsMenu title="Bank accounts" />
								<div className="bank-accounts">
									<div className="d-flex justify-content-between">
										<h6 className="heading d-none d-md-flex">
											Saved bank accounts
										</h6>
										<h6 className="heading d-flex d-md-none">Bank accounts</h6>
										<a
											className="add-account-link"
											onClick={() =>
												this.setState({ addBankAccountModal: true })
											}>
											Add bank account
											<i className="fas fa-plus-circle" />
										</a>
									</div>
									<div className="accounts-list row">
										{this.props.accounts.list &&
											this.props.accounts.list.map((account, index) => (
												<div
													className="col-12 col-xl-4 col-md-6"
													key={account.id}>
													<AccountCard
														AccountOwner={account.AccountOwner}
														AccountReference={account.AccountReference}
														AccountNumber={account.AccountNumber}
														SortCode={account.SortCode}
														color={colors[index % colors.length]}
														onEdit={() =>
															this.setState({
																addBankAccountModal: true,
																editAccount: account
															})
														}
													/>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<StickyFooter className="bg-white" fixed={!this.state.scrolling} />
				{this.state.addBankAccountModal && (
					<AddBankAccount
						editAccount={this.state.editAccount}
						ctUser={this.state.ctUser}
						onClose={() =>
							this.setState({ addBankAccountModal: false, editAccount: null })
						}
					/>
				)}
			</div>
		)
	}

	componentWillReceiveProps({ accounts }) {
		if (!this.state.accountsAvailable && accounts && accounts.list) {
			this.setState({ accountsAvailable: true }, () => this.onResize())
		}
	}
}

const AccountCard = ({
	AccountOwner,
	AccountNumber,
	AccountReference,
	SortCode,
	color,
	onEdit
}) => (
	<div className="account-card" style={{ background: color }}>
		<div className="row">
			<div className="col">
				<h6 className="field-label">Account name</h6>
				<p className="field-value">{AccountReference}</p>
			</div>
			<div className="col-3 text-right">
				<a className="edit-account-link" onClick={onEdit}>
					Edit
				</a>
			</div>
		</div>
		<br />
		<div className="row">
			<div className="col-7">
				<h6 className="field-label">Account number</h6>
				<p className="field-value">{AccountNumber}</p>
			</div>
			<div className="col-5 text-right">
				<h6 className="field-label">Sort code</h6>
				<p className="field-value">{SortCode}</p>
			</div>
		</div>
	</div>
)

export default connect(
	({ accounts, globals, verification }) => ({
		accounts,
		globals,
		verification
	}),
	{
		fetchAccounts,
		fetchVerificationStatus,
		toggleVerificationAlert,
		validateSession,
		signOutSession
	}
)(withRouter(BankAccounts))
