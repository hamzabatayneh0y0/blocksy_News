import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h2 className="text-[120px] md:text-[180px] leading-none font-extrabold text-primary">
          404
        </h2>

        <h3 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-foreground">
          Page Not Found
        </h3>

        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
