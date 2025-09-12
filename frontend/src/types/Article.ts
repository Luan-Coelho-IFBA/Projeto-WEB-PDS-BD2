export interface Article {
	id: number;
	title: string;
	subtitle: string;
	text: string;
	image: any;
	imageMimeType: any;
	userId: number;
}

export type ArticleApiResponse = {
	articles: Article[];
	page: number;
};
