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
      <div className="mt-6 flex text-sm text-gray-500">
        <LoadingSpinner /> Loading...
      </div>
    );

  if (!data) return <p>No profile data</p>;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex w-full flex-row bg-gray-100 p-4 text-sm font-medium text-gray-700 sm:text-base">
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
                className="flex w-full flex-row border-b border-gray-100 p-4 text-sm font-medium transition-colors hover:bg-gray-50 sm:text-base"
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
