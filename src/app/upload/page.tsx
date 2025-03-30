"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
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
        setSelectedChapters(new Set(chapters.map((c: any) => c.id)));
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

  const createReadingPlan = async () => {
    setLoading(true);
    const readingGroupId = crypto.randomUUID();
    const filteredChapters = chapters.filter((c) => selectedChapters.has(c.id));

    // Assign dates starting from today
    const datedChapters = filteredChapters.map((chapter, i) => ({
      ...chapter,
      id: crypto.randomUUID(),
      readingGroupId,
      date: new Date(Date.now() + i * 86400000).toISOString().split("T")[0],
    }));

    try {
      // Create reading group
      await fetch("/api/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: readingGroupId,
          members: members.filter((m) => m.trim()),
          bookTitle: title,
        }),
      });

      // Upload chapters
      await fetch("/api/upload-chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapters: datedChapters,
          readingGroupId,
        }),
      });

      router.push(`/reading/${readingGroupId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Create Reading Plan</h1>

      <div className="mb-6">
        <label className="mb-2 block font-medium">Upload EPUB File</label>
        <input
          type="file"
          accept=".epub"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
          disabled={loading}
        />
      </div>

      {title && (
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">{title}</h2>

          <div className="mb-4">
            <label className="mb-2 block font-medium">Reading Members</label>
            {members.map((member, i) => (
              <div key={i} className="mb-2 flex">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(i, e.target.value)}
                  className="input input-bordered flex-grow"
                  placeholder="Member name"
                />
                {i === members.length - 1 && (
                  <button onClick={addMember} className="btn btn-ghost ml-2">
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <h3 className="mb-2 font-medium">Select Chapters</h3>
          <div className="max-h-96 overflow-y-auto rounded-lg border">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="border-b p-2">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={selectedChapters.has(chapter.id)}
                    onChange={() => toggleChapter(chapter.id)}
                    className="checkbox mr-2"
                  />
                  <span>
                    {/* Ensure we're rendering strings, not objects */}
                    {typeof chapter.title === "string"
                      ? chapter.title
                      : JSON.stringify(chapter.title)}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {chapters.length > 0 && (
        <button onClick={createReadingPlan} disabled={loading} className="btn btn-primary">
          {loading ? "Creating..." : "Create Reading Plan"}
        </button>
      )}
    </div>
  );
}
