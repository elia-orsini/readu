import ChapterRendering from "@/components/ChapterRendering";
import MarkAsReadButtons from "@/components/MarkAsReadButtons";
import { docClient } from "@/dynamo/client";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ReadingGroup {
  id: string;
  members: string[];
  bookTitle: string;
}

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  try {
    const groupCommand = new QueryCommand({
      TableName: "ReadingGroups",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": { S: slug },
      },
    }) as any;

    const groupData = (await docClient.send(groupCommand)) as any;
    if (!groupData.Items?.length) return notFound();

    const readingGroup: ReadingGroup = {
      id: groupData.Items[0].id.S!,
      members: groupData.Items[0].members.L.map((obj: any) => obj.S) || [],
      bookTitle: groupData.Items[0].bookTitle.S!,
    };

    // 2. Fetch today's chapter
    const chapterCommand = new QueryCommand({
      TableName: "ReadingChapters",
      IndexName: "readingGroupId-index",
      KeyConditionExpression: "readingGroupId = :groupId",
      ExpressionAttributeValues: {
        ":groupId": { S: slug },
      },
    }) as any;

    const chapterData = (await docClient.send(chapterCommand)) as any;

    if (!chapterData.Items?.length) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-600">
            No reading scheduled for today
          </div>
        </div>
      );
    }

    const statusCommand = new QueryCommand({
      TableName: "ChapterReadings",
      IndexName: "ReadingGroupIndex",
      KeyConditionExpression: "readingGroupId = :groupId",
      ExpressionAttributeValues: {
        ":groupId": { S: slug },
      },
    }) as any;

    const statusData = (await docClient.send(statusCommand)) as any;

    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[var(--background)] p-4 shadow-sm">
          <div className="flex items-center">
            <Link
              href={`/recap/${slug}`}
              className="ml-auto flex items-center rounded-lg border border-gray-300 bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-all hover:opacity-60 focus:outline-none focus:ring-gray-300 sm:text-base"
            >
              Recap
            </Link>
          </div>

          <MarkAsReadButtons
            chapters={chapterData}
            members={readingGroup.members}
            readingGroupId={readingGroup.id}
            statusData={statusData}
          />

          <ChapterRendering chapters={chapterData} readingGroup={readingGroup} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching reading data:", error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
          Failed to load reading data
        </div>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  const groupCommand = new QueryCommand({
    TableName: "ReadingGroups",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: slug },
    },
  }) as any;

  const groupData = (await docClient.send(groupCommand)) as any;

  if (!groupData.Items?.length) {
    return {
      title: `${groupData.Items[0].bookTitle.S!} | Readu`,
    };
  }

  return {
    title: `${groupData.Items[0].bookTitle.S!} | Readu`,
  };
}
