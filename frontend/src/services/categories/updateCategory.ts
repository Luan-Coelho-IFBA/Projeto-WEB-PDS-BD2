import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

type updateCategoryProps = {
    categoryId: number;
    newName: string;
    newDescription: string;
};

export async function updateCategory({
    categoryId,
    newDescription,
    newName,
}: updateCategoryProps) {
    try {
        const response = await api.patch(
            `${apiRoutes.category.id}/${categoryId}`,
            {
                name: newName,
                description: newDescription,
            },
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error as AxiosError<ApiErrorResponse>;
    }
}
