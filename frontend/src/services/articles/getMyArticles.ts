import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { ArticleApiResponse } from "../../types/Article";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export async function getMyArticles() {
    try {
        const response = await api.get(apiRoutes.article.getMyArticles, {
            headers: { Authorization: getLocalStorageToken() },
        });
        return response.data as ArticleApiResponse;
    } catch (error) {
        throw error as AxiosError;
    }
}
