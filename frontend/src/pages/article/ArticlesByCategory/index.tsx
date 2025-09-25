import { useParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import { getArticlesByCategory } from "../../../services/articles/getArticlesByCategory";
import styles from "./styles.module.css";
import {
    errorFetchingArticlesMessageText,
    loadingContentText,
} from "../../../constants/textContent";
import { NewsSection } from "../../../components/NewsSection";

export default function ArticlesByCategory() {
    const { id } = useParams();

    const getAllByCategoriesQuery = useQuery({
        queryKey: ["allArticlesByCategory", id],
        queryFn: () => getArticlesByCategory(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <DefaultLayout>
            <main className={styles.mainContent}>
                <div className={styles.section}>
                    {getAllByCategoriesQuery.isLoading && (
                        <div className={styles.loading}>
                            {loadingContentText}
                        </div>
                    )}

                    {getAllByCategoriesQuery.isError && (
                        <div className={styles.error}>
                            <p>{errorFetchingArticlesMessageText}</p>
                            <button
                                onClick={() =>
                                    getAllByCategoriesQuery.refetch()
                                }
                                className={styles.retryButton}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {getAllByCategoriesQuery.data &&
                        !getAllByCategoriesQuery.isLoading && (
                            <NewsSection
                                title="Categorias"
                                articles={getAllByCategoriesQuery.data.articles}
                            />
                        )}
                </div>
            </main>
        </DefaultLayout>
    );
}
