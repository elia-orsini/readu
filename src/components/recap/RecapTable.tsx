"use client";

import { format, parseISO } from "date-fns";
import StatusBadge from "./StatusBadge";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import useChaptersData from "@/hooks/useChaptersData";
import Chapter from "@/types/Chapter";
import useStatusData from "@/hooks/useStatusData";
import useGroupData from "@/hooks/useGroupData";
import { Status } from "@/types/Status";

export default function RecapTable({ slug }: { slug: string }) {
  const [chaptersPeopleMap, setChaptersPeopleMap] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  const allChapters = useChaptersData(slug);
  const statusData = useStatusData(slug);
  const groupData = useGroupData(slug);

  useEffect(() => {
    if (!statusData.length || !allChapters.length || !groupData) {
      setLoading(false);
      return;
    }

    const readingMap = statusData.reduce((acc: any, reading: Status) => {
      const chapterId = reading.chapterId;
      const person = reading.person;
      acc[chapterId] = acc[chapterId] || {};
      acc[chapterId][person] = true;
      return acc;
    }, {});

    const chaptersMap = allChapters.map((chapter: Chapter) => {
      return readingMap?.[chapter.id] || {};
    });

    setChaptersPeopleMap(chaptersMap || []);
    setLoading(false);
  }, [statusData, allChapters, groupData]);

  if (isLoading)
    return (
      <div className="mt-6 flex text-sm text-foreground">
        <LoadingSpinner /> Loading...
      </div>
    );

  if (!chaptersPeopleMap) return <p>No Reading Data (yet)</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-foreground bg-background shadow-sm">
      <div className="flex w-full flex-row bg-secondary p-4 text-sm font-medium text-foreground sm:text-base">
        <div className="min-w-[25vw]">Chapter</div>
      </div>

      {Object.keys(chaptersPeopleMap) &&
        Object.keys(chaptersPeopleMap).map((title: any, i: number) => {
          if (new Date(allChapters[i].date).getTime() > Date.now()) {
            return null; // Skip future chapters
          } else {
            return (
              <div
                key={`${title}${Math.random()}`}
                className="flex w-full flex-row border-t border-foreground p-4 text-sm font-medium transition-colors hover:bg-thirdiary sm:text-base"
              >
                <div className="my-auto w-full mr-3 text-nowrap sm:min-w-[25vw]">{`${format(parseISO(allChapters[i].date || ""), "do MMMM")}`}</div>

                <div className={`ml-auto flex flex-row gap-x-2 sm:gap-x-10`}>
                  {groupData &&
                    groupData.members.map((member: string) => (
                      <div className="flex justify-center" key={`${Math.random()}`}>
                        <StatusBadge read={chaptersPeopleMap[title]?.[member]} person={member} />
                      </div>
                    ))}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
}
