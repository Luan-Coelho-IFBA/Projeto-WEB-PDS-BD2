import type { AxiosError } from "axios";
import type { ApiErrorResponse } from "../../server/types";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
import { removeUserDataLocalStorage } from "../../utils/removeUserData";

export async function deleteUser() {
    try {
        const response = await api.delete(apiRoutes.auth.getMe, {
            headers: {
                Authorization: getLocalStorageToken(),
            },
        });
        if (response.status === 200) {
            removeUserDataLocalStorage();
        }
        return response;
    } catch (error) {
        throw error as AxiosError<ApiErrorResponse>;
    }
}
