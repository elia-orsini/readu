import ChapterRendering from "@/components/ChapterRendering";
import Header from "@/components/header/Header";
import MarkAsReadButtons from "@/components/MarkAsReadButtons";
import EndMessage from "@/components/reading/EndMessage";
import GoBackUpButton from "@/components/reading/GoBackUpButton";
import { Metadata } from "next";
import Link from "next/link";

export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;

  try {
    // Reading Group Data
    const readingGroupResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/reading-group?slug=${slug}`
    );
    if (!readingGroupResponse.ok) {
      throw new Error(`HTTP error! status: ${readingGroupResponse.status}`);
    }
    const groupData = await readingGroupResponse.json();

    // Chapters Data
    const chaptersResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/chapters?slug=${slug}`
    );
    if (!chaptersResponse.ok) {
      throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
    }
    const chapterData = await chaptersResponse.json();

    // Read Status Data
    const readStatusResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/status-data?slug=${slug}`
    );
    if (!readStatusResponse.ok) {
      throw new Error(`HTTP error! status: ${readStatusResponse.status}`);
    }
    const statusData = await readStatusResponse.json();

    if (!chapterData.Items?.length) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-600">
            No chapters found for this reading group.
          </div>
        </div>
      );
    }

    return (
      <>
        <Header />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--background)] p-4">
            <div className="flex items-center">
              <Link
                href={`/recap/${slug}`}
                className="ml-auto flex items-center rounded-lg border border-foreground bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] transition-all hover:bg-secondary focus:outline-none focus:ring-gray-300 sm:text-base"
              >
                Recap
              </Link>
            </div>

            <MarkAsReadButtons
              chapters={chapterData}
              members={groupData.members}
              readingGroupId={groupData.id}
              statusData={statusData}
            />

            <ChapterRendering chapters={chapterData} readingGroup={groupData} />

            <GoBackUpButton />

            <EndMessage />

            <footer className="border-t border-foreground bg-[var(--background)] py-12">
              <div className="mx-auto max-w-6xl">
                <div className="">
                  <p className="text-sm text-foreground">
                    © {new Date().getFullYear()} Readu. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching reading data:", error);
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">
          Failed to load reading data
        </div>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  // Reading Group Data
  const readingGroupResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/reading-group?slug=${slug}`
  );
  if (!readingGroupResponse.ok) {
    throw new Error(`HTTP error! status: ${readingGroupResponse.status}`);
  }
  const groupData = await readingGroupResponse.json();

  if (!groupData) {
    return {
      title: `Readu`,
    };
  }

  return {
    title: `${groupData.bookTitle} | Readu`,
  };
}
