import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

const Footer = props => (
	<footer
		style={{
			backgroundColor: props.backgroundColor,
			borderTop: '1px solid #D5DCE0'
		}}>
		<div className="container">
			<div className="row">
				<div className="col-12 col-lg-3 d-block d-sm-flex justify-content-sm-between d-lg-block">
					<img
						src="/static/images/footer-logo.svg"
						alt="Cointec Logo"
						className="footer-logo"
					/>
					<div className="col-6 col-lg-12 mt-0 mt-lg-3 pr-0 d-flex flex-row justify-content-start justify-content-sm-end justify-content-lg-start pl-0">
						{/* <Link href="https://twitter.com/cointec">
							<a>
								<i className="fab fa-twitter mr-4" />
							</a>
						</Link>
						<Link href="https://www.instagram.com/cointec">
							<a>
								<i className="fab fa-instagram mr-4" />
							</a>
						</Link>
						<Link href="https://medium.com/@Cointec">
							<a>
								<i className="fab fa-medium mr-4" />
							</a>
						</Link> */}
					</div>
				</div>

				<div className="col-12 col-lg-9 links-wrapper">
					<div className="row mt-0 mt-lg-2">
						<div className="col-6 col-sm-3">
							<h5 className="menu-heading">Social</h5>
							<Link href="https://twitter.com/cointec">
								<a>
									<i className="fab fa-twitter mr-3" />
									Twitter
								</a>
							</Link>
							<Link href="https://www.instagram.com/cointec">
								<a>
									<i className="fab fa-medium mr-3" />
									Medium
								</a>
							</Link>
							<Link href="https://medium.com/@Cointec">
								<a className="text-nowrap">
									<i className="fab fa-instagram mr-3" />
									Instagram
								</a>
							</Link>
						</div>
						{/* <div className="col-12 col-sm-3">
							<h5 className="menu-heading">Information</h5>
							<Link href="/">
								<a>Home</a>
							</Link>
							<Link href="/learn">
								<a>Learn</a>
							</Link>
						</div> */}

						<div className="col-6 col-sm-3">
							<h5 className="menu-heading">Information</h5>
							{/* <Link href="/blog">
								<a>Blog</a>
							</Link> */}
							<Link href="/learn">
								<a>Learn</a>
							</Link>
							<Link href="/wallet-selector">
								<a>Wallets</a>
							</Link>
						</div>

						<div className="col-6 col-sm-3">
							<h5 className="menu-heading">Legal</h5>
							<Link href="/privacy-policy">
								<a>Privacy Policy</a>
							</Link>
							<Link href="/terms">
								<a>Terms of use</a>
							</Link>
							<Link href="/aml-kyc-policy">
								<a>AML/KYC</a>
							</Link>
						</div>

						<div className="col-6 col-sm-3">
							<h5 className="menu-heading">Support</h5>
							{/* <h5 className="menu-heading">Help</h5> */}
							<Link href="https://intercom.help/cointec-test">
								<a>Helpdesk</a>
							</Link>
							<Link href="#livechat">
								<a>Live chat</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
		<hr className="d-block d-sm-none d-lg-block" />
		<div className="container footer-bottom">
			<div className="row">
				<div className="col-12 col-lg-4">
					<p className="copyright">&copy; Cointec ltd 2018</p>
				</div>
				<div className="col-12 col-lg-8">
					<p className="reg-info">
						<span className="text-nowrap">
							Cointec Ltd is a company registered in England
						</span>{' '}
						<span className="text-nowrap d-block d-sm-inline">
							and Wales (No. <a className="d-inline-block">11104052</a>)
						</span>
					</p>
				</div>
			</div>
		</div>
	</footer>
)

Footer.propTypes = {
	backgroundColor: PropTypes.string
}

Footer.defaultProps = {
	backgroundColor: '#F7F9FA'
}

export default Footer
