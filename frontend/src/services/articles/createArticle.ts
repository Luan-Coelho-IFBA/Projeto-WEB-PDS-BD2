import type { AxiosError, AxiosResponse } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
export interface ArticleTypePostData {
    title: string;
    subtitle: string;
    text: string;
    categoryId: number[];
    image: File;
}

export async function createArticles({
    categoryId,
    image,
    subtitle,
    text,
    title,
}: ArticleTypePostData) {
    let fd = new FormData();
    fd.append("title", title);
    fd.append("subtitle", subtitle);
    fd.append("image", image);
    categoryId.forEach((v) => {
        fd.append("categoryId", v.toString());
    });

    try {
        const response = await api.post(apiRoutes.article.getAll, fd, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as AxiosResponse;
    } catch (error) {
        throw error as AxiosError;
    }
}
