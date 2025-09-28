import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { Article } from "../../types/Article";

type SingleArticleResponse = {
    article: Article & {
        users: {
            email: string;
            id: number;
            isVerified: boolean;
            name: string;
            roleId: number;
        };
    };
};

export async function getArticle(id: number) {
    try {
        const response = await api.get(`${apiRoutes.article.getById}/${id}`);
        return response.data as SingleArticleResponse;
    } catch (error) {
        const AxiosError = error as AxiosError;
        throw AxiosError.response?.data;
    }
}
