import Header from "@/components/header/Header";
import RecapTable from "@/components/recap/RecapTable";
import Link from "next/link";

export default async function RecapPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-base font-bold text-foreground sm:text-3xl">Reading History</h1>
            <Link
              href={`/reading/${slug}`}
              className="flex items-center gap-1 rounded-lg border border-foreground bg-background px-1 py-2 text-xs text-foreground transition-all hover:bg-thirdiary hover:text-foreground focus:outline-none focus:ring-gray-300 sm:px-4 sm:text-base sm:text-sm"
            >
              ← Back to Reading
            </Link>
          </div>

          <RecapTable slug={slug} />
        </div>
      </div>
    </>
  );
}
