import React, { Component } from 'react'
import Head from 'next/head'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import {
	fetchOrders,
	fetchAssetsList,
	fetchVerificationStatus,
	toggleVerificationAlert,
	validateSession
} from '../store/actions'
import Moment from 'react-moment'
import cn from 'classnames'
import _ from 'lodash'

import Nav from '../components/dashboard/Nav'
import AlertMessage from '../components/dashboard/AlertMessage'
import TransactionDetail from '../components/dashboard/TransactionDetail'
import StickyFooter from '../components/StickyFooter'
import Pagination from '../components/Pagination'

const STATUS_LIST = [
	'COMPLETED',
	'PENDING',
	'REFUNDPENDING',
	'CANCELLED',
	'FAILED'
]

class Transactions extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentPage: 1,
			totalPages: 0,
			assetsImages: null,
			sortOrder: 'timestamp',
			sortDirection: 'desc',
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
					Router.push('/')
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
					<title>Transaction history | Cointec</title>
				</Head>
				<header>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<h2 className="dashboard-heading">Transaction history</h2>
					</div>
				</header>
				{/* {this.props.globals.verificationAlert && (
					<AlertMessage
						onHide={() => {
							this.props.toggleVerificationAlert(false)
							this.onResize()
						}}
					/>
				)} */}
				<div className="container dashboard-container mb-md-5">
					<div className="row">
						<div className="col">
							<div className="content-wrapper mb-md-4 p-0 h-auto">
								<TransactionTable
									currentPage={this.state.currentPage}
									orders={this.props.order.orders}
									assets={this.state.assetsImages}
									sortOrder={this.state.sortOrder}
									sortDirection={this.state.sortDirection}
									onSort={({ sortOrder, sortDirection }) =>
										this.setState({
											sortOrder,
											sortDirection
										})
									}
									onSelect={transaction =>
										this.setState({
											activeTransaction: transaction,
											transactionDetailModal: true
										})
									}
								/>
							</div>
							<Pagination
								currentPage={this.state.currentPage}
								totalPages={this.state.totalPages}
								className="d-none d-md-block"
								onChange={page =>
									this.setState({ currentPage: page }, () => this.onResize())
								}
							/>
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

	componentWillReceiveProps({ order, assets }) {
		const assetsImages = {}
		assets.list.Receive.forEach(asset => {
			assetsImages[asset.Name] = asset.Image
		})
		assets.list.Send.forEach(asset => {
			assetsImages[asset.Name] = asset.Image
		})
		this.setState(
			{
				totalPages:
					order.orders && order.orders.TransactionHistory
						? Math.ceil(
								order.orders.TransactionHistory.length /
									order.orders.TransactionsDisplayLimit
						  )
						: 0,
				assetsImages
			},
			() => {
				if (this.state.assetsImages) this.onResize()
			}
		)
	}
}

const TransactionTable = ({
	orders,
	assets,
	sortOrder,
	sortDirection,
	currentPage,
	onSelect,
	onSort
}) => {
	const transactionHistoryGroups =
		orders && orders.TransactionHistory
			? _.groupBy(orders.TransactionHistory, order =>
					new Date(order.createdAt * 1000).setHours(0, 0, 0, 0)
			  )
			: null
	return (
		<div>
			<table className="table d-none d-md-table">
				<thead>
					<tr>
						<th>Recent activity</th>
						<th
							className="d-none d-md-table-cell"
							style={{ cursor: 'pointer' }}
							onClick={() =>
								onSort({
									sortOrder: 'receiveAmount',
									sortDirection: sortDirection === 'desc' ? 'asc' : 'desc'
								})
							}>
							Receive amount
							<i className="fas fa-sort fa-sm ml-2" />
						</th>
						<th
							className="d-none d-lg-table-cell"
							style={{ cursor: 'pointer' }}
							onClick={() =>
								onSort({
									sortOrder: 'sendAmount',
									sortDirection: sortDirection === 'desc' ? 'asc' : 'desc'
								})
							}>
							Send amount
							<i className="fas fa-sort fa-sm ml-2" />
						</th>
						<th
							className="d-none d-md-table-cell"
							style={{ cursor: 'pointer' }}
							onClick={() =>
								onSort({
									sortOrder: 'timestamp',
									sortDirection: sortDirection === 'desc' ? 'asc' : 'desc'
								})
							}>
							Timestamp
							<i className="fas fa-sort fa-sm ml-2" />
						</th>
						<th
							style={{ cursor: 'pointer' }}
							onClick={() =>
								onSort({
									sortOrder: 'status',
									sortDirection: sortDirection === 'desc' ? 'asc' : 'desc'
								})
							}>
							Status
							<i className="fas fa-sort fa-sm ml-2" />
						</th>
					</tr>
				</thead>
				<tbody>
					<tr className="tr-empty">
						<td />
					</tr>
					{orders && orders.TransactionHistory ? (
						orders.TransactionHistory.sort((x, y) =>
							sortOrder === 'timestamp'
								? sortDirection === 'desc'
									? y.createdAt - x.createdAt
									: x.createdAt - y.createdAt
								: sortOrder === 'sendAmount'
								? sortDirection === 'desc'
									? y.sourceAmount - x.sourceAmount
									: x.sourceAmount - y.sourceAmount
								: sortOrder === 'receiveAmount'
								? sortDirection === 'desc'
									? y.destAmount - x.destAmount
									: x.destAmount - y.destAmount
								: sortOrder === 'status'
								? sortDirection === 'desc'
									? STATUS_LIST.indexOf(y.status.toUpperCase()) -
									  STATUS_LIST.indexOf(x.status.toUpperCase())
									: STATUS_LIST.indexOf(x.status.toUpperCase()) -
									  STATUS_LIST.indexOf(y.status.toUpperCase())
								: 0
						)
							.slice(
								(currentPage - 1) * orders.TransactionsDisplayLimit,
								(currentPage - 1) * orders.TransactionsDisplayLimit +
									orders.TransactionsDisplayLimit
							)
							.map((order, index) => (
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
										<Moment format="DD MMM hh:mmA">
											{order.createdAt * 1000}
										</Moment>
									</td>
									<td
										width="20%"
										className={cn(
											'transaction-status',
											order.status === 'COMPLETED'
												? 'completed'
												: order.status === 'FAILED' ||
												  order.status === 'CANCELLED'
												? 'failed'
												: ''
										)}>
										{order.status}
									</td>
								</tr>
							))
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
			<table className="table d-table d-md-none">
				<tbody>
					{transactionHistoryGroups ? (
						Object.keys(transactionHistoryGroups).map(group => [
							<tr className="tr-date" key={group}>
								<td colSpan="2">
									<Moment format="DD MMM YYYY">{parseInt(group)}</Moment>
								</td>
							</tr>,
							transactionHistoryGroups[group].map(order => (
								<tr
									width="50%"
									key={order.ctTransactionId}
									onClick={() => onSelect(order)}>
									{assets && (
										<td>
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
									<td
										width="50%"
										className={cn(
											'transaction-status',
											order.status === 'COMPLETED'
												? 'completed'
												: order.status === 'FAILED' ||
												  order.status === 'CANCELLED'
												? 'failed'
												: ''
										)}>
										{order.status}
									</td>
								</tr>
							))
						])
					) : (
						<tr className="no-result">
							<td colSpan="5">No results</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default connect(
	({ auth, order, assets, globals }) => ({ auth, order, assets, globals }),
	{
		fetchOrders,
		fetchVerificationStatus,
		fetchAssetsList,
		toggleVerificationAlert,
		validateSession
	}
)(withRouter(Transactions))
