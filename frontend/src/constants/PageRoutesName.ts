export const PageRoutesName = {
    // Rotas principais
    landing: "/",
    home: "/home",

    // Rotas de autenticação (com prefixo /auth)
    auth: {
        login: "",
    },

    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    configUser: "/auth/config",

    seeArticle: "/articles",
    articlesByCategory: "/articles/category",
} as const;
