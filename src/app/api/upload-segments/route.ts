import { NextResponse } from "next/server";
import { uploadChapter } from "@/lib/dynamodb";

export async function POST(request: Request) {
  const { segments, readingGroupId } = await request.json();

  try {
    await Promise.all(
      segments.map((segment: any) => uploadChapter({ ...segment, readingGroupId }))
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to upload chapters" }, { status: 500 });
  }
}
