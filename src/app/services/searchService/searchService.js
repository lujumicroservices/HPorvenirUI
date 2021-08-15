import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

class SearchService extends FuseUtils.EventEmitter {
	simpleSearch = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.WEBAPI}search/simple`, payload)
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};

	docDetailSearch = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.WEBAPI}search/file`, payload, {
					headers: {
						'Content-Type': 'application/json'
					},
					responseType: 'arraybuffer'
				})
				.then(response => {
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	};
}

const searchInstance = new SearchService();

export default searchInstance;
