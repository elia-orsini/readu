import Chapter from "@/types/Chapter";
import { format, parseISO } from "date-fns";

export default function ChapterSelection({
  handleChapterChange,
  chapters,
  currentChapter,
}: {
  handleChapterChange: (id: string) => void;
  chapters: Chapter[];
  currentChapter: Chapter | null;
}) {
  return (
    <div className="mt-8">
      <label htmlFor="chapter-select" className="mb-2 block font-medium opacity-60">
        Select Chapter:
      </label>
      <select
        onChange={(e) => handleChapterChange(e.target.value)}
        value={currentChapter?.id || ""}
        className="focus:border-foreground/60 focus:ring-foreground/60 w-full rounded-lg border border-[var(--foreground)] bg-[var(--background)] p-2 opacity-80 hover:bg-secondary focus:outline-none"
      >
        {chapters.map((chapter: any) => (
          <option key={chapter.date} value={chapter.id}>
            {chapter.date === new Date().toLocaleDateString("en-CA")
              ? "Today"
              : format(parseISO(chapter.date), "do MMMM")}
          </option>
        ))}
      </select>
    </div>
  );
}
