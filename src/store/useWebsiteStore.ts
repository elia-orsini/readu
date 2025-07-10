import Chapter from "@/types/Chapter";
import { ReadingGroup } from "@/types/ReadingGroup";
import { Status } from "@/types/Status";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsiteStore {
  currentUser: string | null;
  setCurrentUser: (currentUser: string | null) => void;
  allChapters: Chapter[];
  setAllChapters: (allChapters: Chapter[]) => void;
  statusData: Status[];
  setStatusData: (statusData: Status[]) => void;
  groupData: ReadingGroup | null;
  setGroupData: (groupData: ReadingGroup | null) => void;
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      allChapters: [],
      setAllChapters: (allChapters) => set({ allChapters }),
      statusData: [],
      setStatusData: (statusData) => set({ statusData }),
      groupData: null,
      setGroupData: (groupData) => set({ groupData }),
    }),
    { name: "readu-state" }
  )
);
