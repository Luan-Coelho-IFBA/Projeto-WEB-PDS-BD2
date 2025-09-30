import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export type ApiResponseUser = {
    id: number;
    name: string;
    email: string;
    role: {
        id: number;
        name: string;
        createdAt: string;
        updatedAt: string;
    };
};

export async function getWriters() {
    try {
        const response = await api.get(apiRoutes.auth.getWriters, {
            headers: {
                Authorization: getLocalStorageToken(),
            },
        });
        return response.data.users as ApiResponseUser[];
    } catch (error) {
        const axiosError = error as AxiosError;
        throw axiosError;
    }
}
