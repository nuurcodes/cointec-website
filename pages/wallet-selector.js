import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { fetchVerificationStatus, fetchWallets } from '../store/actions'

import Header from '../components/Header'
import Nav from '../components/Nav'
import AddWallet from '../components/wallet-selector/AddWallet'
import Footer from '../components/Footer'

const walletLogo = {
	MEW: '/static/images/my-ether-wallet.png',
	MetaMask: '/static/images/meta-mask-wallet.png',
	Exodus: '/static/images/exodus-wallet.svg',
	Jaxx: '/static/images/jaxx-wallet.png'
}

const walletLinks = {
	MEW: 'https://www.myetherwallet.com/create-wallet',
	MetaMask: 'https://metamask.io/',
	Exodus: 'https://www.exodus.io/download/',
	Jaxx: 'https://jaxx.io/downloads.html'
}

const walletProps = {
	MEW: {
		line1: 'Launched July 2015',
		line2: 'On iOS, Android and Web',
		line3: 'Store ETH and ERC-20 tokens'
	},
	MetaMask: {
		line1: '1 million+ downloads',
		line2: 'Chrome, Firefox and Opera',
		line3: 'Store ETH and ERC-20 tokens'
	},
	Exodus: {
		line1: 'User friendly design',
		line2: 'Desktop, iOS and Android',
		line3: 'Supports 100+ assets'
	},
	Jaxx: {
		line1: 'All-in-one wallet',
		line2: 'iOS, Android, Web and Desktop',
		line3: 'Supports 80+ assets'
	}
}

class WalletSelector extends Component {
	constructor(props) {
		super(props)
		this.state = {
			addWalletModal: false,
			showDropdown: false,
			filteredAssets: [],
			searchWallet: '',
			selectedAsset: null,
			selectedWallet: null
		}
		this.handleInput = this.handleInput.bind(this)
		this.assetSelected = this.assetSelected.bind(this)
	}

	componentDidMount() {
		this.props.fetchWallets()
		addEventListener('click', this.onClickOutside)
	}

	componentWillUnmount() {
		removeEventListener('click', this.onClickOutside)
	}

	onClickOutside = event => {
		if (this.state.filteredAssets.length > 0) {
			const composedPath = el => {
				var path = []
				while (el) {
					path.push(el)
					if (el.tagName === 'HTML') {
						path.push(document)
						path.push(window)
						return path
					}
					el = el.parentElement
				}
			}
			let path = event.path || (event.composedPath && event.composedPath())
			if (!path) {
				path = composedPath(event.target)
			}
			const select =
				path &&
				path.find(
					node =>
						node.className && node.className.includes('wallet-dropdown-menu')
				)
			if (!select) {
				this.setState({
					showDropdown: false
				})
			}
		}
	}

	handleInput({ target }) {
		const word = target.value.toLowerCase().trim()
		this.setState({
			searchWallet: target.value,
			showDropdown: true,
			filteredAssets: this.props.assets.list.Receive
				? this.props.assets.list.Receive.filter(
						asset =>
							asset.Name.toLowerCase().startsWith(word) ||
							asset.FullName.toLowerCase().startsWith(word)
				  )
				: []
		})
	}

	assetSelected(asset) {
		this.setState({
			showDropdown: false,
			selectedAsset: asset,
			searchWallet: ''
		})
	}

	render() {
		const { wallets } = this.props.assets
		const displayWallets =
			wallets &&
			Object.keys(wallets)
				.map(key => {
					return {
						name: key,
						assets: wallets[key],
						logo: walletLogo[key],
						walletProps: walletProps[key]
					}
				})
				.filter(wallet =>
					this.state.selectedAsset
						? wallet.assets.includes(this.state.selectedAsset.Name)
						: true
				)

		return (
			<div className="wallet-selector-page">
				<Head>
					<title>Wallet Selector | Cointec</title>
				</Head>

				<Header background="gradient" style={{ overflow: 'initial' }}>
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="page-heading d-md-block d-none">
										Cryptoassets wallet selector
									</h1>
									<h1 className="page-heading d-block	d-md-none">
										Choosing a wallet
									</h1>
									<h6 className="page-sub-heading d-none d-sm-block">
										None of our recommended wallets take control of your private
										keys.
									</h6>
									<div className="search-bar">
										<input
											type="text"
											placeholder="Type in a asset to find compatible wallets"
											value={this.state.searchWallet}
											onChange={this.handleInput}
										/>
										<i className="far fa-search" />
									</div>

									<div>
										{this.state.showDropdown &&
											this.state.filteredAssets &&
											this.state.filteredAssets.length > 0 && (
												<div className="wallet-dropdown-menu dropdown-menu show">
													{this.state.filteredAssets.map((asset, index) =>
														asset.ShowWalletSelector === true &&
														asset.ShowGlobal === true ? (
															<div
																className="dropdown-item"
																key={index}
																onClick={() => this.assetSelected(asset)}>
																<img src={asset.Image} alt={asset.Name} />
																<span className="full-name">
																	{asset.FullName}
																</span>
																<span className="name">{asset.Name}</span>
															</div>
														) : null
													)}
												</div>
											)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Header>

				<section className="page-content dc-glossary container">
					<div className="row">
						<div className="col">
							<div className="content-wrapper wallet-list p-0 h-auto position-relative">
								<div className="row">
									{displayWallets &&
										displayWallets.map((wallet, index) => (
											<div key={index} className="col-lg-4 col-md-6">
												<WalletSelection
													name={wallet.name}
													logo={wallet.logo}
													walletProps={wallet.walletProps}
													onCreate={() =>
														this.setState({
															addWalletModal: true,
															selectedWallet: wallet
														})
													}
												/>
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<Footer backgroundColor="#fff" />

				{this.state.addWalletModal && (
					<AddWallet
						wallet={this.state.selectedWallet}
						onClose={() =>
							this.setState({
								addWalletModal: false
							})
						}
					/>
				)}

				<style jsx global>{`
					html {
						background: #f7f9fa;
					}
					html body {
						background: none;
						box-shadow: none;
					}
				`}</style>
			</div>
		)
	}
}

const WalletSelection = ({ name, logo, walletProps, onCreate }) => (
	<div className="wallet-selection">
		<div className="header">
			<img src={logo} alt="Meta Mask" />
		</div>
		<div className="wallet-body">
			<div className="wallet-prop">
				<i className="far fa-plus" />
				{walletProps.line1}
			</div>
			<hr className="m-0" />
			<div className="wallet-prop">
				<i className="far fa-plus" />
				{walletProps.line2}
			</div>
			<hr className="m-0" />
			<div className="wallet-prop">
				<i className="far fa-plus" />
				{walletProps.line3}
				<a onClick={onCreate}>
					<i className="fas fa-eye" />
				</a>
			</div>
		</div>
		<a className="btn-create" target="_blank" href={walletLinks[name]}>
			Create wallet
		</a>
	</div>
)

export default connect(
	({ auth, verification, accounts, globals, assets }) => ({
		auth,
		verification,
		accounts,
		globals,
		assets
	}),
	{
		fetchVerificationStatus,
		fetchWallets
	}
)(withRouter(WalletSelector))
