import api from "@/lib/axios";
import { InteractionsResponse, Tag } from "@/utils/types";
import {
  createArticleSchema,

  deleteManyArticlesschema,
  updateArticleSchema,
  updateArticleTagsSchema,
 
} from "@/utils/validationSchemas";
import axios from "axios";

export async function searchTags(search: string):Promise<Tag[]> {

  try {
    
    const { data } = await api.get(`tags/search`, {
      params: {
        tag: search,
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
     
      throw new Error(
        error.response?.data?.message || "Failed to create article",
      );
    }

    throw error;
  }
}

// export async function deleteArticle(articleId: string) {
//   try
//    {   const Id = parseInt(articleId);

//       if (isNaN(Id)) {
//        throw new Error("invalid article id" )

//       }
//   const { data } = await api.delete(`articles/${articleId}`);

//   return data;} catch(error){
//      if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response?.data?.message || "Failed to create article",
//       );
//     }

//     throw error;
//   }

// }

export async function deleteManyArticles(articleIds: string[]) {
  const validation = deleteManyArticlesschema.safeParse({
    ids: articleIds.map((id) => Number(id)),
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { ids } = validation.data;
  try {
    const { data } = await api.delete("articles", {
      data: {
        ids
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      
      throw new Error(
        error.response?.data?.message || "Failed to create article",
      );
    }

    throw error;
  }
}



export async function createArticle(
  title: string,
  description: string,
  tags: string[],
  image: File,
) {
  const validation = createArticleSchema.safeParse({
    title,
    description,
    tags,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description);
  formData.append("tags", JSON.stringify(tags));
  formData.append("image", image);

  try {
    const { data } = await api.post("articles", formData);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create article",
      );
    }

    throw error;
  }
}

export async function updateArticleText(
  id: string,
  title: string,
  description: string,
) {
  const validation = updateArticleSchema.safeParse({
    title,
    description,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const { data } = await api.put(`articles/${id}`, {
      title,
      description,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update article"
      );
    }

    throw error;
  }
}

export async function updateArticleImage(
  id: string,
  image: File,
) {
  const formData = new FormData();

  formData.append("image", image);

  try {
    const { data } = await api.put(
      `articles/${id}/image`,
      formData,
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update article image",
      );
    }

    throw error;
  }
}

export async function updateArticleTags(
  id: string,
  tags: string[],
) {
  const validation = updateArticleTagsSchema.safeParse({
    tags,
  });

  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const { data } = await api.put(
      `articles/${id}/tags`,
      {
        tags,
      },
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update article tags",
      );
    }

    throw error;
  }
}




export async function getInteractions(articleId: number) {
  const { data } = await api.get<InteractionsResponse>(
    `/articles/${articleId}/interactions`,
  );

  return data;
}

export async function setLike(articleId: number, isLiked: boolean) {
  const { data } = await api.post(`/articles/${articleId}/like`, {
    isLiked,
  });

  return data;
}

export async function setSave(
  articleId: number,
  isBookmarked: boolean,
) {
  const { data } = await api.post(`/articles/${articleId}/save`, {
    isBookmarked,
  });

  return data;
}


