"use client";

import { useState } from "react";

export default function MarkAsReadButtons({
  chapterId,
  members,
  initialStatus,
}: {
  chapterId: string;
  members: string[];
  initialStatus: Record<string, boolean>;
}) {
  const [readStatus, setReadStatus] = useState(initialStatus);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleReadStatus = async (member: string) => {
    setLoadingStates((prev) => ({ ...prev, [member]: true }));

    try {
      const response = await fetch("/api/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId,
          person: member,
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
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-medium text-[var(--foreground)]">Mark as read/unread:</h3>
      <div className="flex flex-wrap gap-3">
        {members.map((member) => (
          <button
            key={member}
            onClick={() => toggleReadStatus(member)}
            disabled={loadingStates[member]}
            className={`relative min-w-[100px] rounded-lg border px-4 py-2 transition-all ${
              readStatus[member]
                ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
                : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
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
