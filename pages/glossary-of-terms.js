import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import _ from 'lodash'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/learn/Sidebar'

class GlossaryOfTerms extends Component {
	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Glossary Of Terms | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header" />

					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading">Glossary Of Terms</h1>
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
							<li> Glossary Of Terms</li>
						</ul>
					</div>
				</section>

				<section className="page-content dc-glossary container">
					<div className="row">
						<div className="col-12 col-lg-8">
							<div className="glossary-wrapper">
								<div className="term-groups">
									<div className="initial-letter">Aa</div>
									<h6 className="term-heading">AML(Anti-Money Laundering)</h6>
									<p className="term-description">
										Anti-money Laundering is the principle of preventing
										financial criminals from transforming money obtained from
										illegal activities into “clean” money. In order to do this,
										businesses that provide money services take a number of
										measures to ensure source of user funds are legitimate.
									</p>
									<h6 className="term-heading">AML(Anti-Money Laundering)</h6>
									<p className="term-description">
										Anti-money Laundering is the principle of preventing
										financial criminals from transforming money obtained from
										illegal activities into “clean” money. In order to do this,
										businesses that provide money services take a number of
										measures to ensure source of user funds are legitimate.
									</p>
								</div>

								<div className="term-groups">
									<div className="initial-letter">Bb</div>
									<h6 className="term-heading">AML(Anti-Money Laundering)</h6>
									<p className="term-description">
										Anti-money Laundering is the principle of preventing
										financial criminals from transforming money obtained from
										illegal activities into “clean” money. In order to do this,
										businesses that provide money services take a number of
										measures to ensure source of user funds are legitimate.
									</p>
									<h6 className="term-heading">AML(Anti-Money Laundering)</h6>
									<p className="term-description">
										Anti-money Laundering is the principle of preventing
										financial criminals from transforming money obtained from
										illegal activities into “clean” money. In order to do this,
										businesses that provide money services take a number of
										measures to ensure source of user funds are legitimate.
									</p>
								</div>
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

export default GlossaryOfTerms
