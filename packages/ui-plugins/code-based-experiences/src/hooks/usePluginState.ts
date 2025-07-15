import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tab = "experiences" | "events" | "validation";

interface PluginState {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

export const usePluginState = create<PluginState>()(
  persist(
    (set) => ({
      selectedTab: "experiences",
      setSelectedTab: (selectedTab) =>
        set((state) => ({ ...state, selectedTab })),
    }),
    { name: "assurance-plugin-code-based-experiences" },
  ),
);
