import React, { Component } from 'react'
import cn from 'classnames'
import _ from 'lodash'

class Pagination extends Component {
	render() {
		const { totalPages, currentPage, onChange, className } = this.props
		const pages = totalPages > 1 ? _.range(2, totalPages) : []
		return (
			<div className={className}>
				{totalPages > 0 && (
					<ul className="pagination justify-content-center">
						<li className="page-item">
							<a
								className="page-link"
								onClick={() =>
									onChange(currentPage > 1 ? currentPage - 1 : currentPage)
								}>
								<i className="far fa-angle-left" />
							</a>
						</li>
						<li
							className={cn('page-item', currentPage === 1 ? 'active' : null)}>
							<a className="page-link" onClick={() => onChange(1)}>
								1
							</a>
						</li>
						{currentPage > 4 && (
							<li className="page-item">
								<a
									className="page-link"
									onClick={() => onChange(currentPage - 3)}>
									...
								</a>
							</li>
						)}
						{pages.map(
							page =>
								Math.abs(currentPage - page) < 3 && (
									<li
										className={cn(
											'page-item',
											currentPage === page ? 'active' : null
										)}
										key={page}>
										<a className="page-link" onClick={() => onChange(page)}>
											{page}
										</a>
									</li>
								)
						)}
						{currentPage < totalPages - 3 && (
							<li className="page-item">
								<a
									className="page-link"
									onClick={() => onChange(currentPage + 3)}>
									...
								</a>
							</li>
						)}
						{totalPages !== 1 && (
							<li
								className={cn(
									'page-item',
									currentPage === totalPages ? 'active' : null
								)}>
								<a className="page-link" onClick={() => onChange(totalPages)}>
									{totalPages}
								</a>
							</li>
						)}
						<li className="page-item">
							<a
								className="page-link"
								onClick={() =>
									onChange(
										currentPage < totalPages ? currentPage + 1 : currentPage
									)
								}>
								<i className="far fa-angle-right" />
							</a>
						</li>
					</ul>
				)}
			</div>
		)
	}
}

export default Pagination
