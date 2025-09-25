// pages/HomePage/index.tsx
import { DefaultLayout } from "../../layouts/DefaultLayout";
import { NewsSection } from "../../components/NewsSection";
import { getLatestArticles } from "../../services/articles/getLatestArticles";
import { useQuery } from "@tanstack/react-query";
import {
    errorFetchingArticlesMessageText,
    loadingContentText,
} from "../../constants/textContent";
import styles from "./styles.module.css";
import { getLocalStorageRole } from "../../utils/getLocalStorageRole";
import { PlusIcon } from "lucide-react";
import { PageRoutesName } from "../../constants/PageRoutesName";
import { useNavigate } from "react-router";
import { getMostViewed } from "../../services/articles/getMostViewed";

export function HomePage() {
    // Query para artigos recentes
    const latestArticlesQuery = useQuery({
        queryKey: ["latestArticlesPage"],
        queryFn: () => getLatestArticles(3, 0),
        retry: 2,
        staleTime: 2 * 60 * 1000,
        gcTime: 0,
    });

    // Query para artigos em alta
    const mostViewedArticlesQr = useQuery({
        queryKey: ["articles"],
        queryFn: () => getMostViewed(3, 0),
        retry: 2,
        staleTime: 5 * 60 * 1000,
        gcTime: 0,
    });

    const navigate = useNavigate();
    const role = getLocalStorageRole();
    const isJornalista = role == "JORNALISTA";
    const isAdmin = role == "ADMIN";

    return (
        <DefaultLayout>
            <main className={styles.mainContent}>
                {/* Seção de artigos recentes */}
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
                                link={PageRoutesName.articles.latest}
                                articles={latestArticlesQuery.data.articles}
                            />
                        )}
                </div>

                {/* Seção de artigos em alta */}
                <div className={styles.section}>
                    {mostViewedArticlesQr.isLoading && (
                        <div className={styles.loading}>
                            {loadingContentText}
                        </div>
                    )}

                    {mostViewedArticlesQr.isError && (
                        <div className={styles.error}>
                            <p>
                                {(mostViewedArticlesQr.error as Error)
                                    ?.message ||
                                    "Erro ao carregar artigos em alta"}
                            </p>
                            <button
                                onClick={() => mostViewedArticlesQr.refetch()}
                                className={styles.retryButton}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {mostViewedArticlesQr.data &&
                        !mostViewedArticlesQr.isLoading && (
                            <NewsSection
                                title="Em alta"
                                link={PageRoutesName.articles.mostViewed}
                                articles={mostViewedArticlesQr.data.articles}
                            />
                        )}
                </div>
                {isJornalista ||
                    (isAdmin && (
                        <div
                            onClick={() => {
                                navigate(PageRoutesName.articles.createArticle);
                            }}
                            className={styles.createArticle}
                        >
                            <PlusIcon className={styles.createIcon} />
                            <span>Criar Artigo</span>
                        </div>
                    ))}
            </main>
        </DefaultLayout>
    );
}
