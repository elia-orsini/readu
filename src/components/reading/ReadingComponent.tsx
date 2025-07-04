import { isChapterHeading } from "@/utils/isChapterHeading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function ReadingComponent({ currentChapter }: { currentChapter: any }) {
  return (
    <div className="prose prose-lg max-w-none text-foreground">
      {currentChapter &&
        currentChapter.content.S.split("\n\n").map((para: string, i: number) => {
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
  );
}
