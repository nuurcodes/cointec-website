import React from 'react'
import NavLink from '../NavLink'

const Sidebar = () => (
	<aside className="topics">
		<h6 className="heading-topics">LEARN TOPICS</h6>
		<ul>
			<li>
				<NavLink
					href="/digital-currency-basics"
					as="/learn/crypto-asset-basics">
					Crypto Asset Basics
				</NavLink>
			</li>
			<li>
				<NavLink href="/digital-wallets" as="/learn/digital-wallets">
					Digital wallets
				</NavLink>
			</li>
			<li>
				<NavLink href="/blockchain" as="/learn/blockchain">
					Blockchain
				</NavLink>
			</li>
			<li>
				<NavLink href="/glossary-of-terms" as="/learn/glossary-of-terms">
					Glossary of terms
				</NavLink>
			</li>
			<li>
				<NavLink href="/glossary-of-tokens" as="/learn/crypto-asset-glossary">
					Crypto Asset Glossary
				</NavLink>
			</li>
		</ul>
	</aside>
)

export default Sidebar
