"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@/utils/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { searchTags } from "@/apiCalls/clientCalls/articles";

export default function CategorySearch() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: tags = [],
    isError,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["tags-search", debouncedSearch],
    queryFn: () => searchTags(debouncedSearch),
    enabled: !!debouncedSearch.replace(/\s/g, ""),

    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });
  useEffect(() => {
    if (isError) {
      toast.error(error.message || "something went wrong");
    }
  }, [isError, error]);
  const showDropdown = search.replace(/\s/g, "").length > 0;

  return (
    <div className="relative w-full max-w-sm py-12">
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value.replace(/\s/g, ""));
        }}
        placeholder="Search by category..."
        className="h-11 rounded-xl focus:border-none "
      />

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <Command>
            <CommandList>
              {isFetching ? (
                <div className="p-3 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : (
                <>
                  <CommandEmpty>No categories found.</CommandEmpty>

                  {tags.map((tag) => (
                    <CommandItem key={tag.name}>
                      <Link
                        href={`/admin?searchText=${encodeURIComponent(tag.name)}`}
                        className="flex w-full cursor-pointer items-center justify-between"
                        onClick={() => {
                          setSearch("");
                        }}
                      >
                        <span>{tag.name}</span>

                        <span className="text-xs text-muted-foreground">
                          {tag.count} articles
                        </span>
                      </Link>
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
