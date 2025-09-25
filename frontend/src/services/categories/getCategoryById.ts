import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { Category } from "../../types/Category";

export async function getCategoryById(categoryId: number) {
    try {
        const response = await api.get(
            `${apiRoutes.category.id}/${categoryId}`
        );
        return response.data as Category;
    } catch (error) {
        throw error as AxiosError<ApiErrorResponse>;
    }
}
