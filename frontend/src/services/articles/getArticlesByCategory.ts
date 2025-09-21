import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { ArticleApiResponse } from "../../types/Article";

export async function getArticlesByCategory(categoryId: number) {
    try {
        const response = await api.get(apiRoutes.article.getAllByCategory, {
            data: {
                categoriesId: [categoryId],
            },
        });
        return response.data as ArticleApiResponse;
    } catch (error) {
        throw error as AxiosError;
    }
}
