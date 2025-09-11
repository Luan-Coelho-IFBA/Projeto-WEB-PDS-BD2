import { useEffect, useState } from "react";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import type { Article } from "../../types/Article";
import { getAllArticles } from "../../services/articles/getAllArticles";

import styles from "./styles.module.css";
import { NewsSection } from "../../components/NewsSection";
import { getLatestArticles } from "../../services/articles/getLatestArticles";

export function HomePage() {
	const [articles, setArticles] = useState<Article[]>([]);

	const [newestArticles, setNewestArticles] = useState<Article[]>([]);

	useEffect(() => {
		getAllArticles(3, 0)
			.then((data) => {
				console.log("TODOS OS ARTIGOS", data.articles);

				if (Array.isArray(data.articles)) {
					setArticles(data.articles);
				}
			})
			.catch((error) => {
				console.error("Erro ao buscar artigos:", error);
				setArticles([]);
			});

		getLatestArticles(3, 0)
			.then((data) => {
				console.log("Ultimos artigos:", data.articles);

				if (Array.isArray(data.articles)) {
					setNewestArticles(data.articles);
				}
			})
			.catch((error) => {
				console.log("Erro ao buscar os ultimos artigos", error);
				setNewestArticles([]);
			});
	}, []);

	return (
		<DefaultLayout>
			<main className={styles.mainContent}>
				{newestArticles.length > 0 && (
					<NewsSection
						articles={newestArticles}
						title="Artigos recentes"
					/>
				)}

				<NewsSection articles={articles} title="Todos os artigos" />
			</main>
		</DefaultLayout>
	);
}
