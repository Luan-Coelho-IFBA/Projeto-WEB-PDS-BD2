/*

###

GET http://localhost:3000/article/most-viewed?size=3&page=0 HTTP/1.1

###

GET http://localhost:3000/article/mine HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzU4NzUyNDkyLCJleHAiOjE3NTg5MjUyOTJ9.w8LJ9zLHO8II7Pd98XivUkzhNz9L0LIKBy1f94EJ2sg


*/

import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { ArticleApiResponse } from "../../types/Article";

export async function getMostViewed(size?: number, page: number = 0) {
    try {
        const response = await api.get(apiRoutes.article.mostViewed, {
            params: {
                size,
                page,
            },
        });
        return response.data as ArticleApiResponse;
    } catch (error) {
        throw error as AxiosError<ApiErrorResponse>;
    }
}
