import { useParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import { getArticlesByCategory } from "../../../services/articles/getArticlesByCategory";

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
            <main>
                {getAllByCategoriesQuery.isLoading && <p>Loading...</p>}
                {getAllByCategoriesQuery.isError && (
                    <p>Error loading articles</p>
                )}
                {getAllByCategoriesQuery.data && (
                    <ul>
                        {getAllByCategoriesQuery.data.articles.map(
                            (article) => (
                                <li key={article.id}>{article.title}</li>
                            )
                        )}
                    </ul>
                )}
            </main>
        </DefaultLayout>
    );
}
