import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import _ from 'lodash'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Calculator from '../components/home/Calculator'
import CurrencySlider from '../components/home/CurrencySlider'
import CointecComparison from '../components/home/CointecComparison'
import GetStarted from '../components/home/GetStarted'
import ExchangeRates from '../components/home/ExchangeRates'
import DigitalCurrencies from '../components/home/DigitalCurrencies'
import Tracking from '../components/home/Tracking'
import Security from '../components/home/Security'
import Subscribe from '../components/home/Subscribe'
import Footer from '../components/Footer'

import { fetchAssetsList } from '../store/actions'

class Home extends Component {
	render() {
		const coinName = this.props.router.query.buy
		const [coin] = this.props.assets.list.Receive.filter(asset => _.kebabCase(asset.FullName) === coinName)
		const title = coin ? `Buy ${coin.FullName} | Cointec` : 'Crypto Asset Investing | Cointec'
		return (
			<div>
				<Head>
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:site" content="@Cointec" />
					<meta name="twitter:title" content="Say hello to a new kind of money." />
					<meta name="twitter:description" content="Buy 30 digital currencies using Bank Transfer or GBP." />
					<meta name="twitter:image" content="../static/images/twitterCard.png" />
					<title>{title}</title>
				</Head>
				<Header background="gradient" style={{ overflow: 'initial' }}>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<div className="hero-wrapper">
							<div className="row">
								<div className="col-12 col-lg-6 hero-text">
									<h1 className="hero-title">
										Say hello to a new
										<br />
										kind of asset.
									</h1>
									<h2 className="hero-intro d-block">
										<span className="d-none d-sm-inline">Invest in 20+ Crypto Assets with UK bank transfer.</span>
										<span className="d-inline d-sm-none">Invest in 20+ Crypto Assets. Simple. Secure.</span>{' '}
										<br className="d-none d-md-inline" />
										<span className="d-none d-sm-inline">Simple. Secure. Create an account today to get started.</span>
									</h2>
									<div className="hero-link my-md-0">
										<Link href="/learn">
											<a>New to Crypto Assets? Learn more</a>
										</Link>
									</div>
								</div>
								<div className="d-none d-lg-flex col-lg-1 col-xl-2" />
								<div id="main-calc" className="col-12 col-lg-5 col-xl-4 hero-calculator pl-xl-0">
									<div className="calculator-wrapper">
										<Calculator />
									</div>
								</div>
							</div>
						</div>
					</div>
				</Header>

				<CurrencySlider />
				<CointecComparison />
				<GetStarted />
				<ExchangeRates />
				<DigitalCurrencies />
				<Tracking />
				<Security />
				<Subscribe />

				<Footer backgroundColor="#fff" />
			</div>
		)
	}
}

const mapStateToProps = ({ auth, assets }) => ({ auth, assets })
const mapDispatchToProps = { fetchAssetsList }
const withRedux = connect(
	mapStateToProps,
	mapDispatchToProps
)

export default withRedux(withRouter(Home))
