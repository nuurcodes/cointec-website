import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import Router from 'next/router'
import {
	getRehiveId,
	getRehiveToken,
	deleteRehiveToken,
	uploadDocument
} from '../../store/actions'
import cn from 'classnames'
import _ from 'lodash'

import FileInput from '../FileInput'

class ProofOfID extends Component {
	constructor(props) {
		super(props)
		this.state = {
			uploading: false,
			file: null,
			progress: 0,
			error: false,
			timeout: null,
			uploaded: false,
			triesLeft: 3
		}

		this.handleChange = this.handleChange.bind(this)
	}

	componentWillMount() {
		this.props.getRehiveId({ ctUser: this.props.ctUser }).then(() => {
			this.props.getRehiveToken({ ctUser: this.props.ctUser })
		})
	}

	handleChange(event) {
		const [file] = event.target.files
		if (file) {
			if (file.size > 5242880) {
				if (this.state.timeout) clearTimeout(this.state.timeout)
				const timeout = setTimeout(() => {
					this.setState({
						error: false,
						uploaded: true
					})
				}, 3000)
				this.setState({
					error: true,
					uploading: false,
					uploaded: false,
					file,
					timeout
				})
			} else {
				if (this.state.timeout) clearTimeout(this.state.timeout)
				this.setState({
					error: false,
					uploading: true,
					uploaded: false,
					file,
					progress: 0
				})
				this.props
					.uploadDocument({
						AccountId: this.props.verification.AccountId,
						RehiveId: this.props.verification.RehiveId,
						Token: this.props.verification.Token,
						file,
						category: 'Proof Of Identity',
						onUploadProgress: event => {
							this.setState({
								progress: (event.loaded * 100) / file.size
							})
						}
					})
					.then(res => {
						this.props.deleteRehiveToken({ ctUser: this.props.ctUser })
						this.setState({ progress: 100 })
						setTimeout(() => {
							this.props.onConfirm()
						}, 350)
					})
					.catch(error => {
						console.log(error.response)
						if (error.response && error.response.status === 403) {
							if (this.state.triesLeft > 0) {
								this.props.getRehiveToken({ ctUser: this.props.ctUser })
								this.setState({ triesLeft: this.state.triesLeft - 1 })
							} else {
								Router.push('/account-settings')
							}
						}
					})
			}
		}
	}

	render() {
		return (
			<div className="card-wrapper text-left">
				<div className="row">
					<div className="col-12">
						<h6 className="heading">Valid documents</h6>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<ul className="document-list">
							<li>
								<i className="fas fa-check-circle fa-xs" />
								Passport
							</li>
							<li>
								<i className="fas fa-check-circle fa-xs" />
								Full driving licence (photocard)
							</li>
							<li>
								<i className="fas fa-check-circle fa-xs" />
								Provisional driving license (photocard)
							</li>
						</ul>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<p className="upload-info">
							IDs must be in date at the time of upload and the name must match
							the details on your account. For passports, the entire photo page
							should be uploaded.
						</p>
					</div>
				</div>
				{this.state.error && (
					<div className="row">
						<div className="col-12">
							<p className="error-message">Max file size is 25mb</p>
						</div>
					</div>
				)}
				{this.props.verification.overview &&
					this.props.verification.overview.IdItems[2].Status === 'Declined' && (
						<div className="row">
							<div className="col-12">
								<p className="error-message">
									{this.props.verification.overview.IdItems[2].Message}
								</p>
							</div>
						</div>
					)}
				{this.state.uploaded && (
					<div className="row">
						<div className="col-12">
							<p className="uploaded-message">
								Uploaded{' '}
								<span className="filename">{this.state.file.name}</span>
							</p>
						</div>
					</div>
				)}
				{this.state.uploading && (
					<div className="row">
						<div className="col-12">
							<p className="uploading-message">
								Uploading{' '}
								<span className="filename">{this.state.file.name}</span>
							</p>
							<div className="uploading-progress">
								<div
									className="progress"
									style={{ width: `${this.state.progress}%` }}
								/>
							</div>
						</div>
					</div>
				)}
				<div className="row">
					<div className="col-md-12">
						<FileInput
							type="submit"
							className={cn('btn btn-block btn-lg', 'btn-primary')}
							onChange={this.handleChange}
							disabled={
								this.state.uploading ||
								!this.props.verification.RehiveId ||
								!this.props.verification.Token
							}>
							Upload proof of ID
						</FileInput>
					</div>
				</div>
			</div>
		)
	}
}

export default connect(
	({ verification }) => ({ verification }),
	{ getRehiveId, getRehiveToken, deleteRehiveToken, uploadDocument }
)(
	reduxForm({
		form: 'VerificationForm'
	})(ProofOfID)
)
