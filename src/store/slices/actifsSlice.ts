// src/store/slices/actifsSlice.ts
import { StateCreator } from "zustand";
import type { ActifsState, RootState } from "../types";
import type { Actif } from "@/types";

export interface ActifsSlice extends ActifsState {
  // Actions pour les actifs
  setActifs: (actifs: Actif[]) => void;
  setSelectedActifs: (actifs: Actif[]) => void;
  addSelectedActif: (actif: Actif) => void;
  removeSelectedActif: (actifId: string) => void;
  clearSelection: () => void;
  selectFilteredActifs: () => void;
  selectActifsByType: (type: string) => void;
  selectActifsByRegion: (region: string) => void;
  selectActifsByEtat: (etat: string) => void;
  invertSelection: () => void;
  searchActifs: (query: string) => Actif[];
  getActifsInRadius: (
    center: { lat: number; lng: number },
    radiusKm: number
  ) => Actif[];
  findSimilarActifs: (actifId: string) => Actif[];
  importActifs: (data: Actif[]) => void;
}

// Créateur du slice Actifs
export const createActifsSlice: StateCreator<RootState, [], [], ActifsSlice> = (
  set,
  get
) => ({
  // État initial
  actifs: [],
  filteredActifs: [],
  selectedActifs: [],

  // Actions
  setActifs: (actifs) => {
    set({ actifs });
    // Appliquer les filtres existants pour mettre à jour filteredActifs
    get().applyFilters();
  },

  setSelectedActifs: (selectedActifs) =>
    set({
      selectedActifs,
      isSidebarOpen: selectedActifs.length > 0,
    }),

  addSelectedActif: (actif) =>
    set((state) => {
      const isAlreadySelected = state.selectedActifs.some(
        (a) => a.id === actif.id
      );
      if (isAlreadySelected) return state;

      return {
        selectedActifs: [...state.selectedActifs, actif],
        isSidebarOpen: true,
      };
    }),

  removeSelectedActif: (actifId) =>
    set((state) => {
      const newSelection = state.selectedActifs.filter((a) => a.id !== actifId);
      return {
        selectedActifs: newSelection,
        isSidebarOpen: newSelection.length > 0,
      };
    }),

  clearSelection: () =>
    set({
      selectedActifs: [],
      selectedDepart: null,
      isSidebarOpen: false,
    }),

  selectFilteredActifs: () => {
    const { filteredActifs } = get();
    set({
      selectedActifs: filteredActifs,
      isSidebarOpen: filteredActifs.length > 0,
    });
  },

  selectActifsByType: (type) => {
    const { filteredActifs } = get();
    const typeActifs = filteredActifs.filter((a) => a.type === type);
    set({
      selectedActifs: typeActifs,
      isSidebarOpen: typeActifs.length > 0,
    });
  },

  selectActifsByRegion: (region) => {
    const { filteredActifs } = get();
    const regionActifs = filteredActifs.filter((a) => a.region === region);
    set({
      selectedActifs: regionActifs,
      isSidebarOpen: regionActifs.length > 0,
    });
  },

  selectActifsByEtat: (etat) => {
    const { filteredActifs } = get();
    const etatActifs = filteredActifs.filter((a) => a.etatVisuel === etat);
    set({
      selectedActifs: etatActifs,
      isSidebarOpen: etatActifs.length > 0,
    });
  },

  invertSelection: () => {
    const { filteredActifs, selectedActifs } = get();
    const selectedIds = new Set(selectedActifs.map((a) => a.id));
    const invertedSelection = filteredActifs.filter(
      (a) => !selectedIds.has(a.id)
    );
    set({
      selectedActifs: invertedSelection,
      isSidebarOpen: invertedSelection.length > 0,
    });
  },

  searchActifs: (query) => {
    const { actifs } = get();
    const searchLower = query.toLowerCase();

    return actifs.filter(
      (actif) =>
        actif.designationGenerale?.toLowerCase().includes(searchLower) ||
        actif.type.toLowerCase().includes(searchLower) ||
        actif.region.toLowerCase().includes(searchLower) ||
        actif.commune?.toLowerCase().includes(searchLower) ||
        actif.quartier?.toLowerCase().includes(searchLower) ||
        actif.id.toLowerCase().includes(searchLower)
    );
  },

  getActifsInRadius: (center, radiusKm) => {
    const { actifs } = get();
    const { calculateDistance } = require("../utils/calculationUtils");

    return actifs.filter((actif) => {
      const distance = calculateDistance(
        { latitude: center.lat, longitude: center.lng },
        actif.geolocalisation
      );
      return distance <= radiusKm;
    });
  },

  findSimilarActifs: (actifId) => {
    const { actifs } = get();
    const targetActif = actifs.find((a) => a.id === actifId);
    if (!targetActif) return [];

    return actifs
      .filter((a) => a.id !== actifId)
      .filter(
        (a) =>
          a.type === targetActif.type ||
          a.region === targetActif.region ||
          Math.abs(a.anneeMiseEnService - targetActif.anneeMiseEnService) <=
            2 ||
          Math.abs(a.valorisation - targetActif.valorisation) <= 10000
      )
      .sort((a, b) => {
        // Score de similarité
        let scoreA = 0,
          scoreB = 0;

        if (a.type === targetActif.type) scoreA += 3;
        if (b.type === targetActif.type) scoreB += 3;

        if (a.region === targetActif.region) scoreA += 2;
        if (b.region === targetActif.region) scoreB += 2;

        if (
          Math.abs(a.anneeMiseEnService - targetActif.anneeMiseEnService) <= 2
        )
          scoreA += 1;
        if (
          Math.abs(b.anneeMiseEnService - targetActif.anneeMiseEnService) <= 2
        )
          scoreB += 1;

        return scoreB - scoreA;
      })
      .slice(0, 10);
  },

  importActifs: (data) => {
    // Validation et import des actifs
    const validActifs = data.filter(
      (actif) => actif.id && actif.type && actif.geolocalisation
    );

    set((state) => ({
      actifs: [...state.actifs, ...validActifs],
    }));

    // Mettre à jour les actifs filtrés et les connexions des départs
    get().applyFilters();
    get().calculateDepartConnections();
  },
});
