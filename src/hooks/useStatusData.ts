import { useWebsiteStore } from "@/store/useWebsiteStore";
import { useEffect } from "react";

export default function useStatusData(slug: string) {
  const { statusData, setStatusData } = useWebsiteStore();

  useEffect(() => {
    const fetchingStatusData = async () => {
      if (statusData.length) {
        if (statusData[0].readingGroupId !== slug) {
          setStatusData([]);
        }
      } else {
        const statusDataResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/status-data?slug=${slug}`
        );
        if (!statusDataResponse.ok) {
          throw new Error(`HTTP error! status: ${statusDataResponse.status}`);
        }
        const chapterData = await statusDataResponse.json();
        setStatusData(chapterData.Items);
      }
    };

    fetchingStatusData();
  }, [statusData]);

  return statusData;
}
