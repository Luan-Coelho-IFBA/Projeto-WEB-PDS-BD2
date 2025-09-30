import { useNavigate } from "react-router";
import { errorFetchingArticlesMessageText } from "../../constants/textContent";
import type { Article } from "../../types/Article";

import styles from "./styles.module.css";
import { PageRoutesName } from "../../constants/PageRoutesName";
import { RouterLink } from "../RouterLink";

type NewsSectionProps = {
    title: string;
    articles: Article[] | undefined;
    limit?: number;
    link?: string;
};

export function NewsSection({
    title,
    articles,
    limit,
    link,
}: NewsSectionProps) {
    const navigate = useNavigate();

    if (!articles) return <p>{errorFetchingArticlesMessageText}</p>;

    const displayedArticles = limit ? articles.slice(0, limit) : articles;
    return (
        <section className={styles.contentRow}>
            <div className={styles.articleHeaderContainer}>
                <h3 className={styles.titleSection}>{title}</h3>
                {link && (
                    <RouterLink href={link} style={{ fontSize: 14 }}>
                        Ver mais
                    </RouterLink>
                )}
            </div>
            <div className={styles.articleContainerList}>
                {displayedArticles.map((article) => (
                    <div
                        className={styles.articleContent}
                        key={article.id}
                        onClick={() =>
                            navigate({
                                pathname: `${PageRoutesName.articles.seeArticle}/${article.id}`,
                            })
                        }
                    >
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
