import { Article, Bookmark, Comment, User } from "@prisma/client";

export type JWTPayload = {
    id: number;
    isAdmin: boolean;
    username: string;
}

export type CommentWithUser = Comment & { user: User,likes:{userId:number}[] };

export type SingleArticle = Article & { comments: CommentWithUser[] ,bookmarks:{userId:number}[],likes:{userId:number}[]};
export type NewArticle =Article & {bookmarks:{userId:number}[]}