import { docClient } from "@/dynamo/client";

import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const chapterCommand = new QueryCommand({
      TableName: "ReadingChapters",
      IndexName: "readingGroupId-index",
      KeyConditionExpression: "readingGroupId = :groupId",
      ExpressionAttributeValues: {
        ":groupId": { S: slug },
      },
    }) as any;

    const chapterData = (await docClient.send(chapterCommand)) as any;

    return NextResponse.json(chapterData);
  } catch (error) {
    console.error("Error fetching read status:", error);
    return NextResponse.json({ error: "Failed to fetch reading status data" }, { status: 500 });
  }
}
