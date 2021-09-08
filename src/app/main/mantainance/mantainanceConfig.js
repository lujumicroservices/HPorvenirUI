import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Mantainance from './mantainance';

const MantainanceConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/mantainance',
			component: Mantainance
		}
	]
};

export default MantainanceConfig;
