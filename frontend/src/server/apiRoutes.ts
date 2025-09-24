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
    },
    category: {
        getAll: "category",
    },
} as const;
