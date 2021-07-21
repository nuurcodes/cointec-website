import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'

import Header from '../components/Header'
import StickyFooter from '../components/StickyFooter'

class TransactionExpired extends Component {
	constructor() {
		super()
		this.state = {}
	}

	render() {
		const { txnID } = this.props.router.query

		return (
			<div
				className="no-access-page full-height"
				style={{ backgroundColor: '#F7F9FA' }}>
				<Head>
					<title>Transaction Expired | Cointec</title>
				</Head>

				<Header>
					<Nav />
				</Header>

				<div className="content-wrapper">
					{/* <div className="sg-logo text-center position-relative">
						<Link href="/">
							<a>
								<img src="/static/images/footer-logo.svg" alt="logo" />
							</a>
						</Link>
					</div> */}
					<div className="alert-box">
						<div className="alert-header">
							<h6 className="heading">Transaction {txnID} not found</h6>
						</div>
						<div className="alert-body">
							<p className="message-text">
								We were unable to find this transaction. Visit your{' '}
								<Link href="/transactions">
									<a>transaction history</a>
								</Link>{' '}
								to see all pending and historic transactions.
							</p>
						</div>
					</div>
				</div>

				<StickyFooter className="bg-white" fixed={true} />
			</div>
		)
	}
}

const Nav = () => (
	<div className="container">
		<nav className="navbar navbar-custom navbar-expand-lg navbar-exchange">
			<div className="col-6 d-none d-md-flex">
				<Link href="/">
					<a className="navbar-brand">
						<img
							src="/static/images/footer-logo.svg"
							className="img-fluid mx-auto d-block"
							alt="Logo"
						/>
					</a>
				</Link>
			</div>
			<ul className="col-6 navbar-nav justify-content-end align-items-lg-center text-right">
				<li className="nav-item">
					<Link href="/">
						<a className="nav-link">
							<i className="far fa-times" />
						</a>
					</Link>
				</li>
			</ul>
		</nav>
	</div>
)

export default withRouter(TransactionExpired)
