"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { Note } from "@/types/Note";

export default function NotesList({ slug }: { slug: string }) {
  const [data, setData] = useState<Note[] | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      const highlightsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/highlights?readingGroupId=${slug}`
      );

      if (!highlightsResponse.ok) {
        throw new Error(`HTTP error! status: ${highlightsResponse.status}`);
      }

      const highlightsData = await highlightsResponse.json();

      if (highlightsData.Items) {
        setData(highlightsData.Items || []);
      }

      setLoading(false);
    };

    fetchHighlights();
  }, []);

  if (isLoading)
    return (
      <div className="mt-6 flex text-sm text-foreground">
        <LoadingSpinner /> Loading...
      </div>
    );

  if (!data) return <p>No profile data</p>;

  return (
    <div className="flex flex-col gap-y-3">
      {data.map((note: Note) => (
        <div
          key={note.highlightId}
          className="bg-thirdiary-foreground rounded border border-foreground p-2 text-sm"
        >
          <p className="text-justify">{note.text.replace(/"/g, "").trim()}</p>
          <p className="mt-4 opacity-70">
            Highlited by <span className="capitalize">{note.userId}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
