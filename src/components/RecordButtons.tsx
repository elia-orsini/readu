import Chapter from "@/types/Chaper";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RecordButtons({ chapter }: { chapter: Chapter }) {
  const [loading, setLoading] = useState(false);
  const [readStatus, setReadStatus] = useState({ yiyi: false, qinyu: false });

  // Fetch reading status on component mount
  useEffect(() => {
    const fetchReadingStatus = async () => {
      try {
        const response = await fetch(
          `https://group-reading.vercel.app/api/record-reading?chapterId=${chapter.id}`,
          { next: { revalidate: 120 } }
        );

        const data = await response.json();

        if (data.readings) {
          const newStatus = {
            yiyi: data.readings.some((r: any) => r.person.S === "yiyi"),
            qinyu: data.readings.some((r: any) => r.person.S === "qinyu"),
          };
          setReadStatus(newStatus);
        }
      } catch (error) {
        console.error("Failed to fetch reading status:", error);
      }
    };

    fetchReadingStatus();
  }, [chapter.id]);

  const recordReading = async (person: "yiyi" | "qinyu") => {
    setLoading(true);

    try {
      const response = await fetch("/api/record-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: chapter.id, person }),
      });

      if (response.ok) {
        setReadStatus((prev) => ({ ...prev, [person]: true }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 flex flex-row items-center justify-between gap-4 text-sm sm:flex-row sm:text-base">
      <div className="flex gap-3">
        <button
          onClick={() => recordReading("yiyi")}
          disabled={loading || readStatus.yiyi}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 transition-all sm:min-w-[100px] ${
            readStatus.yiyi
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
          } ${loading && !readStatus.yiyi ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.yiyi && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          依依
        </button>

        <button
          onClick={() => recordReading("qinyu")}
          disabled={loading || readStatus.qinyu}
          className={`relative min-w-[60px] rounded-lg border px-4 py-2 transition-all sm:min-w-[100px] ${
            readStatus.qinyu
              ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
              : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
          } ${loading && !readStatus.qinyu ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50`}
        >
          {readStatus.qinyu && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              ✓
            </span>
          )}
          沁瑜
        </button>
      </div>

      <Link
        href="/recap"
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        Reading History →
      </Link>
    </div>
  );
}
