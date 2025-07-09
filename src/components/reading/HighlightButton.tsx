import { highlightsColours } from "@/constants/constants";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useEffect, useState } from "react";

export default function HighlightButton({
  onHighlight,
  readingGroupMembers,
}: {
  onHighlight: (color: string, note?: string) => void;
  readingGroupMembers: string[];
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { currentUser, setCurrentUser } = useWebsiteStore();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      setCurrentUser(currentUser);
    }
  }, [localStorage]);

  function saveCurrentUser(user: string) {
    localStorage.setItem("currentUser", user);
    setCurrentUser(user);
  }

  function handleHighlightClick() {
    if (!currentUser) {
      setShowPopup(true);
    }

    const currentUserIndex = readingGroupMembers.indexOf(currentUser!);

    if (currentUserIndex !== -1) {
      onHighlight(highlightsColours[currentUserIndex].hex, "");
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
                style={{ backgroundColor: highlightsColours[i].hex }}
                onClick={() => {
                  saveCurrentUser(member);
                  onHighlight(highlightsColours[i].hex, "");
                }}
                onTouchEnd={() => {
                  saveCurrentUser(member);
                  onHighlight(highlightsColours[i].hex, "");
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
              ? highlightsColours[readingGroupMembers.indexOf(currentUser)].hex
              : highlightsColours[0].hex,
          }}
        >
          Highlight
        </button>
      )}
    </div>
  );
}
