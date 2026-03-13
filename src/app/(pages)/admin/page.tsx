import AddArticle from "@/components/AddArticle";

export default async function Admine() {
  return (
    <div className="my-12 flex flex-col">
      <h1 className="text-3xl font-bold mb-5">Add Article</h1>
      <AddArticle />
    </div>
  );
}
