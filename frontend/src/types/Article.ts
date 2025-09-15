export interface Article {
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
