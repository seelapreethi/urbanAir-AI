import { create } from "zustand";

interface CityState {
  selectedCity: string;
  selectedWardId: string | null;
  selectedWardName: string | null;
  setCity: (cityName: string) => void;
  setWard: (wardId: string | null, wardName: string | null) => void;
  resetLocation: () => void;
}

export const useCityStore = create<CityState>((set) => ({
  selectedCity: "Vijayawada", // Vijayawada is the default city
  selectedWardId: null,
  selectedWardName: null,
  setCity: (cityName) => set({ selectedCity: cityName, selectedWardId: null, selectedWardName: null }),
  setWard: (wardId, wardName) => set({ selectedWardId: wardId, selectedWardName: wardName }),
  resetLocation: () => set({ selectedCity: "Vijayawada", selectedWardId: null, selectedWardName: null }),
}));
