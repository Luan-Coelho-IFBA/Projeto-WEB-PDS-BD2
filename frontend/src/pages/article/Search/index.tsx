import { useSearchParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import { searchArticle } from "../../../services/articles/searchArticle";
import { NewsSection } from "../../../components/NewsSection";
import styles from "./styles.module.css";
import {
    errorFetchingArticlesMessageText,
    loadingContentText,
} from "../../../constants/textContent";

export default function Search() {
    const [searchParams, _] = useSearchParams();

    const searchArticlesQuery = useQuery({
        queryKey: ["searchArticle"],
        queryFn: () => searchArticle(searchParams.get("query") ?? ""),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    return (
        <DefaultLayout>
            <main className={styles.mainContent}>
                <div className={styles.section}>
                    {searchArticlesQuery.isLoading && (
                        <div className={styles.loading}>
                            {loadingContentText}
                        </div>
                    )}

                    {searchArticlesQuery.isError && (
                        <div className={styles.error}>
                            <p>{errorFetchingArticlesMessageText}</p>
                            <button
                                onClick={() => searchArticlesQuery.refetch()}
                                className={styles.retryButton}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {searchArticlesQuery.data &&
                        !searchArticlesQuery.isLoading &&
                        searchArticlesQuery.data.articles.length <= 0 && (
                            <h3>
                                Artigos com o título "
                                {searchParams.get("query") ?? ""}" não foi
                                encontrado
                            </h3>
                        )}

                    {searchArticlesQuery.data &&
                        !searchArticlesQuery.isLoading &&
                        searchArticlesQuery.data.articles.length > 0 && (
                            <NewsSection
                                title={searchParams.get("query") ?? ""}
                                articles={searchArticlesQuery.data.articles}
                            />
                        )}
                </div>
            </main>
        </DefaultLayout>
    );
}
