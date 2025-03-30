import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsiteStore {
  navBarText: string;
  setNavBarText: (rawMarkdown: string) => void;
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      navBarText: "",
      setNavBarText: (navBarText: any) => set({ navBarText }),
    }),
    { name: "editor-state" }
  )
);
