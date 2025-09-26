import { getParsedType } from "zod/v3";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { AxiosError } from "axios";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
import type { ApiErrorResponse } from "../../server/types";
import type { User } from "../../types/User";
import { NavigateFunction } from "react-router";

export async function getMe(navigation?: NavigateFunction) {
    const tokenData = getLocalStorageToken();

    if (getParsedType(tokenData) === "null") {
        navigation?.("/");
        return null;
    } else {
        try {
            const response = await api.get(apiRoutes.auth.getMe, {
                headers: { Authorization: tokenData },
            });
            return response.data as User;
        } catch (error: any) {
            if (error.status == 401) {
                navigation?.("/");
            }
            throw error as AxiosError<ApiErrorResponse>;
        }
    }
}
