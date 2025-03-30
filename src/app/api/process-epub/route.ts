import { NextResponse } from "next/server";
import { processEPUB } from "@/scripts/process-epub";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const tempPath = path.join("/tmp", file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.promises.writeFile(tempPath, buffer);

  try {
    const { title, chapters } = await processEPUB(tempPath);
    return NextResponse.json({ title, chapters });
  } finally {
    await fs.promises.unlink(tempPath);
  }
}
