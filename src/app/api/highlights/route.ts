import { NextRequest, NextResponse } from "next/server";

import { docClient } from "@/dynamo/client";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET(request: NextRequest) {
  try {
    const chapterId = request.nextUrl.searchParams.get("chapterId");

    if (!chapterId) {
      return NextResponse.json({ error: "Missing chapterId" }, { status: 400 });
    }

    const command = new QueryCommand({
      TableName: "ChapterHighlights",
      KeyConditionExpression: "chapterId = :chapterId",
      ExpressionAttributeValues: {
        ":chapterId": chapterId,
      },
    }) as any;

    const highlightsData = (await docClient.send(command)) as any;

    return NextResponse.json(highlightsData);
  } catch (error) {
    console.error("Error fetching read status:", error);
    return NextResponse.json({ error: "Failed to fetch reading status data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { highlight } = await request.json();

  try {
    const command = new PutCommand({
      TableName: "ChapterHighlights",
      Item: highlight,
    }) as any;

    await docClient.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading highlight:", error);
    return NextResponse.json({ error: "Failed to upload highlight" }, { status: 500 });
  }
}
