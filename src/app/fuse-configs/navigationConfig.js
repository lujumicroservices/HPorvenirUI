import { authRoles } from 'app/auth';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';


i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'nav-component',
				title: 'Navigation',
				translate: 'NAVIGATION',
				type: 'item',
				icon: 'snippet_folder',
				auth: authRoles.admin,
				url: '/navigation'
			},
			{
				id: 'search-component',
				title: 'Search',
				translate: 'SEARCH',
				type: 'item',
				icon: 'search',
				auth: authRoles.admin,
				url: '/search'
			}
		]
	}
];

export default navigationConfig;
