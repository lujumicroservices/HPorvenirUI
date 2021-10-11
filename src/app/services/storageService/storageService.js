import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';

class StorageService extends FuseUtils.EventEmitter {
	getItem = name => {
		const storageItem = localStorage.getItem('navigationExclusionv2');
		if (storageItem === null) return null;
		if (storageItem.expity > new Date().getTime()) {
			return storageItem.item;
		}
		return null;
	};

	setItem = (name, item) => {
		const storageItem = {
			item,
			expiry: new Date().getTime() + 3600000
		};
		localStorage.setItem('navigationExclusionv2', JSON.stringify(storageItem));
	};
}

const storageInstance = new StorageService();

export default storageInstance;
