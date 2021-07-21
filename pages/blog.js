import React, { Component } from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { fetchVerificationStatus, fetchPosts } from '../store/actions'

import Header from '../components/Header'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

class Blogs extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		this.props.fetchPosts()
	}

	render() {
		return (
			<div className="blog-page">
				<Head>
					<title>Cointec Blog</title>
				</Head>

				<Header background="gradient">
					<Nav />
					<hr className="hr-header" />
					<div className="container">
						<div className="hero-wrapper hero-wrapper-inner">
							<div className="row">
								<div className="col-md-12">
									<h1 className="page-heading d-md-block	d-none">
										Welcome to the Cointec Blog
									</h1>
									<h1 className="page-heading d-block	d-md-none">
										Cointec Blog
									</h1>
									<h6 className="page-sub-heading d-none d-sm-block">
										Add some text here to fill up the space.
									</h6>
								</div>
							</div>
						</div>
					</div>
				</Header>

				<section className="page-content dc-glossary container">
					<div className="row">
						<div className="col">
							<div className="content-wrapper blog-list p-0 h-auto position-relative">
								<div className="row">
									{this.props.blogs.posts &&
										this.props.blogs.posts.map((post, index) => (
											<div key={index} className="col-lg-4 col-md-6">
												<BlogItem
													image={post.image}
													title={post.title}
													link={post.link}
													snippet={post.snippet}
													user={post.user}
													publishedAt={post.publishedAt}
												/>
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<Footer backgroundColor="#fff" />

				<style jsx global>{`
					html {
						background: #f7f9fa;
					}
					html body {
						background: none;
						box-shadow: none;
					}
				`}</style>
			</div>
		)
	}

	componentWillReceiveProps(props) {}
}

const BlogItem = ({ image, title, link, snippet, user, publishedAt }) => (
	<div className="blog-item">
		<div className="header" style={{ backgroundImage: `url(${image})` }} />
		<div className="blog-item-body">
			<h4 className="blog-title">
				<a href={link} target="_blank">
					{title}
				</a>
			</h4>
			<p className="blog-description">{snippet}</p>
		</div>
		<div className="footer d-flex">
			<img src={user.image} alt={user.name} />
			<div>
				<div>
					<a href={user.link} target="_blank">
						{user.name}
					</a>
				</div>
				<div>
					<Moment format="MMM DD, YYYY">{publishedAt}</Moment>
				</div>
			</div>
		</div>
	</div>
)

export default connect(
	({ auth, verification, accounts, globals, blogs }) => ({
		auth,
		verification,
		accounts,
		globals,
		blogs
	}),
	{
		fetchVerificationStatus,
		fetchPosts
	}
)(withRouter(Blogs))
