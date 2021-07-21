import App, { Container } from 'next/app'
import React from 'react'
import withReduxStore from '../libs/with-redux-store'
import loadIntercom from '../libs/load-intercom'
import { Provider } from 'react-redux'
import '../styles/app.scss'

class MyApp extends App {
	componentDidMount() {
		loadIntercom()

		// remove persisted data if exist
		const user = localStorage.getItem('user')
		if (user) {
			localStorage.removeItem('user')
		}
	}

	render() {
		const { Component, pageProps, reduxStore } = this.props
		return (
			<Container>
				<Provider store={reduxStore}>
					<Component {...pageProps} />
				</Provider>
			</Container>
		)
	}
}

export default withReduxStore(MyApp)
