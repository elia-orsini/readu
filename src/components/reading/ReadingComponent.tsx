import { useState, useEffect } from "react";
import HighlightButton from "./HighlightButton";
import { isChapterHeading } from "@/utils/isChapterHeading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { highlightText } from "./HighlightedText";
import { useWebsiteStore } from "@/store/useWebsiteStore";

export default function ReadingComponent({
  currentChapter,
  readingGroup,
}: {
  currentChapter: any;
  readingGroup: any;
}) {
  const [selection, setSelection] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const { currentUser } = useWebsiteStore();

  useEffect(() => {
    const fetchHighlights = async () => {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/highlights?chapterId=${currentChapter.id.S}`
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

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelection(selection.toString());
      return;
    }

    setSelection("");
  };

  const handleHighlight = async (color: string, note?: string) => {
    if (!selection) return;

    const highlight = {
      chapterId: currentChapter.id.S,
      highlightId: crypto.randomUUID(),
      text: selection,
      color,
      note,
      userId: currentUser,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          highlight,
        }),
      });
      setHighlights([...highlights, highlight]);
      setSelection(null);
    } catch (error) {
      console.error("Error saving highlight:", error);
    }
  };

  const applyHighlights = (text: string): string => {
    let highlightedText = text;

    highlights?.forEach((hl: any) => {
      highlightedText = highlightedText.replace(hl.text, highlightText(hl.text, hl.color, hl.id));
    });

    return highlightedText;
  };

  return (
    <div
      className="prose prose-lg max-w-none text-foreground"
      onMouseUp={handleSelection}
      onTouchEnd={handleSelection}
      onTouchCancel={() => setSelection(null)}
    >
      {selection && (
        <HighlightButton onHighlight={handleHighlight} readingGroupMembers={readingGroup.members} />
      )}

      {currentChapter &&
        currentChapter.content.S.split("\n\n").map((para: string, i: number) => {
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
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{formattedPara}</ReactMarkdown>
              {isChapterHeading(para) && (
                <span className="ml-auto mt-auto text-xs uppercase opacity-40">chapter</span>
              )}
            </div>
          );
        })}
    </div>
  );
}
