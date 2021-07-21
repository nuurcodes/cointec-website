import React, { Component } from 'react'

class FileInput extends Component {
	constructor(props) {
		super(props)
		this.input = React.createRef()
	}

	render() {
		return (
			<div>
				<input
					type="file"
					accept="image/jpeg, image/jpg, image/png, application/pdf"
					style={{ display: 'none' }}
					ref={this.input}
					onChange={this.props.onChange}
				/>
				<button
					className={this.props.className}
					type={this.props.type}
					disabled={this.props.disabled}
					onClick={() => this.input.current.click()}>
					{this.props.children}
				</button>
			</div>
		)
	}
}

export default FileInput
