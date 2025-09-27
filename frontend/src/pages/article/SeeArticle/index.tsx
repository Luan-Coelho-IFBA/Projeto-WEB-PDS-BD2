import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getArticle } from "../../../services/articles/getArticle";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";
import { Loader } from "../../../components/Loader";
import { CommentsSection } from "./Comments";

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

                    <SeeArticlePage.Comments />
                </main>
            )}
        </DefaultLayout>
    );
}
