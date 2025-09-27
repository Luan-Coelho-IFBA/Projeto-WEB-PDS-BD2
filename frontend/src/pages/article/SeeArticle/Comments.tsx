import { HeartIcon, TrashIcon } from "lucide-react";
import { createComment } from "../../../services/comments/createComment";
import { deleteComment } from "../../../services/comments/deleteComment";
import { likeComment } from "../../../services/likes/likeComment";
import { removeLike } from "../../../services/likes/removeLike";
import { useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByArticleId } from "../../../services/comments/getComments";

import styles from "./styles.module.css";
import { Loader } from "../../../components/Loader";
import { getLocalStorageToken } from "../../../utils/getLocalStorageToken";

export function CommentsSection() {
    const { id } = useParams();
    const [message, setMessage] = useState("");

    const {
        data: commentsData,
        isLoading: commentsIsLoading,
        refetch,
    } = useQuery({
        queryKey: ["getCommentsById"],
        queryFn: () => getCommentsByArticleId(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    const onCreateMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createComment(Number(id), message);
            refetch();
        } catch (error) {}
    };

    const onDeleteMessage = async (id: number) => {
        try {
            await deleteComment(id);
            refetch();
        } catch (error) {}
    };

    const onLikeClick = async (id: number, liked: boolean) => {
        if (!liked) {
            await likeComment(id);
        } else {
            await removeLike(id);
        }
        refetch();
    };

    return (
        <>
            {getLocalStorageToken() ? (
                <>
                    {commentsIsLoading && (
                        <Loader direction="column">
                            <Loader.TextMessage
                                color=""
                                feedbackMessage="Carregando comentario"
                            />
                            <Loader.Icon />
                        </Loader>
                    )}
                    <div className={styles.commentsSection}>
                        <form onSubmit={onCreateMessage}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <input type="submit" value="Enviar" />
                        </form>
                        {!commentsIsLoading && commentsData && (
                            <div>
                                {commentsData.comments.map((c) => (
                                    <div key={c.id}>
                                        {c.user.name}
                                        {c.text}
                                        {c.likesCount ?? 0}
                                        <HeartIcon
                                            color={
                                                c.liked ? "#FF0000" : "#000000"
                                            }
                                            fill={
                                                c.liked ? "#FF0000" : "#FFFFFF"
                                            }
                                            onClick={() =>
                                                onLikeClick(c.id, c.liked)
                                            }
                                        />
                                        {c.self && (
                                            <TrashIcon
                                                onClick={() =>
                                                    onDeleteMessage(c.id)
                                                }
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div>Logue para acessar os comenarios</div>
            )}
        </>
    );
}
