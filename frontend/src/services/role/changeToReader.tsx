import { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
import { ApiErrorResponse } from "../../server/types";

export async function changeToReader(writerId: number) {
    try {
        const response = await api.patch(
            `${apiRoutes.role.changeWriterToReader}/${writerId}`,
            {},
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        return response.data;
    } catch (err) {
        throw err as AxiosError<ApiErrorResponse>;
    }
}
