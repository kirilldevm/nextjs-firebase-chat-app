import { create } from 'zustand';

export type TActiveTab = 'users' | 'chats' | 'groups';

export const useStore = create<{
  activeTab: TActiveTab;
  setActiveTab: (tab: TActiveTab) => void;
}>((set) => ({
  activeTab: 'users',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
