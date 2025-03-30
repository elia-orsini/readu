import Link from "next/link";

async function getChapterReadings() {
  try {
    const res = await fetch(`https://group-reading.vercel.app/api/readings`, {
      next: { revalidate: 60 },
    });

    if (res.ok) return await res.json();

    throw new Error("Both relative and absolute URLs failed");
  } catch {
    return { readings: [] };
  }
}

export default async function RecapPage() {
  const { readings } = await getChapterReadings();

  const readingMap = readings?.reduce((acc: any, reading: any) => {
    const chapterId = reading.chapterId.S;
    const person = reading.person.S;
    acc[chapterId] = acc[chapterId] || {};
    acc[chapterId][person] = true;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800 sm:text-3xl">Reading History</h1>
          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:text-base"
          >
            ← Back to Reading
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-gray-700">
            <div className="col-span-6 pl-6">Chapter</div>
            <div className="col-span-3 text-center">依依</div>
            <div className="col-span-3 text-center">沁瑜</div>
          </div>

          {/* Table Rows */}
          {Object.keys(readingMap).map((title: any) => (
            <div
              key={title}
              className="grid grid-cols-12 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="col-span-6 flex items-center pl-6 font-medium text-gray-800">
                <span className="truncate capitalize">{title}</span>
              </div>

              <div className="col-span-3 flex justify-center">
                <StatusBadge read={readingMap?.[title]?.["yiyi"]} person="yiyi" />
              </div>

              <div className="col-span-3 flex justify-center">
                <StatusBadge read={readingMap?.[title]?.["qinyu"]} person="qinyu" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ read, person }: { read: boolean; person: string }) {
  return (
    <button
      className={`relative min-w-[60px] rounded-lg border px-4 py-2 text-sm transition-all sm:min-w-[100px] ${
        read
          ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } focus:outline-none focus:ring-2 focus:ring-green-300`}
      disabled={read}
    >
      {read && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
          ✓
        </span>
      )}
      {person === "yiyi" ? "依依" : "沁瑜"}
    </button>
  );
}
