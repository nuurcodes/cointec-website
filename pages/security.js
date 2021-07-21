import React, { Component } from 'react'
import Head from 'next/head'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/legal/Sidebar'

class Security extends Component {
	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Anti-Money Laundering | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header m-0" />
					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading dc-basics-heading">
										Anti-Money Laundering
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
								<h5 className="page-heading">Anti-Money Laundering</h5>
								<h5 className="last-updated">Last updated: 3 May 2019</h5>
								<p>
									Cointec Ltd employs an anti-money laundering (AML) and know your customer
									(KYC) policy in order to prevent the exchange being used to facilitate
									money-laundering, terrorist-financing and financial fraud.
								</p>
								<p>
									Whilst there is currently no specific UK legislation that regulates cryptocurrency
									businesses, Cointec adopts protocols and processes that are legally required of
									regulated money service businesses and similar financial institutions in the UK.
								</p>
								<p className="pb-1">
									Self-imposing said requirements enables the company to counter money-laundering
									efficiently and operate in accordance with recognized practices in the wider
									industry.
								</p>
								<p>
									The AML/KYC policy is enforced by systems, processes and various other
									controls outlined below.
								</p>
								<h6 className="mt-4 mb-2">Identity Verification</h6>
								<p className="mb-4">
									To satisfy our KYC compliance requirements, customers need to provide personal
									information, proof of identity and proof of address. This information will be
									shared with identity verification services to ascertain its trueness.
								</p>
								<p>
									Identity information provided by users can be checked against global watchlists
									including, but not limited to, politically exposed persons (PEP) list and global
									sanctions list.
								</p>
								<h6 className="pt-3">
									Due Diligence
								</h6>
								<p>
									In transactions where the risk of illicit activity is deemed to be higher, for example high-value transactions, users may be asked to provide further information such as proof of funds, means of income sand other documents.
								</p>
								<p>
									Similarly, to access the card payments or other payment methods that are deemed to carry high risks of being used for illicit activity, users will need to provide an ID-selfie.
								</p>
								<h6 className="sub-heading">Limits</h6>
								<p>
									Transaction limits are defined by tiers, based on the level of due diligence customers have satisfied. Non-verified users will be limited to transacting small amounts. To access meaningful transaction limits, users must complete the verification process.
								</p>

								<h6 className="sub-heading">Record Retention</h6>
								<p>
									Details of transactions and account activity are recorded for risk monitoring purposes. Accounts where suspicious activity is detected will be blocked and persisted to an internal watchlist to prevent potentially linked accounts being opened or engaging in illicit activity.
								</p>
								<p>
									Account and transaction records are backed up and retained for a period of up to 5 years after the date of a user’s final transaction or the date of account closure. This is so that the records can be made available to regulatory authorities or law enforcement, should the need arise.
								</p>
								<h6 className="sub-heading">Law Enforcement</h6>
								<p>
									Cointec Ltd is registered with the National Crime Agency (NCA) and will file Suspicious Activity Reports (SARs) if reasonable grounds for suspecting money laundering, terrorist financing or fraud is found.
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

				<Footer backgroundColor="#fff" />

				<style jsx global>{`
					html body {
						background-color: #f7f9fa;
					}
				`}</style>
			</div>
		)
	}
}

export default Security
