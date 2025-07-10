// src/store/slices/mapSlice.ts
// src/store/slices/mapSlice.ts
import type { StateCreator } from "zustand";
import type { MapState, RootState } from "../types";
import L from "leaflet";

export interface MapSlice extends MapState {
  // Actions pour la carte
  setMapBounds: (bounds: L.LatLngBounds | null) => void;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
  resetMapView: () => void;
  fitMapToSelection: () => void;
  centerOnActif: (actifId: string) => void;
}

// Créateur du slice Map
export const createMapSlice: StateCreator<RootState, [], [], MapSlice> = (
  set,
  get
) => ({
  // État initial
  mapBounds: null,
  mapCenter: { lat: 3.848, lng: 11.502 }, // Centre du Cameroun
  mapZoom: 7,

  // Actions
  setMapBounds: (mapBounds) => set({ mapBounds }),

  setMapCenter: (mapCenter) => set({ mapCenter }),

  setMapZoom: (mapZoom) => set({ mapZoom }),

  resetMapView: () => {
    set({
      mapBounds: null,
      mapCenter: { lat: 3.848, lng: 11.502 }, // Centre du Cameroun
      mapZoom: 7,
    });
  },

  fitMapToSelection: () => {
    const { selectedActifs } = get();
    if (selectedActifs.length === 0) return;

    const latitudes = selectedActifs.map((a) => a.geolocalisation.latitude);
    const longitudes = selectedActifs.map((a) => a.geolocalisation.longitude);

    const bounds = new L.LatLngBounds([
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ]);

    set({ mapBounds: bounds });
  },

  centerOnActif: (actifId: string) => {
    const { actifs } = get();
    const actif = actifs.find((a) => a.id === actifId);
    if (!actif) return;

    const { latitude, longitude } = actif.geolocalisation;
    const bounds = new L.LatLngBounds([
      [latitude - 0.01, longitude - 0.01],
      [latitude + 0.01, longitude + 0.01],
    ]);

    set({ mapBounds: bounds });
  },
});
