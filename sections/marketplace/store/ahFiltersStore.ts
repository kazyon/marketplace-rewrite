import { create } from 'zustand';
import { AhFilters } from '@/sections/marketplace/types';
import { initialFilters } from '@/sections/marketplace/config';

export type FiltersStore = {
    filters: AhFilters;
    changeFilters: (filters: Partial<AhFilters>) => void;
    resetFilters: () => void;
    sidebarOpen: boolean;
    toggleSidebarOpen: () => void;
};

export const useAuctionFilters = create<FiltersStore>((set) => ({
    sidebarOpen: true,
    filters: initialFilters,
    resetFilters: () => set((state) => ({ ...state, filters: initialFilters })),
    changeFilters: (filters: Partial<AhFilters>) => {
        set((state) => {
            return {
                filters: { ...state.filters, ...filters },
            };
        });
    },
    toggleSidebarOpen: () => set((state) => ({ ...state, sidebarOpen: !state.sidebarOpen })),
}));
