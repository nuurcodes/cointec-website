import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import _ from 'lodash'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Sidebar from '../components/learn/Sidebar'

class DigitalWallets extends Component {
	constructor() {
		super()
		this.state = {
			list: _.times(7, () => ({
				question: 'What are digital currencies?',
				answer: `
          Anti-money Laundering is the principle of preventing financial criminals from
          transforming money obtained from illegal activities into “clean” money . In
          order to do this, businesses that provide money services take a number of
          measures to ensure source of user funds are legitimate.`
			}))
		}
	}

	render() {
		return (
			<div className="learn-page">
				<Head>
					<title>Digital Wallets | Cointec</title>
				</Head>
				<Header background="gradient" deco={false}>
					<Nav />
					<hr className="hr-header" />

					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="learn-heading dc-basics-heading">
										Digital wallets
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
							<li> Digital wallets</li>
						</ul>
					</div>
				</section>

				<section className="page-content dc-basics-content container">
					<div className="row">
						<div className="col-12 col-lg-8">
							<div id="accordion" className="accordion">
								{this.state.list.map((item, index) => (
									<div className="accordion-panel" key={index}>
										<h5
											className="accordion-header m-0 collapsed"
											data-toggle="collapse"
											data-target={`#content-${index}`}>
											{item.question}
										</h5>
										<div
											id={`content-${index}`}
											className="collapse"
											data-parent="#accordion">
											<div className="accordion-body">{item.answer}</div>
										</div>
									</div>
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

export default DigitalWallets
