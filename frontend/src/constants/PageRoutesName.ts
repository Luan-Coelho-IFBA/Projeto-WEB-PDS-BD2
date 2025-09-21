export const PageRoutesName = {
    // Rotas principais
    landing: "/",
    home: "/home",

    // Rotas de autenticação (com prefixo /auth)
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        forgotPassword: "/auth/forgot-password",
        configUser: "/auth/config",
    },

    articles: {
        createArticle: "/create-article",
        seeArticle: "/articles",
        articlesByCategory: "/articles/category",
    },

    admin: {
        categories: "/admin/categories",
        writers: "/admin/writers",
    },
} as const;
