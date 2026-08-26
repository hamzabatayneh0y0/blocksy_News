"use server";
import { DOMAIN } from "@/utils/constants";
import { cookies } from "next/headers";

export async function getArticles(
  sort?: string,
  searchText?: string,
  page?: string,
) {
  const data = await fetch(
    `${DOMAIN}/api/articles/search?sort=${sort || "latest"}&searchText=${searchText || ""}&pageNumber=${page || 1}`,
    {
    
      next: {
        revalidate: 60 *10,
        tags: ["articles"],
      },
    },
  );

  if (!data.ok) {
    throw new Error("falied to fetch articles");
  }

  return data.json();
}

export const getSingleArticle = async (id: string) => {
    const cookieStore = await cookies();
  const data = await fetch(`${DOMAIN}/api/articles/${id}`, {
     headers: {
      Cookie: cookieStore.toString(),
    },
    next: {
      revalidate:60*60,
      tags: [`article-${id}`],
    },
  });

  if (data.status === 404) {
    return null;
  }

  if (!data.ok) {
    throw new Error("Failed to fetch article");
  }

  return data.json();
};

