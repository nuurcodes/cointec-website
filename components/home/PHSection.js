import React from 'react'
import Link from 'next/link'

const PHSection = () => (
	<div className="get-started container">
		<div className="row">
			<div className="col-12 text-center">
				<h4 className="section-title" />
			</div>
		</div>
	</div>
)

const Card = ({ title, description, image, link: { href, text } }) => (
	<div className="get-started-card text-center">
		<img src={image} alt={title} />
		<h5>{title}</h5>
		<p>{description}</p>
		<Link href={href}>
			<a>{text}</a>
		</Link>
	</div>
)

export default PHSection
