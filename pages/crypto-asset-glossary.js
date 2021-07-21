import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import _ from 'lodash'
import { connect } from 'react-redux'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/learn/Sidebar'

import { fetchAssetsList } from '../store/actions'

class GlossaryOfTokens extends Component {
	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Crypto Asset Glossary | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header" />

					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading dc-basics-heading">
										Crypto Asset Glossary
									</h1>
								</div>
							</div>
						</div>
					</div>
				</Header>

				<section className="learn-breadcrumb">
					<div className="container">
						<ul>
							<li>
								<Link href="/learn">
									<a>Learn /</a>
								</Link>
							</li>
							<li> Crypto Asset Glossary</li>
						</ul>
					</div>
				</section>

				<section className="page-content dc-glossary container">
					<div className="row">
						<div className="col-12 col-lg-8">
							<div className="glossary-wrapper tokens">
								{this.props.assets.list.Receive.map(asset => (
									asset.ShowCurrencyList === true && asset.ShowGlobal === true ?
										<Currency
											key={asset.Name}
											name={asset.Name}
											fullName={asset.FullName}
											image={asset.Image}
											description={asset.Description}
										/>
										: null
								))}
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

const Currency = ({ name, fullName, image, description }) => (
	<div className="token-group">
		<h6 className="token-heading">
			<img src={image} alt={image} />
			{fullName} ({name})
		</h6>
		<p className="token-description">
			{description}
		</p>
		<hr />
	</div>
)

export default connect(
	({ assets }) => ({ assets }),
	{ fetchAssetsList }
)(GlossaryOfTokens)
