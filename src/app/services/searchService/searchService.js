import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

class SearchService extends FuseUtils.EventEmitter {
	simpleSearch = payload => {
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

	docDetailSearch = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}search/file`, payload, {
					// .post(`${process.env.REACT_APP_WEBAPI}search/file`, payload, {
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

	downloadDocDetailSearch = payload => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${process.env.REACT_APP_WEBAPI}search/file`, payload, {
					headers: {
						'Content-Type': 'application/json'
					},
					responseType: 'arraybuffer'
				})
				.then(({ data }) => {
					const downloadUrl = window.URL.createObjectURL(new Blob([data]));
					const link = document.createElement('a');
					link.href = downloadUrl;
					link.setAttribute('download', payload.fileName.replace('.xml', '.pdf')); // any other extension
					document.body.appendChild(link);
					link.click();
					link.remove();
				});
		});
	};
}

const searchInstance = new SearchService();

export default searchInstance;
