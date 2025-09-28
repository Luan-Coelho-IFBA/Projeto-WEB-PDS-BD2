import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getArticle } from "../../../services/articles/getArticle";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { Loader } from "../../../components/Loader";
import { CommentsSection } from "./Comments";
import { formatDate } from "../../../utils/formatDate";
import { RouterLink } from "../../../components/RouterLink";
import { PageRoutesName } from "../../../constants/PageRoutesName";

SeeArticlePage.Comments = CommentsSection;

export default function SeeArticlePage() {
    const { id } = useParams();

    const { data: articleData, isLoading: articleIsLoading } = useQuery({
        queryKey: ["articleID"],
        queryFn: () => getArticle(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <DefaultLayout>
            {articleIsLoading && (
                <Loader style={{ marginTop: "5rem" }} direction="column">
                    <Loader.TextMessage
                        color="black"
                        feedbackMessage="Carregando artigo..."
                    />
                    <Loader.Icon />
                </Loader>
            )}
            {!articleIsLoading && articleData && (
                <main className={styles.containerArticle}>
                    <h2 className={styles.title}>
                        {articleData?.article.title}
                    </h2>
                    <h2 className={styles.subtitle}>
                        {articleData?.article.subtitle}
                    </h2>
                    <div className={styles.infoArticle}>
                        <small className={styles.categories}>
                            Categorias:{" "}
                            {articleData?.article.categories.map((category, index) => (
                                <span key={category.id}>
                                    <RouterLink 
                                        href={`${PageRoutesName.articles.articlesByCategory}/${category.id}`}
                                        className={styles.categoryLink}
                                    >
                                        {category.name}
                                    </RouterLink>
                                    {index < articleData.article.categories.length - 1 && ", "}
                                </span>
                            ))}
                        </small>
                        <span className={styles.madeBy}>
                            Feito por:{" "}
                            <span>
                                {articleData.article.users.name},{" "}
                                {formatDate(articleData.article.createdAt)}
                            </span>
                        </span>
                    </div>
                    <img
                        src={`data:${articleData?.article.imageMimeType};base64,${articleData?.article.image}`}
                        alt={articleData?.article.title}
                        title={articleData?.article.title}
                        aria-label={articleData?.article.title}
                    />
                    <p
                        className={styles.textContent}
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        {articleData?.article.text}
                    </p>

                    <SeeArticlePage.Comments />
                </main>
            )}
        </DefaultLayout>
    );
}
