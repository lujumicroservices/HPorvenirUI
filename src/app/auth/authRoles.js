/**
 * Authorization Roles
 */
const authRoles = {
	superadmin: ['superadmin'],
	admin: ['admin', 'superadmin'],
	user: ['superadmin', 'admin', 'user'],
	onlyGuest: []
};

export default authRoles;
