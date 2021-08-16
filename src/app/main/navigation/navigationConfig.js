import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Navigation from './navigation';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';


i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const NavigationConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	auth: authRoles.admin,
	routes: [
		{
			path: '/navigation',
			component: Navigation
		}	
	]
};

export default NavigationConfig;
