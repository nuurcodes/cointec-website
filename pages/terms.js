import React, { Component } from 'react'
import Head from 'next/head'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/legal/Sidebar'

class Terms extends Component {
	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Terms & Conditions | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header m-0" />
					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading dc-basics-heading">
										Terms of use
									</h1>
								</div>
							</div>
						</div>
					</div>
				</Header>

				<section className="page-content dc-glossary container">
					<div className="row">
						<div className="col-12 col-lg-8">
							<div className="privacy-policy-wrapper">
								<h5 className="page-heading">Terms and conditions</h5>
								<h5 className="last-updated">Last updated: July 04, 2018</h5>
								<p>
									The following is a contract between Cointec Ltd, a company
									incorporated in England & Wales (reg no. 11104052),
									hereinafter referred to as “we”, “us” or “the platform” and
									the contractual party, referred to as “you”, “the user” or
									collectively as “users”.
								</p>
								<p>
									Cointec offers a service that allows users in the UK to
									exchange cryptocurrency.
								</p>
								<h6 className="pt-3">1. Contract</h6>
								<p>
									1.1 By using this website, registering an account or using any
									services offered by the platform you agree that you have read,
									understood, acknowledged and accepted all of the terms within
									this agreement.
								</p>
								<p>
									1.2 If you do not agree to the terms of use and, by extension,
									our privacy policy, you must not use our site or services.
								</p>
								<h6 className="sub-heading">2. General</h6>
								<p>
									2.1 Users must comply with the laws and regulations of the
									country in which they access our services from.
								</p>
								<p>
									2.2 Users agree to never access our website via public
									computers or networks including wi-fi or otherwise.
								</p>
								<p>
									2.3 Users take full responsibility for ensuring any hardware
									or equipment they use to access our services are free of
									viruses, keyloggers, malware or other software that could
									compromise their own security or the platform’s.
								</p>
								<p>
									2.4 The Cointec logo(s) are{' '}
									<a
										href="https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/UK00003283603"
										target="_blank">
										registered
									</a>{' '}
									trademarks and the intellectual property of Cointec Ltd.
								</p>
								<p>
									2.5 Users will not copy, remove, replicate or download any
									images, designs, trademarks, logos, data or code hosted on or
									connected to our platform.
								</p>
								<p>
									2.6 Users will not misuse our website or the platform by
									marketing misleadingly, spamming, hacking or attacking.
								</p>
								<p>
									2.7 Users have the right to use our services in accordance
									with the terms outlined in this agreement.
								</p>

								<h6 className="sub-heading">3. Registering an account</h6>
								<p>
									3.1 To be eligible for an account, users must be over the age
									of 18.
								</p>
								<p>
									3.2 Details provided by the user for the purposes of
									registering an account, or otherwise, must be real, up to date
									and accurate. Accounts created using inaccurate details, false
									identities or under names of third parties who have not
									authorized the applicant will immediately be terminated and
									the details passed on to fraud prevention and other relevant
									authorities.
								</p>
								<p>
									3.3 Each user is allowed to create and hold only one account
									under their name. Discovery of multiple accounts used by the
									same individual will result in termination of all accounts
									held.
								</p>
								<p>
									3.4 We reserve the right to deny opening of accounts and to
									close accounts at our discretion.
								</p>
								<h6 className="sub-heading">4. Payments</h6>
								<p>
									4.1 Payments must only be made from payment accounts held in
									the user’s name. Users who add or pay from payment accounts
									not under their registered name are in violation of this user
									agreement.
								</p>
								<p>
									4.2 Bank transfers must only be made via Faster Payments using
									online-banking. Bank transfers initiated by telephone banking,
									in-branch or in any other way are considered violation of this
									user agreement.
								</p>
								<p>
									4.3 Users must only add or make payments from bank accounts
									that are enabled by Faster Payments. Users must not make
									payments from banks that obfuscate the sender’s name or banks
									that delay or batch payments, even if payments are sent via
									Faster Payments.
								</p>
								<p>
									4.4 Users must only trade using funds that they solely own.
									Users may not use overdrafts, loans or any form of credit.
								</p>
								<p>
									4.5 Bank transfers must be made with the correct reference
									provided. Transfers made without the correct references will
									nullify this user agreement and give us the right to cancel
									orders.
								</p>
								<p>
									4.6 Users must not mention any terms relating to
									cryptocurrency as references for bank transfers as this can
									cause complications with the banks of both counterparties,
									resulting in failed transfers. Any users found doing so will
									be banned from the platform and their agreement with the
									platform will be terminated.
								</p>
								<p>
									4.7 Any unexpected costs incurred by Cointec for receiving
									payments via bank transfer will be recovered from the user.
								</p>
								<p>
									4.8 Any losses incurred by Cointec as a result of bank’s
									recovering unauthorised funds will be passed on to the user.
								</p>
								<h6 className="sub-heading">5. Orders</h6>
								<p>
									5.1 Users ordering on the platform understand the financial
									risk involved in investing in cryptocurrency. The user accepts
									that he or she is solely responsible for any financial losses
									incurred during the completion of orders on our platform or
									outside.
								</p>
								<p>
									5.2 Fulfilment of orders is not guaranteed and depends on a
									number of factors including but not limited to: availability
									of trade counterparties, availability of cryptocurrency,
									market conditions and availability of our systems.
								</p>
								<p>
									5.3 The user accepts that there may be insignificant
									differences between the amount of cryptocurrency displayed in
									the confirmation and the final amount received.
								</p>
								<p>
									5.4 If the user fails to initiate a bank transfer or
									cryptocurrency deposit in the allotted time period after
									confirming their order, their order will be cancelled.
								</p>
								<p>
									5.5 Users accept that they are obliged to pay any orders they
									confirm. Abandoning orders after confirmation is considered
									spam and a violation of the user agreement.
								</p>
								<p>
									5.6 Once the user has made a bank transfer they must notify
									the platform immediately by clicking ‘I have made payment’. If
									users are found to delay this communication, we reserve the
									right to cancel the user’s order.
								</p>
								<p>
									5.7 Cointec will honour the rate and amount offered for an
									order if payment is received within the allotted time period.
									After this time period, we reserve the right to cancel orders
									and return any funds that arrive late or to withdraw the rate
									or amount offered and offer an updated rate or amount.
								</p>
								<p>
									5.8 Cointec will not be responsible for any incorrect wallet
									addresses provided by users, resulting in misplaced
									cryptocurrency.
								</p>
								<p>
									5.9 Orders are considered fulfilled upon the blockchain
									transaction ID being presented to the user.
								</p>
								<p>
									5.10 Filled orders are final and cannot be refunded or
									reversed in any case.
								</p>
								<h6 className="sub-heading">6. Variations and termination</h6>
								<p className="mb-4">
									6.1 This agreement is legally binding and will continue until
									termination.
								</p>
								<p>
									6.2 This agreement may be terminated at any time by us
									immediately or by yourself by providing written confirmation
									to close your account or via the dashbaord. Any outstanding
									orders will be honoured within the terms of this agreement.
								</p>
								<p>
									6.3 This agreement is subject to changes at any time in which
									case we will provide a notice and circulate the updated
									agreement.
								</p>

								<h6>Contact</h6>
								<p>
									For any related enquires please contact us at{' '}
									<a href="mailto:contact@cointec.co.uk">
										contact@cointec.co.uk
									</a>{' '}
									or at:
								</p>
								<p>
									Kemp House
									<br />
									152-160 City Road
									<br />
									London
									<br />
									EC1V 2NX
								</p>
							</div>
						</div>
						<div className="col-4 d-none d-lg-block">
							<Sidebar />
						</div>
					</div>
				</section>

				<Footer />

				<style jsx global>{`
					html body {
						background-color: #f7f9fa;
					}
				`}</style>
			</div>
		)
	}
}

export default Terms
