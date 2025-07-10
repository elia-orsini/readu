import { NextRequest, NextResponse } from "next/server";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/dynamo/client";

export async function GET(request: NextRequest) {
  try {
    const chapterId = request.nextUrl.searchParams.get("chapterId");
    const readingGroupId = request.nextUrl.searchParams.get("readingGroupId");

    if (chapterId) {
      const command = new QueryCommand({
        TableName: "ReadingNotes",
        IndexName: "ChapterIndex",
        KeyConditionExpression: "chapterId = :chapterId",
        ExpressionAttributeValues: {
          ":chapterId": chapterId,
        },
      }) as any;

      const highlightsData = await docClient.send(command);
      return NextResponse.json(highlightsData);
    }

    if (readingGroupId) {
      const command = new QueryCommand({
        TableName: "ReadingNotes",
        KeyConditionExpression: "readingGroupId = :readingGroupId",
        ExpressionAttributeValues: {
          ":readingGroupId": readingGroupId,
        },
      }) as any;

      const highlightsData = await docClient.send(command);
      return NextResponse.json(highlightsData);
    }

    return NextResponse.json({ error: "Missing chapterId or readingGroupId" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { highlight } = await request.json();

    const item = {
      ...highlight,
      createdAt: new Date(highlight.createdAt || Date.now()).toISOString(),
    };

    const command = new PutCommand({
      TableName: "ReadingNotes",
      Item: item,
    }) as any;

    await docClient.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving highlight:", error);
    return NextResponse.json({ error: "Failed to save highlight" }, { status: 500 });
  }
}
