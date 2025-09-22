export interface Category {
    id: number;
    name: string;
    updatedAt: string;
    createdAt: string;
    description: string;
}

export type CategoryResponseApi = {
    data: {
        categories: Category[];
    };
};
