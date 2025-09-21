import { useParams } from "react-router";
import { DefaultLayout } from "../../../layouts/DefaultLayout";
import { useQuery } from "@tanstack/react-query";
import { getArticlesByCategory } from "../../../services/articles/getArticlesByCategory";
import { useEffect } from "react";

export default function ArticlesByCategory() {
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    }, []);

    const getAllByCategoriesQuery = useQuery({
        queryKey: ["allArticlesByCategory"],
        queryFn: () => getArticlesByCategory(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    return (
        <DefaultLayout>
            <main></main>
        </DefaultLayout>
    );
}
