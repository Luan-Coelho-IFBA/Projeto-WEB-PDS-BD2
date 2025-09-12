export const PageRoutesName = {
	// Rotas principais
	landing: "/",
	home: "/home",

	// Rotas de autenticação (com prefixo /auth)
	login: "/auth/login",
	register: "/auth/register",
	forgotPassword: "/auth/forgot-password",
	configUser: "/auth/config",
} as const;
