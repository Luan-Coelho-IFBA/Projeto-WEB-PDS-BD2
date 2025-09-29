export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resendEmail: "/auth/resendEmail",
        getMe: "/auth",
        changeUser: "/auth",
        getWriters: "/auth/writers",
        getReaders: "/auth/readers",
    },
    article: {
        delete: "/article",
        mostViewed: "/article/most-viewed",
        getAll: "/article",
        getById: "/article",
        getAllByLatest: "/article/latest",
        getAllByCategory: "/article/categories",
        getMyArticles: "/article/mine",
        search: "/article/search",
        updateArticle: "/article",
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
    like: {
        create: "/like",
        delete: "/like",
    },
} as const;
