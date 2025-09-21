export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resendEmail: "/auth/resendEmail",
        getMe: "/auth",
        changeUser: "/auth",
    },
    article: {
        getAll: "/article",
        getById: "/article",
        getAllByLatest: "/article/latest",
        getAllByCategory: "/article/categories",
    },
    category: {
        getAll: "category",
    },
} as const;
