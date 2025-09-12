import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";

export async function createCategory(nameOfCategory: string) {
	try {
		return await api.post(
			apiRoutes.category.getAll,
			{
				name: nameOfCategory,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		throw error as AxiosError;
	}
}
