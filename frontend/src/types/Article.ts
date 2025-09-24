import type { Category } from "./Category";

export interface Article {
    categories: Category[];
    id: number;
    title: string;
    subtitle: string;
    text: string;
    image: FormData;
    imageMimeType: string;
    userId: number;
}

export type ArticleApiResponse = {
    articles: Article[];
    page: number;
};
