import { User } from "./User";

export interface Comment {
    id: number;
    text: string;
    articleId: number;
    userId: number;
    likeCount: number;
    user: User;
    self: boolean;
}
