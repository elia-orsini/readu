"use client";

import { format, parseISO } from "date-fns";
import StatusBadge from "./StatusBadge";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function RecapTable({
  chapterData,
  groupData,
  slug,
}: {
  chapterData: any;
  groupData: any;
  slug: string;
}) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/status-data?slug=${slug}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const statusData = await response.json();

        const readingMap = statusData.Items?.reduce((acc: any, reading: any) => {
          const chapterId = reading.chapterId.S;
          const person = reading.person.S;
          acc[chapterId] = acc[chapterId] || {};
          acc[chapterId][person] = true;
          return acc;
        }, {});

        const chaptersMap = chapterData?.Items?.map((chapter: any) => {
          return readingMap?.[chapter.id.S] || {};
        });

        setData(chaptersMap || []);
      } catch (error) {
        console.error("Error fetching chapter readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading)
    return (
      <div className="mt-6 flex text-sm text-foreground">
        <LoadingSpinner /> Loading...
      </div>
    );

  if (!data) return <p>No profile data</p>;

  return (
    <div className="border-foreground overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="bg-secondary flex w-full flex-row p-4 text-sm font-medium text-foreground sm:text-base">
        <div className="min-w-[25vw]">Chapter</div>
      </div>

      {Object.keys(data) &&
        Object.keys(data).map((title: any, i: number) => {
          if (new Date(chapterData.Items[i].date.S).getTime() > Date.now()) {
            return null; // Skip future chapters
          } else {
            return (
              <div
                key={`${title}${Math.random()}`}
                className="border-foreground flex w-full flex-row border-t p-4 text-sm font-medium transition-colors hover:bg-thirdiary sm:text-base"
              >
                <div className="my-auto min-w-[25vw]">{`${format(parseISO(chapterData.Items[i].date.S || ""), "do MMMM")}`}</div>

                <div className={`ml-auto flex flex-row gap-x-4 sm:gap-x-10`}>
                  {groupData?.Items[0]?.members?.L?.map((member: any) => (
                    <div className="flex justify-center" key={`${Math.random()}`}>
                      <StatusBadge read={data[title]?.[member.S]} person={member.S} />
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
