import React, { Component } from 'react'
import Link from 'next/link'

class Subscribe extends Component {
	render() {
		return (
			<div className="bg-gradient bg-primary-gradient up no-pt-events">
				<div className="start-buying-wrapper">
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-8 col-lg-6 mx-auto text-center">
								<h2 className="start-buying-title text-white">
									Get started today
								</h2>

								<div className="form-group m-0">
									<Link href="/signup">
										<button className="btn btn-outline-success py-2 px-4">
											Create an account
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Subscribe
