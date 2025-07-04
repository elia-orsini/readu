import Header from "@/components/header/Header";
import RecapTable from "@/components/recap/RecapTable";
import { docClient } from "@/dynamo/client";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RecapPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  // Reading Group Data
  const groupCommand = new QueryCommand({
    TableName: "ReadingGroups",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": { S: slug },
    },
  }) as any;
  const groupData = (await docClient.send(groupCommand)) as any;
  if (!groupData.Items?.length) return notFound();

  // Chapter Data
  const chapterCommand = new QueryCommand({
    TableName: "ReadingChapters",
    IndexName: "readingGroupId-index",
    KeyConditionExpression: "readingGroupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { S: slug },
    },
  }) as any;
  const chapterData = (await docClient.send(chapterCommand)) as any;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-base font-bold text-foreground sm:text-3xl">Reading History</h1>
            <Link
              href={`/reading/${slug}`}
              className="flex items-center gap-1 rounded-lg border border-foreground bg-background px-1 py-2 text-xs text-foreground transition-all hover:bg-thirdiary hover:text-foreground focus:outline-none focus:ring-gray-300 sm:px-4 sm:text-base sm:text-sm"
            >
              ← Back to Reading
            </Link>
          </div>

          <RecapTable chapterData={chapterData} groupData={groupData} slug={slug} />
        </div>
      </div>
    </>
  );
}
