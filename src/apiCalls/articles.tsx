"use server";
import { DOMAIN } from "@/utils/constants";

export async function getArticles(page: string) {
  const data = await fetch(`${DOMAIN}/api/articles?pageNumber=${page || 1}`, {
    next: { revalidate: 60 },
  });

  if (!data.ok) {
    throw new Error("falied to fetch articles");
  }

  return data.json();
}

export async function getSingleArticles(id: string) {
  const data = await fetch(`${DOMAIN}/api/articles/${id}`, {
    cache: "no-store",
  });

  if (!data.ok) {
    throw new Error("falied to fetch articles");
  }

  return data.json();
}

export async function getArticlesBySearch(search: string) {
  const data = await fetch(
    `${DOMAIN}/api/articles/search?searchText=${search}`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!data.ok) {
    throw new Error("falied to fetch articles");
  }

  return data.json();
}

export async function getArticlesCount() {
  const data = await fetch(`${DOMAIN}/api/articles/count`, {
    next: { revalidate: 60 },
  });

  if (!data.ok) {
    throw new Error("falied to fetch articles");
  }

  return data.json();
}
