import React from 'react'
import NavLink from '../NavLink'

const TabsGroup = props => (
	<div className="tabs-group d-none d-md-flex">
		<NavLink href="/account-settings" className="tab-item">
			<i className="far fa-cog" />
			Your account
		</NavLink>
		<NavLink
			href="/transaction-limits"
			as="/account-settings/transaction-limits"
			className="tab-item">
			<i className="far fa-random" />
			Transaction limits
		</NavLink>
		<NavLink
			href="/bank-accounts"
			as="/account-settings/bank-accounts"
			className="tab-item">
			<i className="far fa-university" />
			Bank accounts
		</NavLink>
		<NavLink
			href="/privacy"
			as="/account-settings/privacy"
			className="tab-item">
			<i className="far fa-eye-slash" />
			Privacy
		</NavLink>
	</div>
)

export default TabsGroup
