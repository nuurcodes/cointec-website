import React from 'react'
import Link from 'next/link'

const SettingsMenu = ({ title }) => (
	<div className="account-settings-menu d-flex d-md-none">
		<a
			className="btn dropdown-toggle"
			data-toggle="dropdown"
			aria-haspopup="true"
			aria-expanded="false">
			<i className="far fa-cog" />
			{title || 'Your account'}
			<i className="far fa-angle-down" />
		</a>
		<div className="dropdown-menu dropdown-menu-center">
			<Link href="/account-settings">
				<a className="dropdown-item">Account settings</a>
			</Link>
			<Link
				href="/transaction-limits"
				as="/account-settings/transaction-limits">
				<a className="dropdown-item">Transaction limits</a>
			</Link>
			<Link href="/bank-accounts" as="/account-settings/bank-accounts">
				<a className="dropdown-item">Bank accounts</a>
			</Link>
			<Link href="/privacy" as="/account-settings/privacy">
				<a className="dropdown-item">Privacy</a>
			</Link>
		</div>
	</div>
)

export default SettingsMenu
