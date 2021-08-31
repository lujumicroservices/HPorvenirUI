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
				auth: authRoles.user,
				url: '/navigation'
			},
			{
				id: 'search-component',
				title: 'Search',
				translate: 'SEARCH',
				type: 'item',
				icon: 'search',
				auth: authRoles.user,
				url: '/search'
			},
			{
				id: 'help-component',
				title: 'Help',
				translate: 'HELP',
				type: 'item',
				icon: 'help',
				auth: authRoles.user,
				url: '/help'
			},
			{
				id: 'contact-component',
				title: 'Contact',
				translate: 'Contact',
				type: 'item',
				icon: 'alternate_email',
				auth: authRoles.user,
				url: '/contact'
			},
			{
				id: 'contact-admin',
				title: 'Admin',
				translate: 'Admin',
				type: 'item',
				icon: 'groups',
				auth: authRoles.user,
				url: '/contacts/all'
			},
			{
				id: 'hemeroteca-logout',
				title: 'LogOut',
				translate: 'LogOut',
				type: 'item',
				icon: 'exit_to_app',
				auth: authRoles.user,
				url: '/logout'
			}
		]
	}
];

export default navigationConfig;
