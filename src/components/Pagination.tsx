import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Props {
  currentPage: number;
  lastIndex: number;
  searchText: string;
  sort: string;
}

const getPaginationItems = (
  currentPage: number,
  lastIndex: number,
): (number | "ellipsis")[] => {
  if (lastIndex <= 5) {
    return Array.from({ length: lastIndex }, (_, i) => i + 1);
  }

  // بداية الصفحات
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", lastIndex];
  }

  // نهاية الصفحات
  if (currentPage >= lastIndex - 2) {
    return [
      1,
      "ellipsis",
      lastIndex - 3,
      lastIndex - 2,
      lastIndex - 1,
      lastIndex,
    ];
  }

  // منتصف الصفحات
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    lastIndex,
  ];
};

export default function ArticlePagination({
  currentPage,
  lastIndex,
  searchText,
  sort,
}: Props) {
  const items = getPaginationItems(currentPage, lastIndex);

  return (
    <Pagination className="m-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?sort=${sort}&searchText=${searchText}&pageNumber=${currentPage - 1 > 0 ? currentPage - 1 : 1}`}
          />
        </PaginationItem>

        {items.map((item, index) => (
          <PaginationItem key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?sort=${sort}&searchText=${searchText}&pageNumber=${item}`}
                isActive={item === currentPage}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={`?sort=${sort}&searchText=${searchText}&pageNumber=${currentPage + 1 > lastIndex ? currentPage + 1 : 1}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
