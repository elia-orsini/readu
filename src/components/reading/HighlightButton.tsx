"use client";

import { highlightsColours } from "@/constants/constants";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useState } from "react";

export default function HighlightButton({
  onHighlight,
  readingGroupMembers,
  selection,
}: {
  onHighlight: (color: string, note: string, user: string) => Promise<void>;
  readingGroupMembers: string[];
  selection: string | null;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { currentUser, setCurrentUser } = useWebsiteStore();

  const handleHighlightClick = () => {
    window.getSelection()?.removeAllRanges();

    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    const currentUserIndex = readingGroupMembers.indexOf(currentUser);

    if (currentUserIndex === -1) {
      setCurrentUser(null);
      setShowPopup(true);
    } else {
      onHighlight(highlightsColours[currentUserIndex].cssVar, "", currentUser);
    }
  };

  const handleMemberSelect = async (member: string, index: number) => {
    setCurrentUser(member);
    onHighlight(highlightsColours[index].cssVar, "", member);
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <>
          <div
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
          />
          <div className="absolute left-1/2 top-1/2 z-50 flex max-w-md -translate-x-1/2 -translate-y-1/2 transform flex-col gap-4 rounded-lg border border-foreground bg-background px-20 py-10 shadow-xl">
            <p className="text-center text-lg">Who are you?</p>
            <div className="flex flex-col gap-2">
              {readingGroupMembers.map((member, i) => (
                <button
                  key={`${member}_${i}`}
                  className="rounded-sm border border-foreground px-4 py-2"
                  style={{
                    backgroundColor: `var(--${highlightsColours[i].cssVar})`,
                    color: "#000",
                  }}
                  onClick={async () => {
                    await handleMemberSelect(member, i);
                  }}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!showPopup && selection && (
        <button
          onClick={() => {
            handleHighlightClick();
          }}
          className={`fixed bottom-10 z-30 transform rounded border border-foreground bg-black px-4 py-2 text-white sm:left-1/2 sm:-translate-x-1/2`}
        >
          Highlight
        </button>
      )}
    </div>
  );
}
