import queryString from 'query-string';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import jwtService from 'app/services/jwtService';
import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { hideMessage, showMessage } from 'app/store/fuse/messageSlice';
import { withRouter } from 'react-router-dom';

import { setUserDataFirebase, setUserDataAuth0, setUserData, logoutUser } from './store/userSlice';

class Auth extends Component {
	state = {
		waitAuthCheck: true
	};

	componentDidMount() {
		const { location } = this.props;
		return Promise.all([
			// Comment the lines which you do not use
			// this.firebaseCheck(),
			// this.auth0Check(),
			this.jwtCheck()
		]).then(() => {
			this.setState({ waitAuthCheck: false });
		});
	}

	jwtCheck = () =>
		new Promise(resolve => {
			jwtService.on('onAutoLogin', () => {
				this.props.showMessage({ message: 'Logging in with JWT' });
				/**
				 * Sign in and retrieve user data from Api
				 */

				jwtService
					.signInWithToken()
					.then(user => {
						this.props.setUserData(user);
						resolve();
						this.props.showMessage({ message: `Bienvenido ${user.userName}` });
					})
					.catch(error => {
						this.props.showMessage({ message: error.message });

						resolve();
					});
			});

			jwtService.on('onAutoLogout', message => {
				if (message) {
					this.props.showMessage({ message });
				}

				this.props.logout();

				resolve();
			});

			jwtService.on('onNoAccessToken', () => {
				resolve();
			});

			const urlp = queryString.parse(this.props.location.search);
			jwtService.init(urlp);

			return Promise.resolve();
		});

	render() {
		return this.state.waitAuthCheck ? <FuseSplashScreen /> : <>{this.props.children}</>;
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			logout: logoutUser,
			setUserData,
			setUserDataAuth0,
			setUserDataFirebase,
			showMessage,
			hideMessage
		},
		dispatch
	);
}

export default withRouter(connect(null, mapDispatchToProps)(Auth));
