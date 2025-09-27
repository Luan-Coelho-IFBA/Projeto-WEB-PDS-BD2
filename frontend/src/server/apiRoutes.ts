export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resendEmail: "/auth/resendEmail",
        getMe: "/auth",
        changeUser: "/auth",
    },
    article: {
        mostViewed: "/article/most-viewed",
        getAll: "/article",
        getById: "/article",
        getAllByLatest: "/article/latest",
        getAllByCategory: "/article/categories",
        getMyArticles: "/article/mine",
        search: "/article/search",
    },
    category: {
        getAll: "/category",
        id: "/category",
    },
    comment: {
        create: "/comments",
        getByArticleId: "/comments",
        delete: "/comments",
    },
} as const;
