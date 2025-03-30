import { NextResponse } from "next/server";
import { createReadingGroup } from "@/lib/dynamodb";

export async function POST(request: Request) {
  const { id, members, bookTitle } = await request.json();

  console.log(id, members, bookTitle);

  try {
    await createReadingGroup({ id, members, bookTitle });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
