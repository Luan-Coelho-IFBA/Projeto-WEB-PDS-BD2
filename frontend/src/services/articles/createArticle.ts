import type { AxiosError, AxiosResponse } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
export interface ArticleTypePostData {
	title: string;
	subtitle: string;
	text: string;
	categoryId: number | number[];
	image: any;
}

export async function createArticles({
	categoryId,
	image,
	subtitle,
	text,
	title,
}: ArticleTypePostData) {
	try {
		const response = await api.post(
			apiRoutes.article.getAll,
			{
				title,
				subtitle,
				text,
				categoryId,
				image,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		return response.data as AxiosResponse;
	} catch (error) {
		throw error as AxiosError;
	}
}
