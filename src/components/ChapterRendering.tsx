"use client";

import Chapter from "@/types/Chapter";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { format, parseISO } from "date-fns";
import { useScrollPositionPersistence } from "@/hooks/useScrollPositionPersistence";
import ChapterSelection from "./reading/ChapterSelection";
import ReadingComponent from "./reading/ReadingComponent";
import { highlightsColours } from "@/constants/constants";
import MarkAsReadButtons from "./MarkAsReadButtons";
import useChaptersData from "@/hooks/useChaptersData";
import useGroupData from "@/hooks/useGroupData";
import EndMessage from "./reading/EndMessage";

export default function ChapterRendering({ slug }: { slug: string }) {
  useScrollPositionPersistence();

  const allChapters = useChaptersData(slug);
  const readingGroup = useGroupData(slug);

  const [todayChapter, setTodayChapter] = useState<Chapter | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!allChapters.length || !readingGroup) return;

    const today = new Date().toLocaleDateString("en-CA");
    const chapter = allChapters.find((chapter: any) => chapter.date === today);

    if (!chapter) {
      setTodayChapter(null);
      setCurrentChapter(null);
    } else {
      setTodayChapter(chapter);
      setCurrentChapter(chapter);
    }

    setLoading(false);
  }, [allChapters]);

  const handleChapterChange = (id: string) => {
    const chapter = allChapters.find((chapter: Chapter) => chapter.id === id);
    setCurrentChapter(chapter || null);
  };

  const returnToToday = () => {
    setCurrentChapter(todayChapter);
  };

  // if (error) {
  //   return <p className="text-red-300">{error}</p>;
  // }

  return (
    <div>
      {loading ? (
        <div className="mt-6 flex text-sm text-foreground">
          <LoadingSpinner /> Loading...
        </div>
      ) : (
        <div>
          <MarkAsReadButtons
            chapters={allChapters}
            members={readingGroup!.members}
            readingGroupId={readingGroup!.id}
          />

          <ChapterSelection
            handleChapterChange={handleChapterChange}
            chapters={allChapters}
            currentChapter={currentChapter}
          />

          <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-4">
            {currentChapter?.id !== todayChapter?.id && todayChapter && (
              <button
                onClick={returnToToday}
                className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-700 transition-all hover:bg-blue-100"
              >
                ← Today&apos;s Chapter
              </button>
            )}
          </div>

          {currentChapter && readingGroup && (
            <div className="flex flex-row gap-x-6">
              {readingGroup!.members.map((member: string, i: number) => (
                <div key={`${member}_${i}`} className="flex flex-row gap-x-1.5">
                  <div
                    className="my-auto h-[15px] w-[15px] rounded-full border border-foreground"
                    style={{ backgroundColor: `var(--${highlightsColours[i].cssVar})` }}
                  />
                  <p>{member}</p>
                </div>
              ))}
            </div>
          )}

          {currentChapter && readingGroup && (
            <div className="mb-6 mt-8">
              <h1 className="text-2xl font-bold text-foreground">{readingGroup.bookTitle}</h1>
              <p className="text-foreground opacity-60">
                {format(parseISO(currentChapter?.date || ""), "do MMMM")} -{" "}
                {Math.floor(currentChapter?.estimatedMinutes || 0)} minutes
              </p>
            </div>
          )}

          {!currentChapter && (
            <p className="mt-10 text-foreground opacity-60">
              No chapter found for today.
              <br />
              <br />
              You can still select a chapter from the dropdown above.
            </p>
          )}

          {currentChapter && readingGroup && (
            <ReadingComponent currentChapter={currentChapter} readingGroup={readingGroup} />
          )}

          {currentChapter && readingGroup && <EndMessage />}
        </div>
      )}
    </div>
  );
}
