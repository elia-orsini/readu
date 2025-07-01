"use client";

import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";

export default function MarkAsReadButtons({
  chapters,
  members,
  readingGroupId,
  statusData,
}: {
  chapters: any;
  members: string[];
  readingGroupId: string;
  statusData: any;
}) {
  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [readStatus, setReadStatus] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const chapter = chapters.Items.find((chapter: any) => chapter.date.S === today);

      if (chapter) {
        setTodayChapter(chapter);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (todayChapter) {
      const initialStatus: Record<string, boolean> = {};

      members.forEach((member) => {
        initialStatus[member] =
          statusData.Items?.some(
            (item: any) => item.person.S === member && item.chapterId.S === todayChapter.id.S
          ) || false;
      });

      setReadStatus(initialStatus);
    }
  }, [todayChapter, members, statusData]);

  const toggleReadStatus = async (member: string) => {
    setLoadingStates((prev) => ({ ...prev, [member]: true }));

    try {
      const response = await fetch("/api/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: todayChapter?.id.S,
          person: member,
          readingGroupId: readingGroupId,
        }),
      });

      const { status } = await response.json();

      setReadStatus((prev) => ({ ...prev, [member]: status === "read" }));
    } catch (error) {
      console.error("Error toggling read status:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [member]: false }));
    }
  };

  return (
    <div className="rounded-lg">
      <h3 className="mb-2 text-base font-medium text-[var(--foreground)] opacity-60">
        Mark as read:
      </h3>
      <div className="flex flex-wrap gap-4">
        {members.map((member) => (
          <button
            key={member}
            onClick={() => toggleReadStatus(member)}
            disabled={loadingStates[member]}
            className={`relative min-w-[80px] sm:min-w-[100px] rounded-lg border px-4 py-2 transition-all ${
              readStatus[member]
                ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
                : "border-gray-300 bg-[var(--background)] hover:border-gray-400 hover:bg-gray-50"
            } ${loadingStates[member] ? "opacity-70" : ""} focus:outline-none focus:ring-2 focus:ring-green-300`}
          >
            {readStatus[member] ? (
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
