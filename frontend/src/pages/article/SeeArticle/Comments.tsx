import { HeartIcon, TrashIcon, UserIcon } from "lucide-react";
import { createComment } from "../../../services/comments/createComment";
import { deleteComment } from "../../../services/comments/deleteComment";
import { likeComment } from "../../../services/likes/likeComment";
import { removeLike } from "../../../services/likes/removeLike";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByArticleId } from "../../../services/comments/getComments";

import styles from "./styles.module.css";
import { Loader } from "../../../components/Loader";
import { getLocalStorageToken } from "../../../utils/getLocalStorageToken";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";
import { notify } from "../../../adapters/toastHotAdapter";

const CreateCommentSchema = z.object({
    comment: z.string().min(2, "Seu comentario é curto demais!"),
});

type CreateCommentForm = z.infer<typeof CreateCommentSchema>;

export function CommentsSection() {
    const { id } = useParams();

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

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(CreateCommentSchema),
    });

    const OnCreateComment: SubmitHandler<CreateCommentForm> = async (
        data: CreateCommentForm
    ) => {
        try {
            await createComment(Number(id), data.comment);
            notify.sucess("Comentario criado!");
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
                    {!commentsIsLoading && (
                        <div className={styles.commentsSection}>
                            <form
                                className={styles.createComment}
                                onSubmit={handleSubmit(OnCreateComment)}
                            >
                                <input
                                    placeholder="Escreva o seu comentario"
                                    className={styles.inputComment}
                                    {...register("comment")}
                                    type="text"
                                />

                                <button
                                    className={styles.buttonCreateComment}
                                    type="submit"
                                >
                                    Enviar
                                </button>
                            </form>
                            {!commentsIsLoading && commentsData && (
                                <div>
                                    {commentsData.comments.map((c) => (
                                        <div
                                            key={c.id}
                                            className={styles.uniqueComment}
                                        >
                                            <UserIcon
                                                className={styles.iconUser}
                                            />
                                            <div className={styles.text}>
                                                <span>{c.user.name}</span>
                                                <p
                                                    className={
                                                        styles.commentBody
                                                    }
                                                >
                                                    {c.text}
                                                </p>
                                            </div>
                                            <span>{c.likesCount ?? 0}</span>
                                            <div
                                                className={
                                                    styles.actionButtonComments
                                                }
                                            >
                                                <HeartIcon
                                                    className={styles.like}
                                                    color={
                                                        c.liked
                                                            ? "#FF0000"
                                                            : "#000000"
                                                    }
                                                    fill={
                                                        c.liked
                                                            ? "#FF0000"
                                                            : "#FFFFFF"
                                                    }
                                                    onClick={() =>
                                                        onLikeClick(
                                                            c.id,
                                                            c.liked
                                                        )
                                                    }
                                                />
                                                {c.self && (
                                                    <TrashIcon
                                                        className={styles.trash}
                                                        onClick={() =>
                                                            onDeleteMessage(
                                                                c.id
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <p>
                    Faça{" "}
                    <RouterLink href={PageRoutesName.auth.login}>
                        login
                    </RouterLink>{" "}
                    para acessar os comenarios
                </p>
            )}
        </>
    );
}
