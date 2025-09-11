import type { Article } from "../../types/Article";

import styles from "./styles.module.css";

type NewsSectionProps = {
	title: string;
	articles: Article[];
	limit?: number;
};

export function NewsSection({ title, articles, limit }: NewsSectionProps) {
	const displayedArticles = limit ? articles.slice(0, limit) : articles;
	return (
		<section className={styles.contentRow}>
			<h3 className={styles.titleSection}>{title}</h3>
			<div className={styles.articleContainerList}>
				{displayedArticles.map((article) => (
					<div className={styles.articleContent} key={article.id}>
						<img
							src={`data:${article.imageMimeType};base64,${article.image}`}
							alt={article.subtitle}
						/>
						<p>{article.title}</p>
					</div>
				))}
			</div>
		</section>
	);
}
