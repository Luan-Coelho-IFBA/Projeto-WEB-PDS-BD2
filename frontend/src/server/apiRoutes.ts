export const apiRoutes = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		resendEmail: "/auth/resendEmail",
		getMe: "/auth",
		changeUser: "/auth",
	},
	article: {},
} as const;
