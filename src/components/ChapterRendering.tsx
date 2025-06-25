"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";

// Check if paragraph is a chapter heading
const isChapterHeading = (para: string): boolean => {
  const trimmed = para.trim();

  if (!trimmed) return false;

  if (trimmed.startsWith("CHAPTER_")) return true;
  if (trimmed.startsWith("<h2")) return true;

  return false;
};

export default function ChapterRendering({
  chapters,
  readingGroup,
}: {
  chapters: any;
  readingGroup: any;
}) {
  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  console.log(currentChapter?.content.S);

  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString("en-CA");
      const chapter = chapters.Items.find((chapter: any) => chapter.date.S === today);

      if (!chapter) {
        setError("No chapter scheduled for today");
      } else {
        setTodayChapter(chapter);
        setCurrentChapter(chapter);
      }
    } catch (err) {
      setError("Failed to load reading schedule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChapterChange = (id: string) => {
    const chapter = chapters.Items.find((chapter: any) => chapter.id.S === id);
    setCurrentChapter(chapter);
  };

  const returnToToday = () => {
    setCurrentChapter(todayChapter);
  };

  console.log(currentChapter);

  return (
    <div>
      <div className="mt-6">
        <label htmlFor="chapter-select" className="mb-2 block font-medium opacity-60">
          Select Chapter:
        </label>
        <select
          onChange={(e) => handleChapterChange(e.target.value)}
          value={currentChapter?.id.S || ""}
          className="border-[var(--foreground)]/40 focus:border-[var(--foreground)]/60 focus:ring-[var(--foreground)]/60 w-full rounded-lg border bg-[var(--background)] p-2 opacity-80 hover:opacity-60 focus:outline-none focus:ring-2"
        >
          {chapters.Items.map((chapter: any) => (
            <option key={chapter.date.S} value={chapter.id.S}>
              {chapter.date.S}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-4">
        {currentChapter?.id !== todayChapter?.id && (
          <button
            onClick={returnToToday}
            className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-700 transition-all hover:bg-blue-100"
          >
            ← Today&apos;s Chapter
          </button>
        )}
      </div>

      <div className="my-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{readingGroup.bookTitle}</h1>
        <p className="text-[var(--foreground)] opacity-60">{currentChapter?.date?.S}</p>
      </div>

      <div className="prose prose-lg max-w-none text-[var(--foreground)]">
        {currentChapter &&
          currentChapter.content.S.split("\n\n").map((para, i) => {
            if (!para.trim()) return null;

            const formattedPara = isChapterHeading(para)
              ? para.replace(/CHAPTER_/, "").toLocaleLowerCase()
              : para;

            return (
              <div
                key={i}
                className={`leading-relaxed ${
                  isChapterHeading(para)
                    ? "mt-40 flex w-full flex-row border-b border-gray-200 pb-2 text-xl font-bold capitalize text-[var(--foreground)] first:mt-4"
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
    </div>
  );
}
