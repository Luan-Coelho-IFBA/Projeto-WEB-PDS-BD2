export const RoutesName = {
	// Rotas principais
	landing: "/",
	home: "/home",

	// Rotas de autenticação (com prefixo /auth)
	login: "/auth/login",
	register: "/auth/register",
	forgotPassword: "/auth/forgot-password",
} as const;
