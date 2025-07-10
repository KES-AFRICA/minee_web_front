// src/store/slices/departsSlice.ts
import { StateCreator } from "zustand";
import type { DepartsState, RootState } from "../types";
import type { Depart } from "@/types";
import { calculateAllDepartConnections } from "../utils/connectionUtils";

export interface DepartsSlice extends DepartsState {
  // Actions pour les départs
  setDeparts: (departs: Depart[]) => void;
  setSelectedDepart: (departId: string | null) => void;
  selectActifsByDepart: (departId: string) => void;
  toggleDepartVisibility: (departId: string) => void;
  calculateDepartConnections: () => void;
  addFavoriteDepart: (departId: string) => void;
  removeFavoriteDepart: (departId: string) => void;
  centerOnDepart: (departId: string) => void;
  compareDeparts: (departIds: string[]) => any;
  getDepartStatistics: (departId?: string) => any;
  exportDepart: (departId: string, format: "csv" | "json" | "excel") => void;
  exportDepartAnalysis: () => void;
}

// Créateur du slice Départs
export const createDepartsSlice: StateCreator<
  RootState,
  [],
  [],
  DepartsSlice
> = (set, get) => ({
  // État initial
  departs: [],
  filteredDeparts: [],
  selectedDepart: null,
  departConnections: [],
  favoriteDeparts: [],

  // Actions
  setDeparts: (departs) => {
    set({ departs });
    get().applyDepartFilters();
    get().calculateDepartConnections();
  },

  setSelectedDepart: (departId) => {
    set({ selectedDepart: departId });
    if (departId) {
      get().selectActifsByDepart(departId);
      get().centerOnDepart(departId);
    }
  },

  selectActifsByDepart: (departId) => {
    const { departs, actifs } = get();
    const depart = departs.find((d) => d.id === departId);
    if (!depart) return;

    const departActifs = depart.actifs
      .map((actifId) => actifs.find((a) => a.id === actifId))
      .filter(Boolean);

    set({
      selectedActifs: departActifs,
      selectedDepart: departId,
      isSidebarOpen: departActifs.length > 0,
    });
  },

  toggleDepartVisibility: (departId) => {
    set((state) => ({
      departConnections: state.departConnections.map((conn) =>
        conn.depart.id === departId
          ? { ...conn, isVisible: !conn.isVisible }
          : conn
      ),
    }));
  },

  calculateDepartConnections: () => {
    const { departs, actifs } = get();
    const connections = calculateAllDepartConnections(departs, actifs);
    set({ departConnections: connections });
  },

  addFavoriteDepart: (departId) => {
    set((state) => ({
      favoriteDeparts: [...state.favoriteDeparts, departId],
    }));
  },

  removeFavoriteDepart: (departId) => {
    set((state) => ({
      favoriteDeparts: state.favoriteDeparts.filter((id) => id !== departId),
    }));
  },

  centerOnDepart: (departId) => {
    const { departConnections } = get();
    const connection = departConnections.find(
      (conn) => conn.depart.id === departId
    );

    if (connection && connection.bounds) {
      set({ mapBounds: connection.bounds });
    }
  },

  compareDeparts: (departIds) => {
    const comparisons = departIds.map((id) => get().getDepartStatistics(id));

    return {
      departs: comparisons,
      comparison: {
        totalActifs: comparisons.reduce((sum, d) => sum + d.nombreActifs, 0),
        valorisationMoyenne:
          comparisons.reduce((sum, d) => sum + d.valorisationTotale, 0) /
          comparisons.length,
        tensionMoyenne:
          comparisons.reduce((sum, d) => sum + d.tension, 0) /
          comparisons.length,
        longueurTotale: comparisons.reduce(
          (sum, d) => sum + d.longueurTotale,
          0
        ),
        densiteMoyenne:
          comparisons.reduce((sum, d) => sum + d.densiteActifs, 0) /
          comparisons.length,
      },
    };
  },

  getDepartStatistics: (departId) => {
    const { departs, actifs, departConnections } = get();

    if (departId) {
      const depart = departs.find((d) => d.id === departId);
      const connection = departConnections.find(
        (c) => c.depart.id === departId
      );
      if (!depart) return null;

      const departActifs = depart.actifs
        .map((actifId) => actifs.find((a) => a.id === actifId))
        .filter(Boolean);

      return {
        depart: depart.nom,
        id: depart.id,
        nombreActifs: departActifs.length,
        valorisationTotale: departActifs.reduce(
          (sum, actif) => sum + actif.valorisation,
          0
        ),
        typesActifs: [...new Set(departActifs.map((a) => a.type))],
        regionsDesservies: depart.zonesGeographiques.regions,
        communesDesservies: depart.zonesGeographiques.communes,
        longueurTotale: depart.longueurTotale,
        longueurCalculee: connection?.totalLength || 0,
        tension: depart.tension,
        etatGeneral: depart.etatGeneral,
        typeDepart: depart.typeDepart,
        dateCreation: depart.dateCreation,
        connectionType: connection?.connectionType || "radial",
        repartitionParType: departActifs.reduce((acc, actif) => {
          acc[actif.type] = (acc[actif.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        repartitionParEtat: departActifs.reduce((acc, actif) => {
          acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        repartitionParRegion: departActifs.reduce((acc, actif) => {
          acc[actif.region] = (acc[actif.region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        moyenneAge:
          departActifs.reduce(
            (sum, actif) =>
              sum + (new Date().getFullYear() - actif.anneeMiseEnService),
            0
          ) / departActifs.length || 0,
        densiteActifs: departActifs.length / (connection?.totalLength || 1), // actifs par km
        coverage: {
          bounds: connection?.bounds,
          centerPoint: connection?.centerPoint,
        },
      };
    }

    // Statistiques générales pour tous les départs
    return departs.map((depart) => get().getDepartStatistics(depart.id));
  },

  exportDepart: (departId, format) => {
    const { exportData } = require("../utils/exportUtils");
    const { departs, actifs } = get();
    const depart = departs.find((d) => d.id === departId);
    if (!depart) return;

    const departActifs = depart.actifs
      .map((actifId) => actifs.find((a) => a.id === actifId))
      .filter(Boolean);

    if (departActifs.length === 0) return;

    const metadata = {
      depart: depart,
      statistics: get().getDepartStatistics(departId),
      exportDate: new Date().toISOString(),
    };

    const fileName = `depart_${depart.nom.replace(/[^a-zA-Z0-9]/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }`;

    exportData(departActifs, format, fileName, metadata);
  },

  exportDepartAnalysis: () => {
    const { downloadFile } = require("../utils/exportUtils");
    const stats = get().getDepartAnalytics();
    const dataStr = JSON.stringify(
      {
        analytics: stats,
        departDetails: get().departs.map((d) =>
          get().getDepartStatistics(d.id)
        ),
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
    downloadFile(
      dataStr,
      "application/json",
      `analyse_departs_${new Date().toISOString().split("T")[0]}.json`
    );
  },
});
