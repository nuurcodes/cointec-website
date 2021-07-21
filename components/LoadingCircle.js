import React from 'react'

const LoadingCircle = ({ infinite = true, progress = 0 }) => (
	<svg height="24" width="24">
		<circle
			stroke="#C0C7CC"
			strokeWidth="3"
			fill="transparent"
			r="10"
			cx="12"
			cy="12"
		/>
		<circle
			stroke="#0459C4"
			strokeDasharray="64"
			strokeWidth="3"
			fill="transparent"
			r="10"
			cx="12"
			cy="12"
			className="loading-indicator"
			style={{
				strokeDashoffset: infinite ? -40 : (64 * progress) / 100 - 64,
				transform: 'rotateY(180deg)',
				transition: !infinite ? 'stroke-dashoffset 1s' : '',
				animation: infinite ? 'loading-circle 1s linear infinite' : ''
			}}
		/>
	</svg>
)

export default LoadingCircle
