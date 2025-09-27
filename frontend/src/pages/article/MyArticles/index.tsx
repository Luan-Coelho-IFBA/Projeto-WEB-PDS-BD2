import { useQuery } from "@tanstack/react-query";
import styles from "./styles.module.css";
import { getMyArticles } from "../../../services/articles/getMyArticles";
// import { useState } from "react";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
// import { Article } from "../../../types/Article";
import { formatDate } from "../../../utils/formatDate";
import { useNavigate } from "react-router";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
    errorFetchingData,
    loadingContentText,
} from "../../../constants/textContent";
import { Loader } from "../../../components/Loader";

export default function MyArticles() {
    const navigate = useNavigate();

    const {
        data: myArticlesQueries,
        isSuccess,
        isError,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["myArticles"],
        queryFn: getMyArticles,
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    /* const [selectedArticleRemove, setSelectedArticleRemove] =
        useState<Article>();
    const [modalRemoveArticle, setModalRemoveArticle] = useState(false); */

    return (
        <DefaultLayout className={styles.generalContainer} authenticated>
            <main className={styles.sectionContainer}>
                <h2 className={styles.title} style={{ marginBottom: "20px" }}>
                    Gerenciar meus artigos
                </h2>

                {/* 
                {selectedArticleRemove && modalRemoveArticle && (
                    <ModalRemoveCategory
                        category={selectedArticleRemove}
                        handleModal={setModalRemoveArticle}
                        refetchCategories={refetch}
                        isOpen={modalRemoveArticle}
                    />
                )}
                 */}

                <div className={styles.tableContainer}>
                    {isSuccess && myArticlesQueries.articles.length === 0 && (
                        <div className={styles.feedbackMessage}>
                            <p>Nenhum artigo registrado.</p>
                        </div>
                    )}
                    {isSuccess && myArticlesQueries.articles.length > 0 && (
                        <table className={styles.tableList}>
                            <thead>
                                <tr>
                                    <th>Título do Artigo</th>
                                    <th>ID do Artigo</th>
                                    <th>Data de Criação</th>
                                    <th>Subtítulo</th>
                                    <th>Editar</th>
                                    <th>Remover</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myArticlesQueries.articles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className={styles.tableLineData}
                                    >
                                        <td>
                                            <span>{article.title}</span>
                                        </td>
                                        <td>
                                            <span>{article.id}</span>
                                        </td>
                                        <td>
                                            <span>
                                                {formatDate(article.createdAt)}
                                            </span>
                                        </td>
                                        <td>
                                            <span title={article.subtitle}>
                                                {article.subtitle}
                                            </span>
                                        </td>
                                        {/* ALTERAR CATEGORIA */}
                                        <td
                                            onClick={() => {
                                                navigate("/");
                                            }}
                                            className={styles.iconAction}
                                        >
                                            <PencilIcon />
                                            <span>Alterar Artigo</span>
                                        </td>

                                        {/* REMOVER Artigo */}
                                        <td
                                            className={styles.iconAction}
                                            onClick={() => {
                                                /* setSelectedArticleRemove(
                                                    article
                                                );
                                                setModalRemoveArticle(
                                                    (prev) => !prev
                                                ); */
                                            }}
                                        >
                                            <TrashIcon color="red" />
                                            <span>Remover Artigo</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {isError && (
                        <div className={styles.feedbackMessage}>
                            <p className={styles.error}>{errorFetchingData}</p>
                            <button
                                className={styles.error}
                                onClick={() => refetch()}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                    {isLoading && (
                        <div className={styles.feedbackMessage}>
                            <Loader direction="column">
                                <Loader.TextMessage
                                    color="grey"
                                    feedbackMessage={loadingContentText}
                                />
                                <Loader.Icon />
                            </Loader>
                        </div>
                    )}
                </div>
            </main>
        </DefaultLayout>
    );
}
