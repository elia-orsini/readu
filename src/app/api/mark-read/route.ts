import { docClient } from "@/dynamo/client";
import { PutCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { chapterId, person, readingGroupId } = await request.json();

    if (!chapterId || !person) {
      return NextResponse.json({ error: "Missing chapterId or person" }, { status: 400 });
    }

    // 1. Check if reading record exists
    const checkCommand = new QueryCommand({
      TableName: "ChapterReadings",
      KeyConditionExpression: "chapterId = :cid AND person = :p",
      ExpressionAttributeValues: {
        ":cid": chapterId,
        ":p": person,
      },
      Limit: 1,
    }) as any;

    const checkResponse = (await docClient.send(checkCommand)) as any;
    const exists = checkResponse.Items && checkResponse.Items.length > 0;

    // 2. Toggle the read status
    if (exists) {
      // Delete to mark as unread
      await docClient.send(
        new DeleteCommand({
          TableName: "ChapterReadings",
          Key: { chapterId, person },
        }) as any
      );
      return NextResponse.json({ status: "unread" });
    } else {
      // Create to mark as read
      await docClient.send(
        new PutCommand({
          TableName: "ChapterReadings",
          Item: {
            chapterId,
            person,
            date: new Date().toISOString(),
            readingGroupId: readingGroupId,
          },
        }) as any
      );
      return NextResponse.json({ status: "read" });
    }
  } catch (error) {
    console.error("Error toggling read status:", error);
    return NextResponse.json({ error: "Failed to toggle reading status" }, { status: 500 });
  }
}
