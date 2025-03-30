import Link from "next/link";

export default async function IndexPage() {
  return (
    <main className="flex h-dvh w-screen flex-col justify-between font-semibold sm:h-screen">
      <div className="flex flex-col">
        Group Reading
        <Link href="/upload">Upload your first book</Link>
      </div>
    </main>
  );
}
