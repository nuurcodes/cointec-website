import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import {
	fetchAssetsList,
	setCurrentAsset,
	fetchTickers
} from '../../store/actions'
import _ from 'lodash'

class CurrencySlider extends Component {
	constructor() {
		super()
		this.state = {
			sliderActive: false
		}
	}
	componentDidMount() {
		this.props.fetchTickers()
	}

	render() {
		const { tickers } = this.props
		return (
			<div className="bg-gradient bg-mid-gradient d-none d-md-block">
				<div className="currency-slider container">
					<div className="row">
						<div className="col px-0">
							<div
								className="currency-carousel"
								style={{ opacity: this.state.sliderActive ? 1 : 0 }}>
								{tickers &&
									tickers.map(asset =>
										asset.ShowCarousel === true && asset.ShowGlobal === true ? (
											<Link
												as={asset.SeoURL}
												href={asset.SeoURL}
												key={asset.Name}>
												<a
													className="currency-item"
													onClick={() =>
														this.props.setCurrentAsset(asset.Name)
													}>
													<img src={asset.Image} alt={asset.Name} />
													<label className="m-0">
														<div className="asset-pair text-left">
															{'GBP / ' + asset.Name}
														</div>
														<div className="ticker-info">
															{Number.parseFloat(asset.Rate).toFixed(
																asset.Rate >= 0.1 ? 2 : 3
															)}{' '}
															{asset.Change > 0 ? (
																<small className="positive">
																	{`+ ${asset.Change}%`}
																</small>
															) : (
																<small className="nagetive">
																	{`- ${Math.abs(asset.Change)}%`}
																</small>
															)}
														</div>
													</label>
												</a>
											</Link>
										) : null
									)}
							</div>
						</div>
					</div>
				</div>
				<hr className="m-0" style={{ borderTop: '1px solid #E5E5E5' }} />
			</div>
		)
	}

	componentWillReceiveProps(props) {
		if (props.tickers && !this.state.sliderActive) {
			this.setState(
				{
					sliderActive: true
				},
				() => {
					$('.currency-carousel').slick({
						infinite: true,
						slidesToShow: 5,
						slidesToScroll: 5,
						responsive: [
							{
								breakpoint: 992,
								settings: {
									infinite: true,
									slidesToShow: 3,
									slidesToScroll: 3
								}
							},
							{
								breakpoint: 480,
								settings: {
									infinite: true,
									slidesToShow: 2,
									slidesToScroll: 2
								}
							}
						]
					})
				}
			)
		}
	}
}

export default connect(
	({ assets, assets: { list, tickers } }) => {
		return {
			assets,
			tickers:
				tickers &&
				list.Receive.filter(asset =>
					tickers.find(ticker => `GBP${asset.Name}` === ticker.AssetPair)
				).map(asset => ({
					...asset,
					...tickers.find(ticker => `GBP${asset.Name}` === ticker.AssetPair)
				}))
		}
	},
	{ fetchAssetsList, setCurrentAsset, fetchTickers }
)(CurrencySlider)
