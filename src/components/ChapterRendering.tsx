"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { format, parseISO } from "date-fns";
import { useScrollPositionPersistence } from "@/hooks/useScrollPositionPersistence";

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
  useScrollPositionPersistence();

  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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

  if (error) {
    return <p className="text-red-300">{error}</p>;
  }

  return (
    <div>
      {loading ? (
        <div className="mt-6 flex text-sm text-foreground">
          <LoadingSpinner /> Loading...
        </div>
      ) : (
        <div>
          <div className="mt-8">
            <label htmlFor="chapter-select" className="mb-2 block font-medium opacity-60">
              Select Chapter:
            </label>
            <select
              onChange={(e) => handleChapterChange(e.target.value)}
              value={currentChapter?.id.S || ""}
              className="focus:border-foreground/60 focus:ring-foreground/60 hover:bg-secondary w-full rounded-lg border border-[var(--foreground)] bg-[var(--background)] p-2 opacity-80 focus:outline-none"
            >
              {chapters.Items.map((chapter: any) => (
                <option key={chapter.date.S} value={chapter.id.S}>
                  {chapter.date.S === new Date().toLocaleDateString("en-CA")
                    ? "Today"
                    : format(parseISO(chapter.date.S), "do MMMM")}
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

          <div className="mb-6 mt-8">
            <h1 className="text-2xl font-bold text-foreground">{readingGroup.bookTitle}</h1>
            <p className="text-foreground opacity-60">
              {format(parseISO(currentChapter?.date?.S || ""), "do MMMM")} -{" "}
              {Math.floor(currentChapter?.estimatedMinutes?.N || 0)} minutes
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            {currentChapter &&
              currentChapter.content.S.split("\n\n").map((para, i) => {
                if (!para.trim()) return null;

                const formattedPara = isChapterHeading(para)
                  ? para.replace(/CHAPTER_/, "").toLocaleLowerCase()
                  : para;

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
        </div>
      )}
    </div>
  );
}
