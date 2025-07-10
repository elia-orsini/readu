"use client";

import { format, parseISO } from "date-fns";
import StatusBadge from "./StatusBadge";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

export default function RecapTable({ slug }: { slug: string }) {
  const [data, setData] = useState(null);
  const [groupData, setGroupData] = useState<any | null>(null);
  const [chaptersData, setChaptersData] = useState<any | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // get reading group
        const readingGroupResponse = await fetch(`/api/reading-group?slug=${slug}`);
        if (!readingGroupResponse.ok) {
          throw new Error(`HTTP error! status: ${readingGroupResponse.status}`);
        }
        const readingGroupData = await readingGroupResponse.json();
        setGroupData(readingGroupData);

        // get chapters
        const chaptersResponse = await fetch(`/api/chapters?slug=${slug}`);
        if (!chaptersResponse.ok) {
          throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
        }
        const cData = await chaptersResponse.json();
        setChaptersData(cData.Items);

        // get status data
        const response = await fetch(`/api/status-data?slug=${slug}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const statusData = await response.json();

        // map data
        const readingMap = statusData.Items?.reduce((acc: any, reading: any) => {
          const chapterId = reading.chapterId.S;
          const person = reading.person.S;
          acc[chapterId] = acc[chapterId] || {};
          acc[chapterId][person] = true;
          return acc;
        }, {});

        const chaptersMap = cData.Items.map((chapter: any) => {
          return readingMap?.[chapter.id] || {};
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
    <div className="overflow-hidden rounded-xl border border-foreground bg-background shadow-sm">
      <div className="flex w-full flex-row bg-secondary p-4 text-sm font-medium text-foreground sm:text-base">
        <div className="min-w-[25vw]">Chapter</div>
      </div>

      {Object.keys(data) &&
        Object.keys(data).map((title: any, i: number) => {
          if (new Date(chaptersData[i].date).getTime() > Date.now()) {
            return null; // Skip future chapters
          } else {
            return (
              <div
                key={`${title}${Math.random()}`}
                className="flex w-full flex-row border-t border-foreground p-4 text-sm font-medium transition-colors hover:bg-thirdiary sm:text-base"
              >
                <div className="my-auto min-w-[25vw]">{`${format(parseISO(chaptersData[i].date || ""), "do MMMM")}`}</div>

                <div className={`ml-auto flex flex-row gap-x-4 sm:gap-x-10`}>
                  {groupData &&
                    groupData.members.map((member: string) => (
                      <div className="flex justify-center" key={`${Math.random()}`}>
                        <StatusBadge read={data[title]?.[member]} person={member} />
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
