import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

export async function updateUsername(newName: string) {
    try {
        const response = await api.patch(
            apiRoutes.auth.changeUser,
            {
                name: newName,
            },
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error as AxiosError;
    }
}
