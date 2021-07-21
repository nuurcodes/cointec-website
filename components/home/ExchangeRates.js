import React, { Component } from 'react'
import Link from 'next/link'
import Chart from './Chart'

class ExchangeRates extends Component {
	render() {
		return (
			// <div className="bg-gradient bg-mid-gradient">
			<div className="home-section chart-section container px-4">
				<div className="row flex-column-reverse flex-lg-row">
					<div className="col-12 col-lg-6 pr-lg-0 pr-lg-5 mt-4 mt-lg-0">
						<Chart />
						<p className="d-lg-none text-center mb-0">
							Still using Bitcoin to buy altcoins? Avoid slipping rates
							and benefit from our direct GBP trading pairs. No extra fees.
							Just one exchange rate.
						</p>
					</div>
					<div className="col-12 col-lg-6 px-4 px-lg-5 text-center text-lg-left">
						<h4 className="section-title d-none d-lg-block">
							Competitive exchange rates.
							{/* Receive your digital currencies in minutes, track every step. */}
						</h4>
						<h4 className="section-title d-lg-none">Competitive rates</h4>

						<p className="d-none d-lg-block">
							Still using Bitcoin to buy altcoins? Avoid slipping rates
							and benefits from our direct GBP trading pairs. No extra fees.
							Just one exchange rate.
						</p>

						{/* <Link href="/">
								<a className="d-none d-lg-inline">
									View all exchange rate charts
								</a>
							</Link> */}
					</div>
				</div>
			</div>
			// </div>
		)
	}
}

export default ExchangeRates
