
import api from "@/lib/axios";
import { CommentsResponse, RepliesResponse } from "@/utils/types";
import {

  createCommentSchema,

  updateCommentSchema,
} from "@/utils/validationSchemas";
import axios from "axios";

export async function getArticleComments(
  articleId: number,
  pageNumber: number,
) {
  try {
    const { data } = await api.get(`articles/${articleId}/comments`, {
      params: {
        pageNumber,
      },
    });

    return data as CommentsResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to get article comments",
      );
    }

    throw error;
  }
}

export async function getCommentReplies(
  commentId: number,
  pageNumber: number,
) {
  try {
    const { data } = await api.get(
      `comments/${commentId}/replies`,
      {
        params: {
          pageNumber,
        },
      },
    );

    return data as RepliesResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to get comment replies",
      );
    }

    throw error;
  }
}

export async function createComment(
 
  text: string,
  articleId: number,
  parentId: number|null,
  rootId: number|null,
) {
  const validation = createCommentSchema.safeParse({
    text,
    articleId,
    parentId,
    rootId
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const { data } = await api.post("comments", {
   
      text,
      articleId,
      parentId,
      rootId
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to create comment",
      );
    }

    throw error;
  }
}

export async function updateComment(
  commentId: number,
  text: string,
) {
  const validation = updateCommentSchema.safeParse({
    text,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const { data } = await api.put(
      `comments/${commentId}`,
      { text },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to update comment",
      );
    }

    throw error;
  }
}

export async function deleteComment(commentId: number) {
  try {
    const { data } = await api.delete(
      `comments/${commentId}`,
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to delete comment",
      );
    }

    throw error;
  }
}

export async function likeComment(
  commentId: number,
  isLiked: boolean,
) {
  try {
    const { data } = await api.post(
      `comments/${commentId}/like`,
      {
        isLiked,
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }

      throw new Error(
        error.response?.data?.message ||
          "Failed to update comment like",
      );
    }

    throw error;
  }
}