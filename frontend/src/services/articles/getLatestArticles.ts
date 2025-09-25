import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { ArticleApiResponse } from "../../types/Article";

export async function getLatestArticles(size?: number, page: number = 0) {
    try {
        const response = await api.get(apiRoutes.article.getAllByLatest, {
            params: {
                size,
                page,
            },
        });
        return response.data as ArticleApiResponse;
    } catch (error) {
        throw error as AxiosError;
    }
}
