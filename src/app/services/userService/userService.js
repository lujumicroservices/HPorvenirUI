import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

class UserService extends FuseUtils.EventEmitter {
	getUsers = payload => {
		return new Promise((resolve, reject) => {
			axios
            .get(`https://localhost:5001/user`)
				//.get(`${process.env.REACT_APP_WEBAPI}user`)
				.then(response => {
                    debugger;
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	updateUser = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}search/simple`, payload)
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	addUser = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}search/simple`, payload)
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	deleteUser = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}search/simple`, payload)
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};
}

const userInstance = new UserService();

export default userInstance;
