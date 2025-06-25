import ChapterRendering from "@/components/ChapterRendering";
import MarkAsReadButtons from "@/components/MarkAsReadButtons";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { notFound } from "next/navigation";

interface Chapter {
  id: string;
  readingGroupId: string;
  title: string;
  date: string;
  content: string;
}

interface ReadingGroup {
  id: string;
  members: string[];
  bookTitle: string;
}

interface ReadingStatus {
  [member: string]: boolean;
}

// Helper function to clean and format chapter content
const cleanChapterContent = (content: string): string => {
  const cleaned = content.replace(/\[(.*?)\]\(#contents\$\w+\)/g, (match, p1) => {
    console.log(match, p1);

    const title = p1
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");

    return `CHAPTER_${title}`;
  });

  return cleaned;
};

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  // Initialize DynamoDB client
  const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const docClient = DynamoDBDocumentClient.from(ddbClient);

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

    const chapter: Chapter = {
      id: chapterData.Items[0].id.S!,
      readingGroupId: chapterData.Items[0].readingGroupId.S!,
      title: chapterData.Items[0].title.S!,
      date: chapterData.Items[0].date.S!,
      content: cleanChapterContent(chapterData.Items[0].content.S!),
    };

    // 3. Fetch reading status for this chapter
    const statusCommand = new QueryCommand({
      TableName: "ChapterReadings",
      KeyConditionExpression: "chapterId = :chapterId",
      ExpressionAttributeValues: {
        ":chapterId": { S: chapter.id },
      },
    }) as any;

    const statusData = (await docClient.send(statusCommand)) as any;

    const readStatus: ReadingStatus = {};
    readingGroup.members.forEach((member) => {
      readStatus[member] = statusData.Items?.some((item: any) => item.person.S === member) || false;
    });

    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[var(--background)] p-4 shadow-sm sm:p-8">
          <MarkAsReadButtons
            chapterId={chapter.id}
            members={readingGroup.members}
            initialStatus={readStatus}
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
