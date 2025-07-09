"use client";

import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { format, parseISO } from "date-fns";
import { useScrollPositionPersistence } from "@/hooks/useScrollPositionPersistence";
import ChapterSelection from "./reading/ChapterSelection";
import ReadingComponent from "./reading/ReadingComponent";
import { highlightsColours } from "@/constants/constants";

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
    const chapter = chapters.Items.find((chapter: Chapter) => chapter.id.S === id);
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
          <ChapterSelection
            handleChapterChange={handleChapterChange}
            chapters={chapters.Items}
            currentChapter={currentChapter}
          />

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

          <div className="flex flex-row gap-x-6">
            {readingGroup.members.map((member: string, i: number) => (
              <div className="flex flex-row gap-x-1.5">
                <div
                  className="my-auto h-[15px] w-[15px] rounded-full border border-foreground"
                  style={{ backgroundColor: highlightsColours[i].hex }}
                />
                <p>{member}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 mt-8">
            <h1 className="text-2xl font-bold text-foreground">{readingGroup.bookTitle}</h1>
            <p className="text-foreground opacity-60">
              {format(parseISO(currentChapter?.date?.S || ""), "do MMMM")} -{" "}
              {Math.floor(currentChapter?.estimatedMinutes?.N || 0)} minutes
            </p>
          </div>

          <ReadingComponent currentChapter={currentChapter} readingGroup={readingGroup} />
        </div>
      )}
    </div>
  );
}
