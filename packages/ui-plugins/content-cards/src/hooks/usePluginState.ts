import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PluginState {
  selectedCard: any;
  setSelectedCard: (card) => void;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}

export const usePluginState = create<PluginState>()(
  persist(
    (set) => ({
      selectedCard: null,
      setSelectedCard: (selectedCard) =>
        set((state) => ({ ...state, selectedCard })),
      selectedTab: "cards",
      setSelectedTab: (selectedTab: string) =>
        set((state) => ({ ...state, selectedTab })),
    }),
    {
      name: "assurance-plugin-content-cards",
    },
  ),
);
