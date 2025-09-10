import { useEffect, useState } from "react";
import { DefaultLayout } from "../../layouts/DefaultLayout";
import type { Article } from "../../types/Article";
import { getAllArticles } from "../../services/articles/getAllArticles";

export function HomePage() {
	const [articles, setArticles] = useState<Article[]>([]);

	useEffect(() => {
		getAllArticles(10)
			.then((data) => {
				console.log(data.articles);

				if (Array.isArray(data.articles)) {
					setArticles(data.articles);
				}
			})
			.catch((error) => {
				console.error("Erro ao buscar artigos:", error);
				setArticles([]);
			});
	}, []);

	return (
		<DefaultLayout>
			{Array.isArray(articles) &&
				articles.map((article) => (
					<div key={article.id}>
						<h3>{article.title}</h3>
						<p>{article.text}</p>
					</div>
				))}
		</DefaultLayout>
	);
}
