import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PluginState {
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}

export const usePluginState = create<PluginState>()(
  persist(
    (set) => ({
      selectedTab: "cards",
      setSelectedTab: (selectedTab: string) =>
        set((state) => ({ ...state, selectedTab })),
    }),
    {
      name: "assurance-plugin-optimize",
    },
  ),
);
