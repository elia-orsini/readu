import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useEffect } from "react";

export default function useGroupData(slug: string) {
  const { groupData, setGroupData } = useWebsiteStore();

  useEffect(() => {
    const fetchingGroupData = async () => {
      if (groupData) {
        if (groupData.id !== slug) {
          setGroupData(null);
        }
      } else {
        const groupDataResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/reading-group?slug=${slug}`
        );
        if (!groupDataResponse.ok) {
          throw new Error(`HTTP error! status: ${groupDataResponse.status}`);
        }
        const chapterData = await groupDataResponse.json();
        setGroupData(chapterData);
      }
    };

    fetchingGroupData();
  }, [groupData]);

  return groupData;
}
