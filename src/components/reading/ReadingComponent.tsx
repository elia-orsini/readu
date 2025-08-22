import { useState, useEffect } from "react";
import HighlightButton from "./HighlightButton";
import { isChapterHeading } from "@/utils/isChapterHeading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { highlightText } from "./HighlightedText";
import { useWebsiteStore } from "@/store/useWebsiteStore";
import { ReadingGroup } from "@/types/ReadingGroup";
import Chapter from "@/types/Chapter";
import { Note } from "@/types/Note";

// Fallback UUID generator
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function ReadingComponent({
  currentChapter,
  readingGroup,
}: {
  currentChapter: Chapter;
  readingGroup: ReadingGroup;
}) {
  const [selection, setSelection] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Note[]>([]);
  const [isProcessingHighlight, setIsProcessingHighlight] = useState(false);
  const { currentUser } = useWebsiteStore();

  useEffect(() => {
    const fetchHighlights = async () => {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/highlights?chapterId=${currentChapter.id}`
      );

      if (!highlightsResponse.ok) {
        throw new Error(`HTTP error! status: ${highlightsResponse.status}`);
      }

      const highlightsData = await highlightsResponse.json();

      if (highlightsData.Items) {
        setHighlights(highlightsData.Items || []);
      }
    };

    fetchHighlights();
  }, [currentChapter]);

  useEffect(() => {
    // Add selection change listener for better mobile support
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const handleSelection = () => {
    // Don't process selection changes when we're processing a highlight
    if (isProcessingHighlight) {
      console.log('Skipping selection check - processing highlight');
      return;
    }

    const selection = window.getSelection();
    console.log('=== Selection Check ===');
    console.log('Window selection:', selection?.toString());
    console.log('Current selection state:', selection);
    
    if (selection && selection.toString().trim()) {
      console.log('Setting selection to:', selection.toString());
      setSelection(selection.toString());
      return;
    }

    // Check if popup is open by looking for the backdrop element
    const popupBackdrop = document.querySelector('[style*="z-index: 9999"]');
    console.log('Popup backdrop found:', !!popupBackdrop);

    // Don't clear selection if we have a current selection state and no popup backdrop
    // This prevents clearing selection when highlight button is clicked but popup hasn't appeared yet
    if (!popupBackdrop && selection) {
      console.log('No popup found, but keeping current selection state');
      return;
    }

    if (!popupBackdrop) {
      console.log('No popup found, clearing selection');
      setSelection(null);
    }
  };

  const handleTouchEnd = () => {
    console.log('=== Touch End Event ===');
    // Add a small delay to allow the selection to be established
    setTimeout(() => {
      console.log('Touch end timeout triggered');
      handleSelection();
    }, 100);
  };

  const handleSelectionChange = () => {
    console.log('=== Selection Change Event ===');
    // Listen for selection changes which works better on mobile
    setTimeout(() => {
      console.log('Selection change timeout triggered');
      handleSelection();
    }, 50);
  };

  const handleHighlight = async (color: string, note: string, user: string) => {
    if (!selection) return;

    const highlight = {
      note: note || "",
      chapterId: currentChapter.id,
      highlightId: generateUUID(),
      readingGroupId: readingGroup.id,
      text: selection,
      color,
      userId: user || currentUser || "",
      createdAt: new Date().toISOString(),
    };
    setHighlights([...highlights, highlight]);

    try {
      await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          highlight,
        }),
      });
      setSelection(null);
    } catch (error) {
      console.error("Error saving highlight:", error);
    }
  };

  const applyHighlights = (text: string): string => {
    let highlightedText = text;

    highlights?.forEach((hl: Note) => {
      // Normalize both the highlight text and paragraph text by:
      // 1. Removing extra whitespace
      // 2. Handling different line break formats
      const normalizedHighlight = hl.text.replace(/\s+/g, " ").trim();
      const normalizedParagraph = text.replace(/\s+/g, " ").trim();

      if (normalizedParagraph.includes(normalizedHighlight)) {
        const startIndex = text.indexOf(normalizedHighlight);
        if (startIndex !== -1) {
          const originalHighlightText = text.substr(startIndex, normalizedHighlight.length);
          highlightedText = highlightedText.replace(
            originalHighlightText,
            highlightText(originalHighlightText, hl.color, hl.highlightId)
          );
        }
      } else {
        const lines = hl.text.split("\n");

        if (lines.length > 1) {
          lines.forEach((line) => {
            if (highlightedText.includes(line)) {
              highlightedText = highlightedText.replace(
                line,
                highlightText(line, hl.color, hl.highlightId)
              );
            }
          });
        }
      }
    });

    return highlightedText;
  };

  return (
    <div
      className="prose prose-lg max-w-none text-foreground select-text"
      onMouseUp={handleSelection}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setSelection(null)}
    >
      <HighlightButton
        onHighlight={handleHighlight}
        readingGroupMembers={readingGroup.members}
        selection={selection}
        setSelection={setSelection}
        onProcessingStateChange={setIsProcessingHighlight}
      />

      {currentChapter &&
        currentChapter.content.split("\n\n").map((para: string, i: number) => {
          if (!para.trim()) return null;

          const formattedPara = isChapterHeading(para)
            ? para.replace(/CHAPTER_/, "").toLocaleLowerCase()
            : applyHighlights(para);

          return (
            <div
              key={i}
              className={`text-justify leading-relaxed ${
                isChapterHeading(para)
                  ? "mt-40 flex w-full flex-row border-b border-gray-200 pb-2 text-xl font-bold capitalize text-foreground first:mt-4"
                  : "my-4 opacity-80"
              }`}
            >
              <ReactMarkdown
                components={{
                  a: ({ href, ...props }) => {
                    // Completely skip rendering if it's a citation link
                    if (href?.includes("#part")) return null;
                    return <a href={href} {...props} />;
                  },
                }}
                rehypePlugins={[rehypeRaw]}
              >
                {formattedPara}
              </ReactMarkdown>
              {isChapterHeading(para) && (
                <span className="ml-auto mt-auto text-xs uppercase opacity-40">chapter</span>
              )}
            </div>
          );
        })}
    </div>
  );
}
