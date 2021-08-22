import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Search from './search';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';


i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const SearchConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
    auth: authRoles.user,
	routes: [
		{
			path: '/search',
			component: Search
		}
	]
};

export default SearchConfig;
