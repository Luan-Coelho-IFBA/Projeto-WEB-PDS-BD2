import { getParsedType } from "zod/v3";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { AxiosError } from "axios";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
import type { ApiErrorResponse } from "../../server/types";
import type { User } from "../../types/User";

export async function getMe() {
    const tokenData = getLocalStorageToken();

    if (getParsedType(tokenData) === "null") {
        return null;
    } else {
        try {
            const response = await api.get(apiRoutes.auth.getMe, {
                headers: { Authorization: tokenData },
            });
            return response.data as User;
        } catch (error) {
            throw error as AxiosError<ApiErrorResponse>;
        }
    }
}
