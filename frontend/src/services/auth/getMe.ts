import { getParsedType } from "zod/v3";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { AxiosError } from "axios";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
import type { ApiErrorResponse } from "../../server/types";
import type { User } from "../../types/User";
import { NavigateFunction } from "react-router";
import { notify } from "../../adapters/toastHotAdapter";
import { setLocalStorageToken } from "../../utils/setLocalStorageToken";

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
            setLocalStorageToken(response.data.token);
            return response.data as User;
        } catch (error: any) {
            if (error.status == 401) {
                navigation?.("/auth/login");
                notify.error(
                    "Seu token JWT venceu, logue novamente a sua conta"
                );
            }
            throw error as AxiosError<ApiErrorResponse>;
        }
    }
}
