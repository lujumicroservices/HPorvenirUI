import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import SearchConfig from 'app/main/search/searchConfig';
import HelpConfig from 'app/main/help/helpConfig';
import ContactConfig from 'app/main/contact/contactConfig';
import NavigationConfig from 'app/main/navigation/navigationConfig';
import ContactsAppConfig from 'app/main/contacts/ContactsAppConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';

const routeConfigs = [
	LogoutConfig,
	LoginConfig,
	SearchConfig,
	NavigationConfig,
	ContactConfig,
	HelpConfig,
	ContactsAppConfig
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['superadmin', 'admin', 'user']),
	{
		path: '/',
		component: () => <Redirect to="/navigation" />
	},
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];

export default routes;
