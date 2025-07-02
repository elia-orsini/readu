import { docClient } from "@/dynamo/client";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecapPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  const groupCommand = new QueryCommand({
    TableName: "ReadingGroups",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: slug },
    },
  }) as any;

  const groupData = (await docClient.send(groupCommand)) as any;
  if (!groupData.Items?.length) return notFound();

  const chapterCommand = new QueryCommand({
    TableName: "ReadingChapters",
    IndexName: "readingGroupId-index",
    KeyConditionExpression: "readingGroupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { S: slug },
    },
  }) as any;

  const chapterData = (await docClient.send(chapterCommand)) as any;

  const statusCommand = new QueryCommand({
    TableName: "ChapterReadings",
    IndexName: "ReadingGroupIndex",
    KeyConditionExpression: "readingGroupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { S: slug },
    },
  }) as any;

  const statusData = (await docClient.send(statusCommand)) as any;

  const readingMap = statusData?.Items.reduce((acc: any, reading: any) => {
    const chapterId = reading.chapterId.S;
    const person = reading.person.S;
    acc[chapterId] = acc[chapterId] || {};
    acc[chapterId][person] = true;
    return acc;
  }, {});

  const chaptersMap = chapterData?.Items.map((chapter: any) => {
    const readers = readingMap[chapter.id.S] || {};

    return readers;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800 sm:text-3xl">Reading History</h1>
          <Link
            href={`/reading/${slug}`}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-1 py-2 text-xs text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:px-4 sm:text-base sm:text-sm"
          >
            ← Back to Reading
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {/* Table Header */}
          <div className="flex w-full flex-row bg-gray-100 p-4 text-sm font-medium text-gray-700 sm:text-base">
            <div className="min-w-[25vw]">Chapter</div>
          </div>

          {/* Table Rows */}
          {Object.keys(chaptersMap) &&
            Object.keys(chaptersMap).map((title: any, i: number) => {
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
                          <StatusBadge read={chaptersMap?.[title]?.[member.S]} person={member.S} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ read, person }: { read: boolean; person: string }) {
  return (
    <button
      className={`relative min-w-[30px] rounded-lg border px-2 py-1 text-sm transition-all hover:cursor-default sm:min-w-[60px] sm:px-4 sm:py-2 ${
        read
          ? "border-green-300 bg-green-100 text-green-800 shadow-inner"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      }`}
      disabled={read}
    >
      {read && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
          ✓
        </span>
      )}
      <span className="text-sm">{person}</span>
    </button>
  );
}
