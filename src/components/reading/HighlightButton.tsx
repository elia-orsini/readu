"use client";

import { highlightsColours } from "@/constants/constants";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useState, useEffect } from "react";

export default function HighlightButton({
  onHighlight,
  readingGroupMembers,
  selection,
  setSelection,
  onProcessingStateChange,
}: {
  onHighlight: (color: string, note: string, user: string) => Promise<void>;
  readingGroupMembers: string[];
  selection: string | null;
  setSelection: any;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [isProcessingHighlight, setIsProcessingHighlight] = useState(false);
  const { currentUser, setCurrentUser } = useWebsiteStore();

  // Prevent body scrolling when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPopup]);

  // Notify parent when processing state changes
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessingHighlight);
    }
  }, [isProcessingHighlight, onProcessingStateChange]);

  const handleHighlightClick = () => {
    // Set processing flag to prevent selection clearing
    setIsProcessingHighlight(true);

    // Don't clear selection immediately - only clear it after we've processed the highlight
    if (!currentUser) {
      setShowPopup(true);
      setIsProcessingHighlight(false);
      return;
    }

    const currentUserIndex = readingGroupMembers.indexOf(currentUser);

    if (currentUserIndex === -1) {
      setCurrentUser(null);
      setShowPopup(true);
      setIsProcessingHighlight(false);
    } else {
      window.getSelection()?.removeAllRanges();
      onHighlight(highlightsColours[currentUserIndex].cssVar, "", currentUser);
      setIsProcessingHighlight(false);
    }
  };

  const handleMemberSelect = async (member: string, index: number) => {
    setCurrentUser(member);
    window.getSelection()?.removeAllRanges();
    onHighlight(highlightsColours[index].cssVar, "", member);
    setShowPopup(false);
    setIsProcessingHighlight(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    setShowPopup(false);
    setSelection(null);
    setIsProcessingHighlight(false);
  };

  return (
    <div>
      {showPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9999] bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          />
          
          {/* Modal */}
          <div 
            className="fixed z-[10000] flex flex-col gap-4 rounded-lg border border-foreground bg-background px-6 py-8 shadow-xl sm:px-24 sm:py-14"
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              width: '90vw',
              maxWidth: '400px',
              maxHeight: '80vh',
              overflowY: 'auto',
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground)',
              borderRadius: '8px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="flex items-center justify-between">
              <p className="w-full text-center text-lg font-semibold">Who are you?</p>
              <button
                onClick={handleBackdropClick}
                className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-700 sm:right-6 sm:top-6"
                style={{ fontSize: '24px', fontWeight: 'bold' }}
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {readingGroupMembers.map((member, i) => (
                <button
                  key={`${member}_${i}`}
                  className="rounded-sm border border-foreground px-4 py-3 text-base font-medium sm:py-2"
                  style={{
                    backgroundColor: `var(--${highlightsColours[i].cssVar})`,
                    color: "#000",
                    minHeight: '44px',
                    border: '1px solid var(--foreground)',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    fontWeight: '500'
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
          onClick={handleHighlightClick}
          className={`fixed bottom-10 left-1/2 z-50 transform -translate-x-1/2 rounded border border-foreground bg-black px-4 py-2 text-white shadow-lg sm:px-4 sm:py-2`}
          style={{ minHeight: '44px' }}
        >
          Highlight
        </button>
      )}
    </div>
  );
}
