import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getArticle } from "../../../services/articles/getArticle";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";

export default function SeeArticlePage() {
    const { id } = useParams();

    const { data } = useQuery({
        queryKey: ["articleID"],
        queryFn: () => getArticle(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    console.log(data);

    return (
        <DefaultLayout>
            <main className={styles.containerArticle}>
                <small>
                    {data?.article.categories
                        .map((category) => category.name)
                        .join(",")}
                </small>
                <h2>{data?.article.title}</h2>
                <h2>{data?.article.subtitle}</h2>
                <p>{data?.article.text}</p>
                <img
                    src={`data:${data?.article.imageMimeType};base64,${data?.article.image}`}
                    alt={data?.article.subtitle}
                />
            </main>
        </DefaultLayout>
    );
}
