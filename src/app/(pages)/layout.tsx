import Footer from "@/components/Footer";
import Header from "@/components/header";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col ">
      <Header />
      <main className="min-h-[calc(100vh-534px)] container mx-auto  px-5">
        {children}
      </main>

      <Footer />
    </div>
  );
}
