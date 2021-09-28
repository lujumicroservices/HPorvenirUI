import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init(urlp) {
		this.setInterceptors();
		this.handleIpAuthentication(urlp);
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err?.response?.status === 401 && err?.config && !err?.config?.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleIpAuthentication = urlp => {
		const access_token = this.getAccessToken();
		if (!access_token) {
			if (urlp && urlp.iv && urlp.secret) {
				this.trylogRemote(urlp).then(result => {
					console.log(result);
				});
			} else {
				this.tryGetIp().then(result => {
					this.trylogByIp(result).then(result2 => {
						console.log(result2);
					});
				});
			}

			// this.emit('onNoAccessToken');
			// return;
		} else {
			this.handleAuthentication();
		}
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}Authentication/login`, {
					user: email,
					password
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						reject(response.data.error);
					}
				});
		});
	};

	tryGetIp = () => {
		return new Promise((resolve, reject) => {
			axios
				.get(`https://json.geoiplookup.io/`)
				.then(response => {
					if (response.data.ip) {
						resolve(response.data.ip);
					} else {
						reject(new Error('missing ip.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed authenticate.'));
				});
		});
	};

	trylogByIp = ip => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_WEBAPI}Authentication/iplogin/${ip}`)
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						this.handleAuthentication();
						// resolve(response.data.user);
					} else {
						reject(new Error('missing'));
					}
				})
				.catch(error => {
					this.handleAuthentication();
				});
		});
	};

	trylogRemote = urlp => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_WEBAPI}Authentication/remotelogin/${urlp.secret}/${urlp.iv}`)
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						this.handleAuthentication();
						// resolve(response.data.user);
					} else {
						reject(new Error('missing'));
					}
				})
				.catch(error => {
					this.handleAuthentication();
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.get(`${process.env.REACT_APP_WEBAPI}Authentication/accesstoken`, {
					data: {
						access_token: this.getAccessToken()
					}
				})
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
