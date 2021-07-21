import React from 'react'
import Link from 'next/link'

const Tracking = () => (
	// <div className="bg-gradient bg-mid-gradient">
	<div className="home-section tracking-section container px-4">
		<div className="row flex-column-reverse flex-lg-row">
			<div className="col-12 col-lg-6 pr-lg-0 pr-lg-5 mt-4 mt-lg-0">
				<div className="card-tracking pro d-flex justify-content-between px-4 mx-auto mx-lg-0">
					<div>
						<i className="far fa-check fa-lg mr-3" /> You sent payment
					</div>
					<span className="time">17:00PM</span>
				</div>
				<div className="card-tracking pro d-flex justify-content-between px-4 mx-auto mx-lg-0">
					<div>
						<i className="far fa-check fa-lg mr-3" /> We received payment
					</div>
					<span className="time">17:02PM</span>
				</div>
				<div className="card-tracking sent d-flex justify-content-between px-4 mx-auto mx-lg-0">
					<div>
						<i className="far fa-check fa-lg mr-3" /> Assets sent
					</div>
					<span className="time">17:05PM</span>
				</div>
				<p className="d-lg-none text-center">
					We understand exchanges can be long winded. Our automated
					order engine takes you from GBP to Crypto in minutes.
					Track every step of your order in real time.
				</p>
				<div className="text-center">
					<Link href="/">
						<a className="d-lg-none">Make your first order</a>
					</Link>
				</div>
			</div>
			<div className="col-12 col-lg-6 px-4 px-lg-5 text-center text-lg-left">
				<h4 className="section-title d-none d-lg-block">
					Invest in minutes. Not hours
				</h4>
				<h4 className="section-title d-lg-none">Invest in minutes. Not hours</h4>

				<p className="d-none d-lg-block">
					We understand exchanges can be long winded. Our automated
					order engine takes you from GBP to Crypto in minutes.
					Track every step of your order in real time.
				</p>

				<Link href="/">
					<a className="d-none d-lg-inline-block">
						Make your first order
					</a>
				</Link>
			</div>
		</div>
	</div>
	// </div>
)

export default Tracking
