import type { AxiosError, AxiosResponse } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export async function likeComment(id: number) {
    try {
        const response = await api.post(
            apiRoutes.like.create,
            {
                id: id,
            },
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        return response as AxiosResponse;
    } catch (error) {
        const AxiosError = error as AxiosError;
        throw AxiosError.response?.data;
    }
}
