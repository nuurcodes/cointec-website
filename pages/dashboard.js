import React, { Component } from 'react'
import Head from 'next/head'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
	fetchOrders,
	fetchAssetsList,
	fetchVerificationStatus,
	toggleVerificationAlert,
	validateSession,
	signOutSession
} from '../store/actions'
import Moment from 'react-moment'
import cn from 'classnames'

import Nav from '../components/dashboard/Nav'
import AlertMessage from '../components/dashboard/AlertMessage'
import TransactionDetail from '../components/dashboard/TransactionDetail'
import Chart from '../components/dashboard/Chart'
import Calculator from '../components/home/Calculator'
import StickyFooter from '../components/StickyFooter'

const dev = process.env.NODE_ENV !== 'production'

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			assetsImages: null,
			transactionDetailModal: false,
			activeTransaction: null,
			scrolling: false
		}
	}

	componentDidMount() {
		const session = this.props.validateSession()
		if (session) {
			const ctUser = session['CT-ACCOUNT-ID']
			this.props.fetchVerificationStatus({ ctUser })
			this.props.fetchOrders().catch(err => {
				if (err.response.status === 401) {
					this.props.signOutSession()
				}
			})
		} else {
			Router.push(`/login?redirectPath=${this.props.router.pathname}`)
		}

		addEventListener('resize', this.onResize)
		this.onResize()
	}

	componentWillUnmount() {
		removeEventListener('resize', this.onResize)
		const tooltip = document.querySelector('#chartjs-tooltip')
		if (tooltip) {
			// remove chart tooltip when unmounted
			if (tooltip.remove) {
				tooltip.remove()
			} else {
				tooltip.parentNode.removeChild(tooltip)
			}
		}
	}

	onResize = () => {
		const element = document.querySelector('.dashboard-page')
		const documentElement = document.documentElement

		this.setState({
			scrolling:
				element && documentElement
					? documentElement.clientHeight < element.scrollHeight
					: false,
			docWidth: documentElement.clientWidth
		})
	}

	render() {
		return (
			<div
				className="dashboard-page full-height"
				style={{ background: '#F7F9FA', overflowY: 'scroll' }}>
				<Head>
					<title>Dashboard | Cointec</title>
				</Head>
				<header>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<h2 className="dashboard-heading">Dashboard</h2>
					</div>
				</header>
				{/* {this.state.verificationAlert && (
					<AlertMessage
						onHide={() => {
							this.props.toggleVerificationAlert(false)
							this.onResize()
						}}
					/>
				)} */}
				<div className="container dashboard-container">
					<div className="row flex-column-reverse flex-lg-row">
						<div className="col-12 col-lg-chart mt-4 mt-lg-0">
							<div className="content-wrapper">
								<Chart />
							</div>
						</div>
						<div className="col-12 col-lg-calc hero-calculator">
							<div className="content-wrapper calculator-wrapper">
								<Calculator />
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col">
							<div className="content-wrapper mt-4 p-0 h-auto">
								<TransactionTable
									orders={this.props.order.orders}
									assets={this.state.assetsImages}
									onSelect={transaction =>
										this.setState({
											activeTransaction: transaction,
											transactionDetailModal: true
										})
									}
								/>
							</div>
						</div>
					</div>
				</div>
				<StickyFooter className="bg-white" fixed={!this.state.scrolling} />
				{this.state.transactionDetailModal && (
					<TransactionDetail
						transaction={this.state.activeTransaction}
						onClose={() =>
							this.setState({
								activeTransaction: null,
								transactionDetailModal: false
							})
						}
					/>
				)}
				<style jsx global>{`
					#intercom-container {
						display: ${this.state.docWidth > 768 ? 'block' : 'none'};
					}
				`}</style>
			</div>
		)
	}

	componentWillReceiveProps(props) {
		const { assets, globals, verification } = props

		const assetsImages = {}
		assets.list.Receive.forEach(asset => {
			assetsImages[asset.Name] = asset.Image
		})
		assets.list.Send.forEach(asset => {
			assetsImages[asset.Name] = asset.Image
		})

		const verificationAlert =
			globals.verificationAlert &&
			verification.status &&
			!verification.status.VerificationComplete
		this.setState(
			{
				assetsImages,
				verificationAlert
			},
			() => {
				if (this.state.assetsImages) this.onResize()
			}
		)
	}
}

const TransactionTable = ({ orders, assets, onSelect }) => (
	<table className="table">
		<thead>
			<tr>
				<th>Recent activity</th>
				<th className="d-none d-md-table-cell">Receive amount</th>
				<th className="d-none d-lg-table-cell">Send amount</th>
				<th className="d-none d-md-table-cell">Timestamp</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			<tr className="tr-empty">
				<td />
			</tr>
			{orders && orders.TransactionHistory ? (
				orders.TransactionHistory.slice(0, orders.HomepageDisplayLimit).map(
					(order, index) => (
						<tr
							key={order.ctTransactionId}
							className={index === 0 ? 'no-border' : ''}
							onClick={() => onSelect(order)}>
							{assets && (
								<td width="20%">
									<img src={assets[order.sourceCurrency]} />
									<i className="far fa-long-arrow-right fa-lg d-none d-md-inline" />
									<img
										className="d-none d-md-inline"
										src={assets[order.destCurrency]}
									/>
									<span className="d-inline d-md-none pl-3">
										+{order.destAmount.toFixed(8)}
									</span>
								</td>
							)}
							<td width="20%" className="d-none d-md-table-cell">
								{order.destAmount.toFixed(8)}
							</td>
							<td width="20%" className="d-none d-lg-table-cell">
								{order.sourceAmount.toFixed(
									order.sourceCurrency === 'GBP' ? 2 : 8
								)}{' '}
								{order.sourceCurrency}
							</td>
							<td width="20%" className="d-none d-md-table-cell">
								<Moment format="DD MMM hh:mmA">{order.createdAt * 1000}</Moment>
							</td>
							<td
								width="20%"
								className={cn(
									'transaction-status',
									order.status === 'COMPLETED'
										? 'completed'
										: order.status === 'FAILED' || order.status === 'CANCELLED'
										? 'failed'
										: ''
								)}>
								{order.status}
							</td>
						</tr>
					)
				)
			) : (
				<tr className="no-result">
					<td colSpan="5">No recent transactions</td>
				</tr>
			)}
			<tr className="tr-empty">
				<td />
			</tr>
		</tbody>
	</table>
)

export default connect(
	({ order, assets, globals, verification }) => ({
		order,
		assets,
		globals,
		verification
	}),
	{
		fetchOrders,
		fetchAssetsList,
		fetchVerificationStatus,
		toggleVerificationAlert,
		validateSession,
		signOutSession
	}
)(withRouter(Dashboard))
