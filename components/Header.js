import React from 'react'
import cn from 'classnames'

const Header = ({ background, children, deco = true, style }) => (
	<header
		className={cn(
			background === 'gradient'
				? 'bg-gradient bg-primary-gradient'
				: 'bg-solid',
			!deco ? 'no-deco' : ''
		)}
		style={style}>
		{children}
	</header>
)

export default Header
