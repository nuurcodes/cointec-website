import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchAssetsList } from '../../store/actions'
import cn from 'classnames'

const walletLinks = {
	MEW: 'https://www.myetherwallet.com/getting-started',
	MetaMask: 'https://metamask.io/',
	Exodus: 'https://www.exodus.io/download/',
	Jaxx: 'https://jaxx.io/downloads.html'
}

class AddWallet extends Component {
	constructor() {
		super()
		this.state = {
			closed: false,
			searchCoin: ''
		}
		this.onClose = this.onClose.bind(this)
		this.onClickOutside = this.onClickOutside.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	onClose() {
		this.setState(
			{
				closed: true
			},
			() => {
				setTimeout(() => {
					this.props.onClose()
				}, 300)
			}
		)
	}

	componentDidMount() {
		setTimeout(() => {
			addEventListener('click', this.onClickOutside)
		}, 500)
	}

	componentWillUnmount() {
		removeEventListener('click', this.onClickOutside)
	}

	onClickOutside = event => {
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
			path.find(node => node.className === 'modal-dialog modal-add-wallet')
		if (!select) {
			this.onClose()
		}
	}

	handleChange({ target }) {
		this.setState({
			searchCoin: target.value
		})
	}

	render() {
		const word = this.state.searchCoin.toLowerCase().trim()
		const assets =
			this.props.assets.list &&
			this.props.assets.list.Receive.filter(
				asset =>
					this.props.wallet.assets.includes(asset.Name) &&
					(asset.Name.toLowerCase().startsWith(word) ||
						asset.FullName.toLowerCase().startsWith(word))
			)

		return (
			<div
				className="modal fade show"
				id="abandon-order-modal"
				role="dialog"
				data-backdrop="false"
				style={{ display: 'block' }}>
				<div
					className="modal-dialog modal-add-wallet"
					role="document"
					style={{ transform: this.state.closed ? 'translateY(-120%)' : '' }}>
					<div className="modal-content">
						<div className="modal-header">
							{/* <img src="/static/images/meta-mask.svg" /> */}
							<img src={this.props.wallet.logo} />
							<button type="button" className="close" onClick={this.onClose}>
								<i className="far fa-times fa-sm" />
							</button>
						</div>
						<div className="modal-body">
							<div className="search-coin">
								<input
									type="text"
									placeholder="Search supported coins"
									value={this.state.searchCoin}
									onChange={this.handleChange}
								/>
								<i className="far fa-search" />
							</div>
							<div className="coin-list">
								{assets.map(asset => (
									asset.ShowWalletSelector === true && asset.ShowGlobal === true ?
										<div className="list-item" key={asset.Name}>
											<img src={`${asset.Image}`} alt={asset.Name} />
											{asset.FullName}
										</div>
										: null
								))}
							</div>

							<a
								target="_blank"
								href={walletLinks[this.props.wallet.name]}
								className="create-wallet-link">
								Create wallet
							</a>
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentWillReceiveProps(props) {
		console.log(props.assets)
	}
}

export default connect(
	({ assets }) => ({ assets }),
	{ fetchAssetsList }
)(AddWallet)
