import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export async function createReadingGroup(group: {
  id: string;
  members: string[];
  bookTitle: string;
}) {
  const command = new PutCommand({
    TableName: "ReadingGroups",
    Item: group,
  }) as any;
  await docClient.send(command);
}

export async function uploadChapter(segment: {
  id: string;
  title: string;
  content: string;
  date: string;
  chapterTitles: string[];
  estimatedMinutes: number;
}) {
  const command = new PutCommand({
    TableName: "ReadingChapters",
    Item: segment,
  }) as any;
  await docClient.send(command);
}
