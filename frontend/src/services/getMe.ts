import { getParsedType } from "zod/v3";
import { localStorageNameToken } from "../constants/localStorageNameToken";
import api from "../server/api";
import { apiRoutes } from "../server/apiRoutes";
import type { AxiosError } from "axios";

export async function getMe() {
	const tokenData = localStorage.getItem(localStorageNameToken);

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
