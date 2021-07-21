import React from 'react'
import Link from 'next/link'

const DigitalCurrencies = () => (
	<div className="bg-gradient bg-mid-gradient">
		<div className="home-section container digital-currencies-section">
			<div className="row">
				<div className="col-12 col-lg-5 text-center text-lg-left">
					<h4 className="section-title d-none d-lg-block">
						{/* Choose from 20 of the most popular digital currencies. */}
						Our 50 Crypto Assets.
					</h4>
					<h4 className="section-title d-lg-none">Our 50 Crypto Assets</h4>

					<p className="d-none d-lg-block">
						Find the most popular tokens and altcoins here.
						We're the only exchange to offer direct GBP trading
						pairs for dozens of Crypto Assets.
					</p>

					<Link href="/digital-currency-list" as="/crypto-asset-list">
						<a className="d-none d-lg-inline-block">
							View our complete selection
						</a>
					</Link>
				</div>
				<div className="col-lg-1" />
				<div className="col-12 col-lg-6 text-center mt-4 mt-lg-0">
					{/* <img
						className="digital-currencies-art"
						src="/static/images/digital-currencies.png"
					/> */}
					<div className="currencies-group">
						<img src="/static/images/cg-image-1.svg" />
						<img src="/static/images/cg-image-2.svg" />
						<img src="/static/images/cg-image-3.svg" />
						<img src="/static/images/cg-image-4.svg" />
						<img src="/static/images/cg-image-5.svg" />
						<img src="/static/images/cg-image-1.svg" />
						<img src="/static/images/cg-image-6.svg" />
						<img src="/static/images/cg-image-7.svg" />
					</div>
					<p className="d-lg-none text-center">
						Find the most popular tokens and altcoins here.
						We're the only exchange to offer direct GBP trading
						pairs for dozens of Crypto Assets.
					</p>
					<Link href="/digital-currency-list" as="/crypto-asset-list">
						<a className="d-lg-none">View our complete selection</a>
					</Link>
				</div>
			</div>
		</div>
	</div>
)

export default DigitalCurrencies
