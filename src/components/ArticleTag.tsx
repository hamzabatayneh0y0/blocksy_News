import { Badge } from "@/components/ui/badge";

type ArticleTagProps = {
  tag: string;
};

export default function ArticleTag({ tag }: ArticleTagProps) {
  return (
    <Badge
      variant="secondary"
      className="rounded-md px-2.5 py-1 text-xs font-medium"
    >
      #{tag}
    </Badge>
  );
}
