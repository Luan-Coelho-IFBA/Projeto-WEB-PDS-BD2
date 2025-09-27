import type { AxiosError } from "axios";
import api from "../../server/api";
import { apiRoutes } from "../../server/apiRoutes";
import { Comment } from "../../types/Comment";
import { getLocalStorageToken } from "../../utils/getLocalStorageToken";

type CommentsResponse = {
    comments: Comment[];
};

export async function getCommentsByArticleId(id: number) {
    try {
        const response = await api.get(
            `${apiRoutes.comment.getByArticleId}/${id}`,
            {
                headers: {
                    Authorization: getLocalStorageToken(),
                },
            }
        );
        console.log(response.data);
        return response.data as CommentsResponse;
    } catch (error) {
        const AxiosError = error as AxiosError;
        throw AxiosError.response?.data;
    }
}
