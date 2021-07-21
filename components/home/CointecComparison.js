import React, { Component } from 'react'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { fetchWallets } from '../../store/actions'
import _ from 'lodash'

const majorCoins = ['BTC', 'ETH', 'LTC', 'BCH', 'ETC']

const walletLinks = {
	MyEtherWallet: 'https://www.myetherwallet.com/getting-started',
	MetaMask: 'https://metamask.io/',
	Exodus: 'https://www.exodus.io/download/',
	Jaxx: 'https://jaxx.io/downloads.html'
}

class CointecComparison extends Component {
	componentWillMount() {
		this.props.fetchWallets()
	}

	render() {
		const coinName = this.props.router.query.buy
		const [coin] = this.props.assets.list.Receive.filter(
			asset =>
				_.kebabCase(asset.FullName) === coinName &&
				!majorCoins.includes(asset.Name)
		)
		let AssetPrimaryWallet
		if (coin && this.props.assets.wallets) {
			if (this.props.assets.wallets['Exodus'].includes(coin.Name)) {
				AssetPrimaryWallet = 'Exodus'
			} else if (this.props.assets.wallets['MEW'].includes(coin.Name)) {
				AssetPrimaryWallet = 'MyEtherWallet'
			} else if (this.props.assets.wallets['MetaMask'].includes(coin.Name)) {
				AssetPrimaryWallet = 'MetaMask'
			} else if (this.props.assets.wallets['Jaxx'].includes(coin.Name)) {
				AssetPrimaryWallet = 'Jaxx'
			}
		}
		if (coin && coin.ShowCointecVs === true && coin.ShowGlobal === true) {
			return (
				<div className="home-section comparison-section container">
					<div className="row">
						<div className="col px-3 px-sm-0">
							<h4 className="section-title text-center">
								The easiest way to buy{' '}
								{coin ? (
									<>
										<strong className="d-block d-sm-inline">{coin.Name}</strong>
									</>
								) : (
									'digital currency'
								)}
								<img src={coin.Image} className="currency-preview" />
							</h4>
						</div>
					</div>
					<div className="d-flex justify-content-center flex-column flex-lg-row">
						<div className="with-cointec">
							<h3 className="section-subtitle">With Cointec</h3>
							<ul className="deco-primary">
								{AssetPrimaryWallet ? (
									<li>
										Create {AssetPrimaryWallet === 'Exodus' ? 'an' : 'a'}{' '}
										<a target="_blank" href={walletLinks[AssetPrimaryWallet]}>
											{AssetPrimaryWallet}
										</a>{' '}
										wallet
									</li>
								) : (
									<li>Create an external wallet</li>
								)}
								{coin ? (
									<li>
										Buy and send{' '}
										<strong className="d-none d-sm-inline">
											{coin.FullName}
										</strong>
										<strong className="d-inline d-sm-none">{coin.Name}</strong>{' '}
										to your wallet
									</li>
								) : (
									<li>Send up to 30 altcoins to your wallet</li>
								)}
							</ul>
							<a>
								Get your assets in <b>10 minutes</b>
							</a>
						</div>
						<div className="divider d-none d-lg-block" />
						<div className="without-cointec">
							<h3 className="section-subtitle">Without Cointec</h3>
							<ul>
								<li>Buy Bitcoin</li>
								<li>Send Bitcoin to an altcoin exchange</li>
								{coin ? (
									<li>
										Trade Bitcoin for{' '}
										<strong className="d-none d-sm-inline">
											{coin.FullName}
										</strong>
										<strong className="d-inline d-sm-none">{coin.Name}</strong>{' '}
										on the exchange
									</li>
								) : (
									<li>Trade Bitcoin for Polymath on the exchange</li>
								)}
								{AssetPrimaryWallet ? (
									<li>
										Create {AssetPrimaryWallet === 'Exodus' ? 'an' : 'a'}{' '}
										{AssetPrimaryWallet} wallet
									</li>
								) : (
									<li>Create an external wallet for the altcoin</li>
								)}
								{coin ? (
									<li>
										Send{' '}
										<strong className="d-none d-sm-inline">
											{coin.FullName}
										</strong>
										<strong className="d-inline d-sm-none">{coin.Name}</strong>{' '}
										to your wallet
									</li>
								) : (
									<li>Send altcoins to external wallet</li>
								)}
							</ul>
							<a>
								Get your assets in <b>~ 1 hr</b>
							</a>
						</div>
					</div>
				</div>
			)
		} else {
			return null
		}
	}

	componentWillReceiveProps(props) {
		// console.log(props.assets.wallets)
	}
}

export default connect(
	({ assets }) => ({ assets }),
	{ fetchWallets }
)(withRouter(CointecComparison))
