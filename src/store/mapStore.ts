import { create } from 'zustand';
import type {FilterState, SelectionArea} from "@/types";
import {type Actif, inventaireActifs} from "@/utils/data.ts";

interface MapStore {
  elements: Actif[];
  filteredElements: Actif[];
  selectedElements: Actif[];
  filters: FilterState;
  selectionArea: SelectionArea;
  sidebarOpen: boolean;
  drawingMode: boolean;
  
  // Actions
  setElements: (elements: Actif[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedElements: (elements: Actif[]) => void;
  setSelectionArea: (area: SelectionArea) => void;
  setSidebarOpen: (open: boolean) => void;
  setDrawingMode: (mode: boolean) => void;
  applyFilters: () => void;
  clearSelection: () => void;
}

// Mock data

export const useMapStore = create<MapStore>((set, get) => ({
  elements: inventaireActifs,
  filteredElements: inventaireActifs,
  selectedElements: [],
  filters: {
    types: [],
    priceRange: [0, 500],
    ratingMin: 0,
    searchQuery: ''
  },
  selectionArea: {
    bounds: null,
    shape: null,
    coordinates: null
  },
  sidebarOpen: false,
  drawingMode: false,

  setElements: (elements) => set({ elements }),
  
  setFilters: (newFilters) => {
    const currentFilters = get().filters;
    const updatedFilters = { ...currentFilters, ...newFilters };
    set({ filters: updatedFilters });
    get().applyFilters();
  },

  setSelectedElements: (elements) => {
    set({ 
      selectedElements: elements,
      sidebarOpen: elements.length > 0
    });
  },

  setSelectionArea: (area) => set({ selectionArea: area }),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setDrawingMode: (mode) => set({ drawingMode: mode }),

  applyFilters: () => {
    const { elements, filters } = get();
    let filtered = elements;

    // Filter by types
    if (filters.types.length > 0) {
      filtered = filtered.filter(el => filters.types.includes(el.type));
    }

    // Filter by price range
    filtered = filtered.filter(el => 
      el.anneeMiseEnService >= filters.priceRange[0] && el.anneeMiseEnService <= filters.priceRange[1]
    );

    // Filter by rating
    filtered = filtered.filter(el => el.anneeMiseEnService >= filters.ratingMin);

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(el => 
        el.designationGenerale.toLowerCase().includes(query) ||
        el.libelleCompte.toLowerCase().includes(query) ||
        el.type.toLowerCase().includes(query)
      );
    }

    set({ filteredElements: filtered });
  },

  clearSelection: () => {
    set({
      selectedElements: [],
      selectionArea: { bounds: null, shape: null, coordinates: null },
      sidebarOpen: false,
      drawingMode: false
    });
  }
}));