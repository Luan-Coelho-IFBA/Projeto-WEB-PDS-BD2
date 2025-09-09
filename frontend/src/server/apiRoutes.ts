export const apiRoutes = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		resendEmail: "/auth/resendEmail",
		getMe: "/auth",
	},
	article: {},
} as const;
