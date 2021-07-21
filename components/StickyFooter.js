import React from 'react'
import Link from 'next/link'
import cn from 'classnames'

const StickyFooter = props => (
	<div
		className={cn('bottom-bar', props.className)}
		style={{ position: props.fixed ? 'fixed' : '' }}>
		<div className="container">
			<div className="row">
				<div className="col-6 copyright">@ Cointec LTD 2018</div>
				<div className="col-6 text-nowrap">
					<ul>
						<li>
							<Link href="/privacy-policy">
								<a>Privacy policy</a>
							</Link>
						</li>
						<li>
							<Link href="/terms">
								<a>Terms of use</a>
							</Link>
						</li>
						<li className="d-none d-lg-block">
							<Link href="https://intercom.help/cointec-test">
								<a className="btn-link" target="_blank">
									Support
								</a>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
)

export default StickyFooter
