import React from 'react'
import NavLink from '../NavLink'

const Sidebar = () => (
	<aside className="topics">
		<h6 className="heading-topics">RELAVANT</h6>
		<ul>
			<li>
				<NavLink href="/privacy-policy">Privacy policy</NavLink>
			</li>
			<li>
				<NavLink href="/terms">Terms of use</NavLink>
			</li>
			<li>
				<NavLink href="/security" as="/aml-kyc-policy">
					AML/KYC
				</NavLink>
			</li>
		</ul>
	</aside>
)

export default Sidebar
