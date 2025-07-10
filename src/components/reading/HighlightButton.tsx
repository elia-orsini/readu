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

  function saveCurrentUser(user: string) {
    setCurrentUser(user);
  }

  function handleHighlightClick() {
    if (!currentUser) {
      setShowPopup(true);
    }

    const currentUserIndex = readingGroupMembers.indexOf(currentUser!);

    if (currentUserIndex !== -1) {
      onHighlight(highlightsColours[currentUserIndex].cssVar, "");
    }

    setCurrentUser(null);
    setShowPopup(true);

    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }

  return (
    <div>
      {showPopup && !currentUser && (
        <div className="fixed inset-x-0 inset-y-0 z-50 m-auto flex h-max w-max flex-col gap-2 rounded-lg border border-foreground bg-background px-20 py-10 shadow-xl">
          <p className="text-center text-lg">Who are you?</p>
          <div className="flex flex-col gap-y-2">
            {readingGroupMembers.map((member, i) => (
              <button
                key={member}
                className="rounded-sm border border-foreground px-4 py-2 hover:bg-gray-300"
                style={{ backgroundColor: `var(--${highlightsColours[i].cssVar})` }}
                onClick={() => {
                  saveCurrentUser(member);
                  onHighlight(highlightsColours[i].cssVar, "");
                }}
                onTouchEnd={() => {
                  saveCurrentUser(member);
                  onHighlight(highlightsColours[i].cssVar, "");
                }}
              >
                {member}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showPopup && (
        <button
          onClick={handleHighlightClick}
          onTouchEnd={handleHighlightClick}
          className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transform rounded border border-foreground px-4 py-2 text-foreground"
          style={{
            backgroundColor: currentUser
              ? `var(--${highlightsColours[readingGroupMembers.indexOf(currentUser)].cssVar})`
              : `var(--${highlightsColours[0].cssVar})`,
          }}
        >
          Highlight
        </button>
      )}
    </div>
  );
}
