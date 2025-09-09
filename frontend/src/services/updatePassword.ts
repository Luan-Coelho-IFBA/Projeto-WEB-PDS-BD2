import type { AxiosError } from "axios";
import api from "../server/api";
import { apiRoutes } from "../server/apiRoutes";
import { getLocalStorageToken } from "../utils/getLocalStorageToken";

export async function updatePassword(newPassword: string) {
	try {
		const response = await api.patch(
			apiRoutes.auth.changeUser,
			{
				password: newPassword,
			},
			{
				headers: {
					Authorization: getLocalStorageToken(),
				},
			}
		);
		return response;
	} catch (error) {
		throw error as AxiosError;
	}
}
