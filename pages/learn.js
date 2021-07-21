import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

class Learn extends Component {
	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Learn | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header m-0" />

					{/* Hero Section */}
					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner learn">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading">Learn about cryptoassets</h1>
									{/* <h1 className="learn-heading d-block d-md-none">
										Learning portal
									</h1> */}
									<p>Our learning portal brings you up to speed with crypto.</p>
									{/* <p className="d-block d-md-none">
										Digital currency made simple
									</p> */}
								</div>
							</div>
						</div>
					</div>
					{/* Hero Section End */}
				</Header>

				<section className="page-content container">
					<div className="row">
						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="Cryptoasset Basics"
								description="This is a guide to learn the basics of the cryptoasset space if you're just getting started."
								image="/static/images/cryptoasset-basics.svg"
								linkText="Learn the basics"
								href="/digital-currency-basics"
								asLink="/learn/crypto-asset-basics"
							/>
						</div>

						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="Storing Cryptoassets"
								description="Familiarize yourself with how to store cryptoassets and the different wallet options available."
								image="/static/images/storing-cryptoassets.svg"
								linkText="Learn about wallets"
								href="/digital-wallets"
								asLink="/learn/digital-wallets"
							/>
						</div>

						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="Blockchain technology"
								description="Learn about the key concepts of blockchain technology and how it works."
								image="/static/images/blockchain-technology.svg"
								linkText="Learn about blockchain"
								href="/blockchain"
								asLink="/learn/blockchain"
							/>
						</div>

						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="Glossary of terms"
								description="Lookup common terms, fintech acronyms and investment jargon."
								image="/static/images/glossary-of-terms.svg"
								linkText="Lookup terms"
								href="/glossary-of-terms"
								asLink="/learn/glossary-of-terms"
							/>
						</div>

						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="Crypto Asset Glossary"
								description="Learn more about each cryptoasset - it's function and related networks."
								image="/static/images/cryptoasset-glossary.svg"
								linkText="Lookup cryptoassets"
								href="/glossary-of-tokens"
								asLink="/learn/crypto-asset-glossary"
							/>
						</div>

						<div className="col-sm-12 col-md-6 col-lg-4">
							<Card
								title="FAQs and support"
								description="Lookup commonly asked questions or contact support."
								image="/static/images/faqs-support.svg"
								linkText="Find answers"
								href="/"
								noPrefix={true}
							/>
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

const Card = ({
	title,
	description,
	image,
	linkText,
	href,
	noPrefix,
	asLink
}) => (
	<div className="learn-card text-center">
		<img src={image} alt={title} />
		<h5>{title}</h5>
		<p>{description}</p>
		<Link href={href} as={noPrefix ? undefined : `${asLink}`}>
			<a>{linkText}</a>
		</Link>
	</div>
)

export default Learn
