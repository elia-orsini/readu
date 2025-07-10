"use client";

import { highlightsColours } from "@/constants/constants";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useState } from "react";

export default function HighlightButton({
  onHighlight,
  readingGroupMembers,
}: {
  onHighlight: (color: string, note?: string) => void;
  readingGroupMembers: string[];
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { currentUser, setCurrentUser } = useWebsiteStore();

  const handleHighlightClick = () => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    const currentUserIndex = readingGroupMembers.indexOf(currentUser);
    if (currentUserIndex !== -1) {
      onHighlight(highlightsColours[currentUserIndex].cssVar, "");
    }

    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleMemberSelect = (member: string, index: number) => {
    setCurrentUser(member);

    const currentUserIndex = readingGroupMembers.indexOf(member);
    if (currentUserIndex !== -1) {
      onHighlight(highlightsColours[currentUserIndex].cssVar, "");
    }

    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPopup(false)} // Close when clicking outside
        >
          <div className="m-4 flex max-w-md flex-col gap-4 rounded-lg border border-foreground bg-background p-6 shadow-xl">
            <p className="text-center text-lg">Who are you?</p>
            <div className="flex flex-col gap-2">
              {readingGroupMembers.map((member, i) => (
                <button
                  key={`${member}_${i}`}
                  className="rounded-sm border border-foreground px-4 py-2 hover:bg-gray-300"
                  style={{
                    backgroundColor: `var(--${highlightsColours[i].cssVar})`,
                    color: "#000",
                  }}
                  onClick={() => handleMemberSelect(member, i)}
                  onTouchEnd={() => handleMemberSelect(member, i)}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleHighlightClick}
        className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transform rounded border border-foreground px-4 py-2 text-foreground"
        style={{
          backgroundColor: currentUser
            ? `var(--${highlightsColours[readingGroupMembers.indexOf(currentUser)].cssVar})`
            : `var(--${highlightsColours[0].cssVar})`,
        }}
      >
        Highlight
      </button>
    </div>
  );
}
