export const PageRoutesName = {
    home: "/",

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
        mostViewed: "/articles/most-viewed",
        latest: "/articles/latest",
        articlesByCategory: "/articles/category",
    },

    admin: {
        categories: "/admin/categories",
        writers: "/admin/writers",
    },
} as const;
