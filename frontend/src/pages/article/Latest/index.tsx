import { useQuery } from "@tanstack/react-query";
import { getLatestArticles } from "../../../services/articles/getLatestArticles";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import styles from "./styles.module.css";
import { NewsSection } from "../../../components/NewsSection";
import {
    errorFetchingArticlesMessageText,
    loadingContentText,
} from "../../../constants/textContent";

export default function LatestArticles() {
    // Query para artigos recentes
    const latestArticlesQuery = useQuery({
        queryKey: ["latestArticles"],
        queryFn: () => getLatestArticles(),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <DefaultLayout>
            <main className={styles.mainContent}>
                <div className={styles.section}>
                    {latestArticlesQuery.isLoading && (
                        <div className={styles.loading}>
                            {loadingContentText}
                        </div>
                    )}

                    {latestArticlesQuery.isError && (
                        <div className={styles.error}>
                            <p>{errorFetchingArticlesMessageText}</p>
                            <button
                                onClick={() => latestArticlesQuery.refetch()}
                                className={styles.retryButton}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {latestArticlesQuery.data &&
                        !latestArticlesQuery.isLoading && (
                            <NewsSection
                                title="Artigos recentes"
                                articles={latestArticlesQuery.data.articles}
                            />
                        )}
                </div>
            </main>
        </DefaultLayout>
    );
}
