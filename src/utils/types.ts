import { CredentialsSignin } from "next-auth";

export type JWTPayload = {
    id: number;
    isAdmin: boolean;
    username: string;
}

export type Article= {

 tags: string[];
 likesCount: number;
 savedCount: number;
 title: string;
 id: number;
 description: string;
 imageUrl: string;
 createdAt: Date;
}
type ArticleSort = "latest" | "oldest" | "popular";


export type getArticlesProps = {
  articles: Article[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
  sort: ArticleSort;
};


export interface Tag {
  name: string;
  count: number;
}





export interface InteractionsResponse {
  likesCount: number;
  savedCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface ArticleInteractionsProps {
  articleId: number;
}


export type Comment= {
 isLiked: boolean;
 user: {
 id: number;
 name: string | null;
 image: string | null;
 };
 text: string;
 createdAt: Date;
 parent: {
  id:number

 user: {
 name: string | null;
 };
 } | null;
 id: number;
 _count: {
 likes: number;
 replies: number;
 };
}



export interface CommentsResponse {
  comments: Comment[];
  currentPage: number;
  totalPages: number;
  totalComments: number;
}

export interface RepliesResponse {
  replies: Comment[];
  currentPage: number;
  totalPages: number;
  totalReplies: number;
}

export interface CreateCommentPayload {
 
  text: string;
  articleId: number;
  parentId: number|null;
}

export interface UpdateCommentPayload {
  text: string;
}


export interface UserProfile {
  id: number;
  email: string;
  name: string;
  image: string | null;
  createdAt: Date;
}


export interface UserActivityArticle {


 tags: string[];
 likesCount: number;
 savedCount: number;
 title: string;
 id: number;
 description: string;
 imageUrl: string;
 createdAt: Date;
}

export interface UserComment {
  id: number;
  text: string;
  createdAt: string;
  article: {
    id: number;
  };
}


export type ForYouTag = {
  name: string;
  weight: number;
  updatedAt: string;
};
export type UpdateForYouBody = {
  userId: string;
  articleTags: string[];
};


export type NotificationType =
  | "COMMENT_LIKE"
  | "COMMENT_UNLIKE"
  | "COMMENT_REPLY"
  | "ARTICLE_LIKE"
  | "ARTICLE_UNLIKE"
  | "ARTICLE_COMMENT"
  | "FOLLOW"
  | "GLOBAL";

export type NotificationEntityType =
  | "article"
  | "comment"
  | "reply"
  | "user";

export interface Notification {
  id: string;

  recipientId?: string;
  actorId?: string;

  type: NotificationType;

  entityId?: string;
  entityType?: NotificationEntityType;

  url?: string;

  title?: string;
  message?: string;

  createdAt: number;
}
export class LoginError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS";
}

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}
