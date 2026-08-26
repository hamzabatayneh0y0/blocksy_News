"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  currentSort: string;
  searchText: string;
}

export default function ArticleFilter({ currentSort, searchText }: Props) {
  const router = useRouter();

  function handleFilterChange(value: string | null) {
    const params = new URLSearchParams();

    if (searchText) {
      params.set("searchText", searchText);
    }

    params.set("sort", value || "latest");

    params.set("pageNumber", "1");

    router.push(`/articles?${params.toString()}`);
  }

  return (
    <Select value={currentSort} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full cursor-pointer sm:w-[150px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem className="cursor-pointer" value="latest">
          Latest
        </SelectItem>

        <SelectItem className="cursor-pointer" value="oldest">
          Oldest
        </SelectItem>

        <SelectItem className="cursor-pointer" value="popular">
          Popular
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
