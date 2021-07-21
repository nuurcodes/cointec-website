import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import NavLink from '../NavLink'
import { connect } from 'react-redux'

import { validateSession, signOutSession } from '../../store/actions'

class Nav extends Component {
	constructor() {
		super()

		this.signOut = this.signOut.bind(this)
	}

	componentDidMount() {
		this.props.validateSession()
	}

	signOut() {
		this.props.signOutSession()
	}

	render() {
		return (
			<div className="container">
				<nav className="navbar navbar-custom navbar-expand-lg navbar-dark px-0">
					<Link href="/">
						<a className="navbar-brand">
							<img
								src="/static/images/logo-white.svg"
								className="img-fluid mx-auto d-block"
								alt="Logo"
							/>
						</a>
					</Link>

					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation">
						<img
							className="currency-symbol"
							src="/static/images/menu-icon.svg"
							alt="Menu Icon"
						/>
					</button>

					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav w-100 align-items-lg-center">
							<li className="nav-item">
								<NavLink href="/dashboard" className="dash-nav-link">
									Dashboard
								</NavLink>
							</li>
							<li className="nav-item mr-md-auto">
								<NavLink href="/transactions" className="dash-nav-link">
									Transactions
								</NavLink>
							</li>
							<li className="nav-item">
								<Link href="/exchange">
									<a className="nav-link">Exchange</a>
								</Link>
							</li>
							<li className="nav-item">
								<div className="btn-group dashboard-menu d-block d-lg-inline-flex">
									<button
										type="button"
										className="btn btn-dropdown d-none d-lg-inline-block"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false">
										<img src="/static/images/user-circle.svg" alt="user-menu" />
										<i className="far fa-angle-down" />
									</button>
									<a
										className="nav-link d-inline-block d-lg-none"
										data-toggle="dropdown"
										aria-haspopup="true"
										aria-expanded="false">
										Your account
										<i className="far fa-angle-down pl-2" />
									</a>
									<div className="dropdown-menu dropdown-menu-right">
										<Link href="/account-settings">
											<a className="dropdown-item">
												<i className="far fa-cog" />
												Account settings
											</a>
										</Link>
										<Link
											href="/transaction-limits"
											as="/account-settings/transaction-limits">
											<a className="dropdown-item">
												<i className="far fa-random" />
												Transaction limits
											</a>
										</Link>
										<Link
											href="/bank-accounts"
											as="/account-settings/bank-accounts">
											<a className="dropdown-item">
												<i className="far fa-university" />
												Bank accounts
											</a>
										</Link>
										<Link href="/privacy" as="/account-settings/privacy">
											<a className="dropdown-item">
												<i className="far fa-eye-slash" />
												Privacy
											</a>
										</Link>
										<button
											className="dropdown-item d-none d-lg-block"
											type="button"
											style={{ cursor: 'pointer' }}
											onClick={this.signOut}>
											<i className="far fa-sign-out" />
											Sign out
										</button>
									</div>
								</div>
							</li>
							<li className="nav-item d-block d-lg-none">
								<a
									href="https://intercom.help/cointec-test"
									className="nav-link">
									Support
								</a>
							</li>
							<li className="nav-item d-lg-none">
								<a className="nav-link" onClick={this.signOut}>
									Sign out
								</a>
							</li>
						</ul>
					</div>
				</nav>
			</div>
		)
	}
}

export default connect(
	({ auth }) => ({ auth }),
	{ validateSession, signOutSession }
)(Nav)
