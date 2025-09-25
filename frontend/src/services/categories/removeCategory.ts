import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export async function removeCategory(categoryId: number) {
    try {
        const response = await api.delete(
            `${apiRoutes.category.id}/${categoryId}`,
            {
                headers: { Authorization: getLocalStorageToken() },
            }
        );
        return response.data;
    } catch (error) {
        throw error as AxiosError<ApiErrorResponse>;
    }
}
