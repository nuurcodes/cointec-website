import React from 'react'
import Link from 'next/link'

const Security = () => (
	<div className="bg-gradient bg-mid-gradient">
		<div className="home-section security-section container">
			<div className="row">
				<div className="col-12 col-lg-5 pr-lg-4 text-center text-lg-left">
					<h4 className="section-title d-none d-lg-block">
						{/* Your funds are secure throughout the transaction process. */}
						Robust Security Protocols.
					</h4>
					<h4 className="section-title d-lg-none">Robust Security Protocols</h4>

					<p className="d-none d-lg-block">
						We use TLS encryption to communicate data between our servers and
						websites. All user data is stored on our secure servers in
						accordance with data protection laws.
					</p>
				</div>
				<div className="col-lg-1" />
				<div className="col-12 col-lg-6 text-center">
					<img
						className="security-lock"
						src="/static/images/security-protocols.svg"
						alt="security-lock"
					/>
					<p className="d-lg-none text-center">
						We use TLS encryption to communicate data between our servers and
						websites. All user data is stored on our secure servers in
						accordance with data protection laws.
					</p>
					{/* <Link href="/">
					<a className="d-block d-lg-none">More on security</a>
				</Link> */}
				</div>
			</div>
		</div>
	</div>
)

export default Security
