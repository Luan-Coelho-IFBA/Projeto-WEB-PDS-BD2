import type { AxiosError, AxiosResponse } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";
export interface ArticleTypePostData {
    id: number;
    title: string;
    subtitle: string;
    text: string;
    categoryId: number[];
    image: FileList;
}

export async function updateArticle({
    id,
    categoryId,
    image,
    subtitle,
    text,
    title,
}: ArticleTypePostData) {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("subtitle", subtitle);
    fd.append("text", text);
    fd.append("image", image[0]);
    categoryId.forEach((v) => {
        fd.append("categoryId", v.toString());
    });

    try {
        const response = await api.patch(
            `${apiRoutes.article.updateArticle}/${id}`,
            fd,
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(response.data);
        return response.data as AxiosResponse;
    } catch (error) {
        throw error as AxiosError;
    }
}
