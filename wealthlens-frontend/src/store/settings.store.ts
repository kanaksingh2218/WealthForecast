import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'USD' | 'INR';

interface SettingsState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: 'INR',
      setCurrency: (currency: Currency) => set({ currency }),
    }),
    {
      name: 'wealthlens-settings',
    }
  )
);
