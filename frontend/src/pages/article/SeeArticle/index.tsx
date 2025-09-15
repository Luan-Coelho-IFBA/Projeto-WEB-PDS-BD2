import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getArticle } from "../../../services/articles/getArticle";
import { DefaultLayout } from "../../../layouts/DefaultLayout";

import styles from "./styles.module.css";

export default function SeeArticlePage() {
    const { id } = useParams();

    const articleQuery = useQuery({
        queryKey: ["article"],
        queryFn: () => getArticle(Number(id)),
        retry: 2,
        staleTime: 2 * 60 * 1000,
    });

    return (
        <DefaultLayout>
            <main className={styles.containerArticle}></main>
        </DefaultLayout>
    );
}
