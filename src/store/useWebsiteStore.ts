import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsiteStore {
  currentUser: string | null;
  setCurrentUser: (currentUser: string | null) => void;
}

export const useWebsiteStore = create<WebsiteStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
    }),
    { name: "website-state" }
  )
);
