import React from 'react'
import Link from 'next/link'

const GetStarted = () => (
	<div className="bg-gradient bg-mid-gradient">
		<div className="get-started container">
			<div className="row">
				<div className="col-12 text-center">
					<h4 className="section-title">Get started in minutes</h4>
				</div>
			</div>

			<div className="row">
				<div className="col-md-12 col-lg-4 mt-3 mt-sm-4 mt-lg-3">
					<Card
						title="1. Create an account"
						description="Open an account in seconds. All you need is an e-mail and password."
						image="/static/images/create-an-account.svg"
						link={{ href: '/signup', text: 'Sign up now' }}
					/>
				</div>

				<div className="col-md-12 col-lg-4 mt-3 mt-sm-4 mt-lg-3">
					<Card
						title="2. Setup your wallet"
						description={
							<>
								Take full control of your assets.{' '}
								<br className="d-inline d-sm-none d-xl-inline" />
								Find wallets for desktop or mobile.
							</>
						}
						image="/static/images/setup-wallet.svg"
						link={{ href: '/wallet-selector', text: 'Wallet selector' }}
					/>
				</div>

				<div className="col-md-12 col-lg-4 mt-3 mt-sm-4 mt-lg-3">
					<Card
						title="3. Make an order"
						description="Choose from over 50 crypto assets. Track orders direct to your wallet."
						image="/static/images/make-an-order.svg"
						link={{ href: '/exchange', text: 'Create your first order' }}
					/>
				</div>
			</div>
		</div>
	</div>
)

const Card = ({ title, description, image, link: { href, text } }) => (
	<div className="get-started-card text-center">
		<img src={image} alt={title} />
		<h5>{title}</h5>
		<p>{description}</p>
		<Link href={href}>
			<a>{text}</a>
		</Link>
	</div>
)

export default GetStarted
