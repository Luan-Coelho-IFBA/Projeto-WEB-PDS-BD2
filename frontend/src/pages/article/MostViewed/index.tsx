import { useQuery } from "@tanstack/react-query";
import { getLatestArticles } from "../../../services/articles/getLatestArticles";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import styles from "./styles.module.css";
import {
    errorFetchingArticlesMessageText,
    loadingContentText,
} from "../../../constants/textContent";
import { NewsSection } from "../../../components/NewsSection";

export default function MostViewedArticles() {
    // Query para artigos recentes
    const MostViewedArticlesQuery = useQuery({
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
                    {MostViewedArticlesQuery.isLoading && (
                        <div className={styles.loading}>
                            {loadingContentText}
                        </div>
                    )}

                    {MostViewedArticlesQuery.isError && (
                        <div className={styles.error}>
                            <p>{errorFetchingArticlesMessageText}</p>
                            <button
                                onClick={() =>
                                    MostViewedArticlesQuery.refetch()
                                }
                                className={styles.retryButton}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {MostViewedArticlesQuery.data &&
                        !MostViewedArticlesQuery.isLoading && (
                            <NewsSection
                                title="Artigos mais vistos"
                                articles={MostViewedArticlesQuery.data.articles}
                            />
                        )}
                </div>
            </main>
        </DefaultLayout>
    );
}
