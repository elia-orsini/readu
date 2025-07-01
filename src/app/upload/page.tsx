"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UploadComponent from "@/components/file-upload/UploadComponent";

interface Chapter {
  id: string;
  title: string;
  content: string;
  length: number; // in characters
}

interface ReadingSegment {
  id: string;
  title: string;
  content: string;
  date: string;
  chapterTitles: string[];
  estimatedMinutes: number;
}

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [charsPerMinute, setCharsPerMinute] = useState<number>(1000); // Average reading speed
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLoading(true);
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/process-epub", {
          method: "POST",
          body: formData,
        });
        const { title, chapters } = await response.json();
        setTitle(title);
        setChapters(chapters);
        setSelectedChapters(new Set(chapters.map((c: Chapter) => c.id)));
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleChapter = (id: string) => {
    const newSelected = new Set(selectedChapters);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedChapters(newSelected);
  };

  const addMember = () => setMembers([...members, ""]);
  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const createSegments = (): ReadingSegment[] => {
    if (!chapters.length) return [];

    const filteredChapters = chapters
      .filter((c) => selectedChapters.has(c.id))
      .map((c) => ({
        ...c,
        paragraphs: c.content
          .replace(/\[\]\(null\)[\s\n]*/g, "")
          .replace(/\[\]\(null\)/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\[.*?\]/g, "")
          .split("\n\n")
          .filter((p) => p.trim().length > 0),
        estimatedMinutes: Math.ceil(c.length / charsPerMinute),
      }));

    if (!filteredChapters.length) return [];

    const segments: ReadingSegment[] = [];
    let currentDay = 0;
    let currentSegment: ReadingSegment | null = null;

    for (const chapter of filteredChapters) {
      const chapterMinutes = Math.ceil(chapter.content.length / charsPerMinute);

      // Case 1: Chapter fits completely in remaining daily time
      if (currentSegment && currentSegment.estimatedMinutes + chapterMinutes <= dailyMinutes) {
        // Add to current segment
        currentSegment.content += "\n\n" + chapter.content;
        currentSegment.estimatedMinutes += chapterMinutes;
        currentSegment.chapterTitles.push(chapter.title);
      }
      // Case 2: Chapter is too big and needs its own segment(s)
      else {
        // Push current segment if exists
        if (currentSegment) {
          segments.push(currentSegment);
          currentDay++;
        }

        // Create new segment for this chapter
        currentSegment = {
          id: `${chapter.id}`,
          title: `Day ${currentDay + 1}`,
          content: chapter.content,
          date: new Date(Date.now() + currentDay * 86400000).toISOString().split("T")[0],
          chapterTitles: [chapter.title],
          estimatedMinutes: chapterMinutes,
        };

        // If chapter is very long, split at natural breaks
        if (chapterMinutes > dailyMinutes) {
          // Split into paragraphs but keep headings with their content
          const paragraphs = chapter.content.split(/\n\s*\n/);
          let currentContent = "";
          let currentEstimate = 0;

          for (let i = 0; i < paragraphs.length; i++) {
            const para = paragraphs[i];
            const paraMinutes = para.length / charsPerMinute;

            // If adding this paragraph would exceed daily limit, push current segment
            if (currentContent && currentEstimate + Math.ceil(paraMinutes) > dailyMinutes) {
              if (currentEstimate > dailyMinutes * 0.2) {
                segments.push({
                  ...currentSegment,
                  content: currentContent,
                  estimatedMinutes: currentEstimate,
                });
                currentDay++;
                currentContent = "";
                currentEstimate = 0;
              }
            }

            // Add paragraph to current content
            currentContent += (currentContent ? "\n\n" : "") + para;
            currentEstimate += paraMinutes;
          }

          // Handle remaining content
          if (currentContent) {
            // If remaining content is small (<20% of daily time) and there are more chapters,
            // don't create a separate segment - carry over to next chapter
            const isSmallRemainder = currentEstimate < dailyMinutes * 0.2;
            const hasMoreChapters = filteredChapters.indexOf(chapter) < filteredChapters.length - 1;

            if (isSmallRemainder && hasMoreChapters) {
              // Carry over to next segment
              currentSegment = {
                id: `${chapter.id}-remainder`,
                title: `Day ${currentDay + 1}`,
                content: currentContent,
                date: new Date(Date.now() + currentDay * 86400000).toISOString().split("T")[0],
                chapterTitles: [...currentSegment.chapterTitles],
                estimatedMinutes: currentEstimate,
              };
            } else {
              // Push remaining content as its own segment
              segments.push({
                ...currentSegment,
                content: currentContent,
                estimatedMinutes: currentEstimate,
              });
              currentDay++;
              currentSegment = null;
            }
          }
        }
      }
    }

    // Push the last segment if it exists
    if (currentSegment) {
      segments.push(currentSegment);
    }

    // Finalize with consecutive day numbers and dates
    return segments.map((segment, index) => ({
      ...segment,
      id: `day-${index + 1}-${segment.id}`,
      title: `Day ${index + 1}`,
      date: new Date(Date.now() + index * 86400000).toISOString().split("T")[0],
    }));
  };

  const createReadingPlan = async () => {
    setLoading(true);

    if (members.length === 0 || members.every((m) => m.trim() === "")) {
      setError("Please add at least one member to the reading group.");
      setLoading(false);
      return;
    }

    if (Array.from(selectedChapters).length === 0) {
      setError("Please select at least one chapter to read.");
      setLoading(false);
      return;
    }

    const readingGroupId = crypto.randomUUID();
    const segments = createSegments();

    try {
      // Create reading group
      await fetch("/api/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: readingGroupId,
          members: members.filter((m) => m !== "" && m.trim()),
          bookTitle: title,
          dailyMinutes,
        }),
      });

      // Upload segments
      await fetch("/api/upload-segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segments,
          readingGroupId,
        }),
      });

      router.push(`/reading/${readingGroupId}`);
    } finally {
      setError("");
      setLoading(false);
    }
  };

  // Preview the reading plan
  const [previewSegments, setPreviewSegments] = useState<ReadingSegment[]>([]);
  useEffect(() => {
    setPreviewSegments(createSegments());
  }, [chapters, selectedChapters, dailyMinutes, charsPerMinute]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Start a new book</h1>

          <UploadComponent handleFileChange={handleFileChange} loading={loading} />

          {title && (
            <div className="space-y-8">
              {/* Book Title */}
              <div className="rounded-lg bg-blue-50 p-4">
                {/* <h2 className="text-xl font-semibold text-gray-900">{title}</h2> */}
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-blue-50 text-xl font-semibold text-gray-900 focus:outline-none"
                  placeholder="Book Title"
                />
              </div>

              {/* Reading Settings */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-700">Reading Settings</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="dailyMinutes"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Minutes per day
                    </label>
                    <input
                      type="number"
                      id="dailyMinutes"
                      min="10"
                      max="240"
                      value={dailyMinutes}
                      onChange={(e) => setDailyMinutes(parseInt(e.target.value) || 30)}
                      className="block w-full rounded-md border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="charsPerMinute"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Reading speed (chars/min)
                    </label>
                    <input
                      type="number"
                      id="charsPerMinute"
                      min="100"
                      max="500"
                      value={charsPerMinute}
                      onChange={(e) => setCharsPerMinute(parseInt(e.target.value) || 200)}
                      className="block w-full rounded-md border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="text-sm text-gray-500">
                    Estimated reading time:{" "}
                    {Math.ceil((previewSegments.length * dailyMinutes) / 60)} hours total
                  </div>

                  <div className="hidden text-sm text-gray-500 sm:block">
                    1000 chars/min is the average speed. Don&apos;t change it if you are not sure!
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-700">Reading Members</h3>
                <div className="space-y-3">
                  {members.map((member, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateMember(i, e.target.value)}
                        className="block w-40 rounded-md border-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Member name"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addMember}
                    className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-xs text-white opacity-60 shadow-sm hover:bg-gray-800 focus:outline-none"
                  >
                    add member +
                  </button>
                </div>
              </div>

              {/* Chapters Selection */}
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-700">Select chapters to read</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <ul className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
                    {chapters.map((chapter) => (
                      <li key={chapter.id} className="px-4 py-3 hover:bg-gray-50">
                        <label className="flex cursor-pointer items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedChapters.has(chapter.id)}
                            onChange={() => toggleChapter(chapter.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="block text-sm text-gray-700">
                            {chapter.title} (~{Math.ceil(chapter.content.length / charsPerMinute)}{" "}
                            min)
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reading Plan Preview */}
              {previewSegments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-700">Reading Plan Preview</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <ul className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
                      {previewSegments.map((segment, index) => (
                        <li key={segment.id} className={`px-4 py-3 hover:bg-gray-50`}>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 pt-1">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                                {index + 1}
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{segment.title}</p>
                              <p className="text-xs text-gray-500">
                                {segment.date} • ~
                                {Math.ceil(segment.content.length / charsPerMinute)} min
                              </p>

                              {segment.chapterTitles.length ? (
                                <div className="mt-2 text-xs font-semibold text-blue-600">
                                  {segment.chapterTitles.join(", ")}
                                </div>
                              ) : (
                                <div className="mt-2 text-xs font-semibold text-gray-500">
                                  No new chapters
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={createReadingPlan}
                  disabled={loading || previewSegments.length === 0}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto sm:text-sm"
                >
                  {loading ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Reading Plan"
                  )}
                </button>
              </div>

              {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
