import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getArticle } from "../../../services/articles/getArticle";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { Loader } from "../../../components/Loader";
import { getCommentsByArticleId } from "../../../services/comments/getComments";
import { getLocalStorageToken } from "../../../utils/getLocalStorageToken";
import { useState } from "react";
import { createComment } from "../../../services/comments/createComment";
import { TrashIcon } from "lucide-react";
import { deleteComment } from "../../../services/comments/deleteComment";

export default function SeeArticlePage() {
    const { id } = useParams();
    const [message, setMessage] = useState("");

    const { data: articleData, isLoading: articleIsLoading } = useQuery({
        queryKey: ["articleID"],
        queryFn: () => getArticle(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

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

    return (
        <DefaultLayout>
            {articleIsLoading && (
                <Loader color="black" direction="column">
                    Carregando artigo...
                </Loader>
            )}

            {!articleIsLoading && articleData && (
                <main className={styles.containerArticle}>
                    <small>
                        {articleData?.article.categories
                            .map((category) => category.name)
                            .join(",")}
                    </small>
                    <h2>{articleData?.article.title}</h2>
                    <h2>{articleData?.article.subtitle}</h2>
                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {articleData?.article.text}
                    </p>
                    <img
                        src={`data:${articleData?.article.imageMimeType};base64,${articleData?.article.image}`}
                        alt={articleData?.article.subtitle}
                    />

                    {commentsIsLoading && (
                        <Loader color="black" direction="column">
                            Carregando comentários...
                        </Loader>
                    )}

                    {getLocalStorageToken() ? (
                        <>
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
                                            {c.likeCount}
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
                        </>
                    ) : (
                        <div>Logue para acessar os comenarios</div>
                    )}
                </main>
            )}
        </DefaultLayout>
    );
}
