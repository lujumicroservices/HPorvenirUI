import i18next from 'i18next';
import { authRoles } from 'app/auth';
import User from './user';

const UserConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/user',
			component: User
		}
	]
};

export default UserConfig;
