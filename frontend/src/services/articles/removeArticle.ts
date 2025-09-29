import { AxiosError } from "axios";
import { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { Article } from "../../types/Article";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export async function removeArticle(articleId: Article["id"]) {
    try {
        const response = await api.delete(
            `${apiRoutes.article.delete}/${articleId}`,
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err as AxiosError<ApiErrorResponse>;
    }
}
