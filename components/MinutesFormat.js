import React from 'react'

export default ({ seconds }) => {
	const minutes = Number.parseInt(seconds / 60)
	const remaining = seconds % 60
	return (
		<span className="text-timer">
			{minutes ? `${minutes}min${minutes !== 1 ? 's' : ''}` : ''}{' '}
			{remaining ? `${remaining}s` : ''}
		</span>
	)
}
