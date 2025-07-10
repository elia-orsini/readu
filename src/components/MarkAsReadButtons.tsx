"use client";

import useStatusData from "@/hooks/useStatusData";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";

export default function MarkAsReadButtons({
  chapters,
  members,
  readingGroupId,
}: {
  chapters: Chapter[];
  members: string[];
  readingGroupId: string;
}) {
  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const statusData = useStatusData(readingGroupId);
  const { setStatusData } = useWebsiteStore();
  const [chapterMap, setChapterMap] = useState<any>(null);

  useEffect(() => {
    setStatusData([]);
  }, []);

  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const chapter = chapters.find((chapter: any) => chapter.date === today);

      if (chapter) {
        setTodayChapter(chapter);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!statusData) return;

    if (todayChapter) {
      const initialStatus: Record<string, boolean> = {};

      members.forEach((member) => {
        initialStatus[member] =
          statusData.some(
            (item: any) => item.person === member && item.chapterId === todayChapter.id
          ) || false;
      });

      setChapterMap(initialStatus);
    }
  }, [todayChapter, members, statusData]);

  const toggleReadStatus = async (member: string) => {
    setLoadingStates((prev) => ({ ...prev, [member]: true }));

    try {
      const response = await fetch("/api/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: todayChapter?.id,
          person: member,
          readingGroupId: readingGroupId,
        }),
      });

      const { status } = await response.json();

      setChapterMap((prev: any) => ({ ...prev, [member]: status === "read" }));
    } catch (error) {
      console.error("Error toggling read status:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [member]: false }));
    }
  };

  return (
    <div className="rounded-lg">
      <p className="mb-2 mt-4 text-base font-medium text-[var(--foreground)] opacity-60">
        Mark as read:
      </p>
      <div className="flex flex-wrap gap-4">
        {chapterMap &&
          members.map((member) => (
            <button
              key={member}
              onClick={() => toggleReadStatus(member)}
              disabled={loadingStates[member]}
              className={`relative min-w-[80px] rounded-lg border px-4 py-2 transition-all sm:min-w-[100px] ${
                chapterMap[member]
                  ? "border-green-600 bg-green-100 text-green-800 shadow-inner hover:bg-green-200"
                  : "border-foreground bg-background hover:bg-secondary"
              } ${loadingStates[member] ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300`}
            >
              {chapterMap[member] ? (
                <>
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                    ✓
                  </span>
                  {member}
                </>
              ) : (
                member
              )}
            </button>
          ))}
      </div>
    </div>
  );
}
