import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useEffect } from "react";

export default function useChaptersData(slug: string) {
  const { allChapters, setAllChapters } = useWebsiteStore();

  useEffect(() => {
    const fetchingChapters = async () => {
      if (allChapters.length) {
        if (allChapters[0].readingGroupId !== slug) {
          setAllChapters([]);
        }
      } else {
        const chaptersResponse = await fetch(`/api/chapters?slug=${slug}`);
        if (!chaptersResponse.ok) {
          throw new Error(`HTTP error! status: ${chaptersResponse.status}`);
        }
        const chapterData = await chaptersResponse.json();
        setAllChapters(chapterData.Items);
      }
    };

    fetchingChapters();
  }, [allChapters]);

  return allChapters;
}
