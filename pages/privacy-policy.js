import React from 'react'
import Head from 'next/head'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/legal/Sidebar'

const PrivacyPolicy = () => (
	<div className="learn-page">
		<Head>
			<title>Privacy Policy | Cointec</title>
		</Head>
		<Header background="gradient" deco={false}>
			<Nav />
			<hr className="hr-header" />
			<div className="container">
				<div className="hero-wrapper hero-wrapper-inner">
					<div className="row">
						<div className="col-md-12">
							<h1 className="learn-heading dc-basics-heading">
								Privacy policy
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
						<h5 className="page-heading">Privacy Policy</h5>
						<h5 className="last-updated">Last updated: 3rd May 2019</h5>
						<p>
							By using our website(s) or other services in any capacity you
							agree to the terms below, outlining the handling of personal
							information, as well as to our general terms and conditions.
						</p>
						<p>
							Cointec Ltd is a registered data controller, registration number{' '}
							<a
								href="https://ico.org.uk/ESDWebPages/Entry/ZA304564"
								target="_blank">
								ZA304564
							</a>{' '}
							with the Information Commissioner’s Office. You can view our
							registration here.
						</p>
						<p>
							Cointec Ltd, hereafter referred to as “we”, “the platform” or
							simply “Cointec”, is legally required to process your (the data
							subject’s) personal information in accordance with the Data
							Protection Act 2018 and the European Union’s General Data
							Protection Act.
						</p>
						<h6 className="mt-4 mb-2">YOUR DATA</h6>
						<p className="mb-4">
							User Privacy is of the utmost importance and we aim to be as
							transparent as possible. This policy sets out what data we collect
							from and about you, how we use it and what control your have over
							your data, with regards to viewing, exporting, updating, and
							erasing it.
						</p>
						<h6 className="pt-3">1. INFORMATION COLLECTED AND HOW WE USE IT</h6>
						<p>
							Cointec intends to collect the minimum information required to
							provide our services. As you interact with the platform, we may
							collect personal information from yourself directly or about you,
							from third-party sources.
						</p>
						<h6 className="sub-heading">Client information</h6>
						<p>
							Upon visiting and using the platform we may collect the following
							information about you automatically:
						</p>
						<ul>
							<li>
								Log Information, including your browser type, access times, IP
								address, pages viewed and your geolocation.
							</li>
							<li>
								Device Information, including your device’s hardware model,
								operating system and version.
							</li>
						</ul>
						<p>
							We may collect this information to analyse our user demographic
							and to monitor suspicious activity.
						</p>

						<h6 className="sub-heading">Account information</h6>
						<p>
							To provide account services we collect your e-mail address and may
							use this along with your mobile number to share Cointec marketing
							material and updates.
						</p>
						<h6 className="sub-heading">Identity information</h6>
						<p>
							We will collect your full name, date of birth, residence and
							address and may collect any information contained in IDs or proof
							of address provided such as government-issued verification
							numbers. We share this information with third-party identity
							verification services to verify your identity in line with AML
							legislation and KYC regulation.
						</p>
						<h6 className="sub-heading">Payment information</h6>
						<p>
							We collect your name, account number and sort-code and may share
							these bank details with trade counterparties to fulfil orders and
							to refund orders. We use your sort-code to identify your banking
							provider and account type. Our payment service partners may
							collect debit/credit details or other payment details on our
							behalf to process payments.
						</p>
						<p>
							To detect fraud and track platform usage we will collect
							information about the time, size, price, frequency and type of
							orders. This data is analysed internally and may also be shared
							with payment service providers for fraud detection purposes.
						</p>
						<h6 className="sub-heading">Sensitive information</h6>
						<p className="mb-4">
							Cointec will never collect information on your ethnic origin,
							race, political opinions, or religious beliefs. When applying for
							an increase in your trading limit, we may ask for details and
							proof of your employment status or means of income, to carry out
							due diligence on the source of funds used to trade.
						</p>

						<h6 className="pt-3">2. STORAGE OF PERSONAL INFORMATION</h6>
						<p>
							Data containing personal information is stored securely on our
							servers in an encrypted state where necessary. Where appropriate,
							data will only be decrypted offline.
						</p>
						<p>
							In accordance with the legislation presented below we are required
							to keep a record of your personal information, copies of identity
							documents and details of transactions for a period of five years
							from the date of your final transaction or account closure.
						</p>

						<ul className="mb-4">
							<li>
								UK Money Laundering, Terrorist Financing and Transfer of Funds
								Regulations 2017
							</li>
							<li>Money Laundering Regulations 2007 (SI 2007 No. 2157)</li>
						</ul>

						<h6 className="pt-3">3. CONTROL OVER YOUR DATA</h6>
						<h6 className="sub-heading">Accessing your data</h6>
						<p>
							You may request at any time, via e-mail or our website dashboard
							to receive an electronic copy of all the personal information held
							about you.
						</p>

						<h6 className="sub-heading">Updating your data</h6>
						<p>
							You may request at any time, via e-mail or our website dashboard
							to update the personal information held about you by us.
						</p>

						<h6 className="sub-heading">Exporting your data</h6>
						<p>
							You may request at any time, via e-mail or our website dashboard
							to receive an electronic copy of all the personal information held
							about you.
						</p>

						<h6 className="sub-heading">Restricting access to your data</h6>
						<p>
							You may manage, via the website dashboard, what we can use your
							personal information for, such as opting out of receiving specific
							correspondence and marketing material.
						</p>

						<h6 className="sub-heading">Erasing your data</h6>
						<p className="mb-4">
							You may withdraw consent to the use of your data by closing your
							account, via e-mail or our website dashboard. We will erase all
							personal information held about you (to the extent that we are
							permitted by law) within 14 days of your request.
						</p>

						<h6 className="pt-3">4. UPDATES TO OUR PRIVACY POLICY</h6>
						<p>
							We may modify this Privacy Policy. The “Last updated” timestamp at
							the top of this Privacy Policy indicates when this Privacy Policy
							was last revised. You will be notified by e-mail whenever an
							updated version of this privacy policy is issued.
						</p>

						<h6>Contact</h6>
						<p>
							For any related enquires please contact us at{' '}
							<a href="mailto:contact@cointec.co.uk">contact@cointec.co.uk</a>{' '}
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

export default PrivacyPolicy
