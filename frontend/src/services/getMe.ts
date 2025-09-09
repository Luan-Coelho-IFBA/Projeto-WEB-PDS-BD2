import { getParsedType } from "zod/v3";
import api from "../server/api";
import { apiRoutes } from "../server/apiRoutes";
import type { AxiosError } from "axios";
import { getLocalStorageToken } from "../utils/getLocalStorageToken";

export async function getMe() {
	const tokenData = getLocalStorageToken();

	if (getParsedType(tokenData) === "null") {
		return;
	} else {
		try {
			const response = await api.get(apiRoutes.auth.getMe, {
				headers: { Authorization: tokenData },
			});
			return response;
		} catch (error) {
			return error as AxiosError;
		}
	}
}
