"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { Note } from "@/types/Note";
import useChaptersData from "@/hooks/useChaptersData";
import Chapter from "@/types/Chapter";

export default function NotesList({ slug }: { slug: string }) {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const chaptersData = useChaptersData(slug);

  useEffect(() => {
    const fetchHighlights = async () => {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/highlights?readingGroupId=${slug}`
      );

      if (!highlightsResponse.ok) {
        throw new Error(`HTTP error! status: ${highlightsResponse.status}`);
      }

      const highlightsData = await highlightsResponse.json();
      setNotes(highlightsData.Items || []);
      setLoading(false);
    };

    fetchHighlights();
  }, [slug]);

  const notesByChapter = notes?.reduce((acc: Record<string, Note[]>, note) => {
    if (!acc[note.chapterId]) {
      acc[note.chapterId] = [];
    }
    acc[note.chapterId].push(note);
    return acc;
  }, {});

  if (isLoading)
    return (
      <div className="mt-6 flex text-sm text-foreground">
        <LoadingSpinner /> Loading...
      </div>
    );

  if (!notes || !chaptersData) return <p className="text-sm">No notes found</p>;

  return (
    <div className="flex flex-col gap-y-6">
      {Object.entries(notesByChapter || {}).map(([chapterId, chapterNotes]) => {
        const chapter = chaptersData.find((c: Chapter) => c.id === chapterId);

        return (
          <div key={chapterId} className="pb-6 last:border-0">
            {chapter && (
              <h3 className="mb-4 text-lg font-bold">{chapter.title || `Chapter ${chapterId}`}</h3>
            )}

            <div className="flex flex-col gap-y-3">
              {chapterNotes.map((note: Note) => (
                <div
                  key={note.highlightId}
                  className="bg-thirdiary-foreground rounded border border-foreground p-2 text-sm"
                >
                  <p className="text-justify">{note.text.replace(/"/g, "").trim()}</p>
                  <p className="mt-4">
                    <span className="opacity-70">Highlighted by </span>
                    <span
                      className="rounded px-1 capitalize"
                      style={{ backgroundColor: `var(--${note.color})` }}
                    >
                      {note.userId}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
