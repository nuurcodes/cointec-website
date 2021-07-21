import React from 'react'
import Link from 'next/link'
import { withRouter } from 'next/router'
import cn from 'classnames'

const NavLink = withRouter(
	({ href, children, router, className, ...props }) => (
		<Link href={href} {...props} prefetch>
			<a className={cn(className, { active: router.pathname === href })}>
				{children}
			</a>
		</Link>
	)
)

export default NavLink
