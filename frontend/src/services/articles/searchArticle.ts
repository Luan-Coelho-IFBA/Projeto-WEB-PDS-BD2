import { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { ArticleApiResponse } from "../../types/Article";

export async function searchArticle(search: string) {
    try {
        const response = await api.get(`${apiRoutes.article.search}`, {
            params: {
                search: search,
            },
        });
        return response.data as ArticleApiResponse;
    } catch (error) {
        const AxiosError = error as AxiosError;
        throw AxiosError.response?.data;
    }
}
