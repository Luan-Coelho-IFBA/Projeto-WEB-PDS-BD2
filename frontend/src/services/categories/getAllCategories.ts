import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import type { CategoryResponseApi } from "../../types/Category";

export async function getAllCategories() {
	try {
		const response = (await api.get(
			apiRoutes.category.getAll
		)) as CategoryResponseApi;
		return response.data.categories;
	} catch (error) {
		const axiosError = error as AxiosError;
		throw axiosError;
	}
}
