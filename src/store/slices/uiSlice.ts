// src/store/slices/uiSlice.ts
import { StateCreator } from "zustand";
import type { UIState, RootState } from "../types";

export interface UISlice extends UIState {
  // Actions pour l'UI
  setSidebarOpen: (open: boolean) => void;
  setDrawingMode: (mode: string | false) => void;
  setSearchTerm: (term: string) => void;
  setDepartSearchTerm: (term: string) => void;
  setShowAllActifs: (show: boolean) => void;
  setShowDepartConnections: (show: boolean) => void;
  setShowDepartLabels: (show: boolean) => void;
  setAutoSelectFiltered: (auto: boolean) => void;
  setShowAnalytics: (show: boolean) => void;
  setShowConnectionAnimation: (show: boolean) => void;
  setConnectionOpacity: (opacity: number) => void;
  exportMapImage: () => void;
}

// Créateur du slice UI
export const createUISlice: StateCreator<RootState, [], [], UISlice> = (
  set,
  get
) => ({
  // État initial
  isSidebarOpen: false,
  isDrawingMode: false,
  searchTerm: "",
  departSearchTerm: "",
  showAllActifs: true,
  showDepartConnections: true,
  showDepartLabels: false,
  autoSelectFiltered: false,
  showAnalytics: false,
  showConnectionAnimation: true,
  connectionOpacity: 0.7,

  // Actions
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  setDrawingMode: (isDrawingMode) => set({ isDrawingMode }),

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    get().applyFilters();
  },

  setDepartSearchTerm: (departSearchTerm) => {
    set({ departSearchTerm });
    get().applyDepartFilters();
  },

  setShowAllActifs: (showAllActifs) => set({ showAllActifs }),

  setShowDepartConnections: (showDepartConnections) =>
    set({ showDepartConnections }),

  setShowDepartLabels: (showDepartLabels) => set({ showDepartLabels }),

  setAutoSelectFiltered: (autoSelectFiltered) => set({ autoSelectFiltered }),

  setShowAnalytics: (showAnalytics) => set({ showAnalytics }),

  setShowConnectionAnimation: (showConnectionAnimation) =>
    set({ showConnectionAnimation }),

  setConnectionOpacity: (connectionOpacity) => set({ connectionOpacity }),

  exportMapImage: () => {
    // Implémentation pour exporter une image de la carte
    // Nécessiterait l'intégration avec html2canvas ou similar
    console.log("Export d'image de carte - À implémenter");

    // Cette fonctionnalité serait généralement implémentée en capturant le DOM
    // de la carte à l'aide d'une bibliothèque comme html2canvas

    // Exemple d'implémentation (non fonctionnelle ici, car dépend de l'installation de html2canvas)
    /*
    import html2canvas from 'html2canvas';
    
    const mapElement = document.getElementById('map-container');
    if (mapElement) {
      html2canvas(mapElement).then(canvas => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `carte_reseau_${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      });
    }
    */
  },
});
