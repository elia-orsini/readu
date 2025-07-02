import { docClient } from "@/dynamo/client";
import { ReadingGroup } from "@/types/ReadingGroup";

import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const groupCommand = new QueryCommand({
      TableName: "ReadingGroups",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": { S: slug },
      },
    }) as any;

    const groupData = (await docClient.send(groupCommand)) as any;

    if (!groupData.Items?.length)
      return NextResponse.json({ error: "No reading group found" }, { status: 404 });

    const readingGroup: ReadingGroup = {
      id: groupData.Items[0].id.S!,
      members: groupData.Items[0].members.L.map((obj: any) => obj.S) || [],
      bookTitle: groupData.Items[0].bookTitle.S!,
    };

    return NextResponse.json(readingGroup);
  } catch (error) {
    console.error("Error fetching read status:", error);
    return NextResponse.json({ error: "Failed to fetch reading status data" }, { status: 500 });
  }
}
