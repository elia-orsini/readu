import { NextResponse } from "next/server";
import { uploadChapter } from "@/lib/dynamodb";

export async function POST(request: Request) {
  const { chapters, readingGroupId } = await request.json();

  try {
    await Promise.all(
      chapters.map((chapter: any) => uploadChapter({ ...chapter, readingGroupId }))
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to upload chapters" }, { status: 500 });
  }
}
