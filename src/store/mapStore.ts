/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Actif, Filters, Depart } from "@/types";
import { inventaireActifs, inventaireDeparts } from "@/data";
import { LatLng } from "leaflet";
import L from "leaflet";

// Type pour les connexions de départs
interface DepartConnection {
  depart: Depart;
  actifs: Actif[];
  connections: LatLng[][];
  color: string;
  isVisible: boolean;
}

// Types pour les analytics avancés
interface ActifAnalytics {
  total: number;
  filtered: number;
  selected: number;
  parType: Record<string, number>;
  parRegion: Record<string, number>;
  parEtat: Record<string, number>;
  valorisationTotale: number;
  valorisationFiltered: number;
  valorisationSelected: number;
  moyenneAge: number;
  actifsPlusRecents: Actif[];
  actifsPlusAnciens: Actif[];
  actifsDefaillants: Actif[];
  repartitionAnnuelle: Record<number, number>;
}

interface DepartAnalytics {
  total: number;
  filtered: number;
  enService: number;
  enMaintenance: number;
  horsService: number;
  longueurTotale: number;
  tensionMoyenne: number;
  repartitionParType: Record<string, number>;
  repartitionParRegion: Record<string, number>;
  actifsParDepart: Record<string, number>;
}

// Interface étendue du store


interface MapState {
  // Data
  actifs: Actif[];
  filteredActifs: Actif[];
  selectedActifs: Actif[];

  // Départs
  departs: Depart[];
  filteredDeparts: Depart[];
  selectedDepart: string | null;
  departConnections: DepartConnection[];

  // UI State
  isSidebarOpen: boolean;
  isDrawingMode: string | false;
  searchTerm: string;
  departSearchTerm: string;

  // Display options
  showAllActifs: boolean;
  showDepartConnections: boolean;
  showDepartLabels: boolean;
  autoSelectFiltered: boolean;
  showAnalytics: boolean;

  // Filters
  filters: Filters;
  departFilters: {
    types: string[];
    regions: string[];
    etatGeneral: string[];
    tensionRange: { min: number; max: number };
  };

  // Advanced filters
  advancedFilters: {
    valorisationRange: { min: number; max: number };
    ageRange: { min: number; max: number };
    communes: string[];
    quartiers: string[];
  };

  // Map state
  mapBounds: L.LatLngBounds | null;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;

  // History & Favorites
  filterHistory: Array<{
    id: string;
    name: string;
    filters: Filters;
    advancedFilters: {
      valorisationRange: { min: number; max: number };
      ageRange: { min: number; max: number };
      communes: string[];
      quartiers: string[];
    };
    timestamp: Date;
  }>;
  favoriteDeparts: string[];
  recentSelections: Array<{
    actifs: string[];
    timestamp: Date;
    name?: string;
  }>;

  // Actions - Actifs
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

  // Actions - Départs
  setDeparts: (departs: Depart[]) => void;
  setSelectedDepart: (departId: string | null) => void;
  selectActifsByDepart: (departId: string) => void;
  toggleDepartVisibility: (departId: string) => void;
  calculateDepartConnections: () => void;
  addFavoriteDepart: (departId: string) => void;
  removeFavoriteDepart: (departId: string) => void;
  centerOnDepart: (departId: string) => void;

  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setDrawingMode: (mode: string | false) => void;
  setSearchTerm: (term: string) => void;
  setDepartSearchTerm: (term: string) => void;
  setShowAllActifs: (show: boolean) => void;
  setShowDepartConnections: (show: boolean) => void;
  setShowDepartLabels: (show: boolean) => void;
  setAutoSelectFiltered: (auto: boolean) => void;
  setShowAnalytics: (show: boolean) => void;

  // Filter Actions
  setFilters: (filters: Partial<Filters>) => void;
  setAdvancedFilters: (filters: Partial<MapState["advancedFilters"]>) => void;
  setDepartFilters: (filters: Partial<MapState["departFilters"]>) => void;
  applyFilters: () => void;
  applyDepartFilters: () => void;
  applyQuickFilter: (
    type: "recent" | "old" | "defaillant" | "highValue"
  ) => void;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (presetId: string) => void;
  clearAllFilters: () => void;

  // Map Actions
  setMapBounds: (bounds: L.LatLngBounds | null) => void;
  // Analytics
  resetMapView: () => void;

  // Export & Import
  exportSelection: (format: "csv" | "json" | "excel") => void;
  exportFiltered: (format: "csv" | "json" | "excel") => void;
  exportDepart: (departId: string, format: "csv" | "json" | "excel") => void;
  exportDepartAnalysis: () => void;
  exportFullReport: () => void;
  importActifs: (data: Actif[]) => void;
  exportMapImage: () => void;

  // Analytics
  getDepartStatistics: (departId?: string) => any;
  getActifStatistics: () => ActifAnalytics;
  getDepartAnalytics: () => DepartAnalytics;
  getFilterInsights: () => any;

  // Comparison & Analysis
  compareDeparts: (departIds: string[]) => any;
  findSimilarActifs: (actifId: string) => Actif[];
  getMaintenanceReport: () => any;
  getValorizationReport: () => any;

  // Utility functions
  searchActifs: (query: string) => Actif[];
  getActifsInRadius: (
    center: { lat: number; lng: number },
    radiusKm: number
  ) => Actif[];
}

// Fonction pour obtenir la couleur d'un départ selon son type
const getDepartColor = (typeDepart: string): string => {
  const colors: Record<string, string> = {
    Principal: "#e74c3c",
    Résidentiel: "#3498db",
    Commercial: "#f39c12",
    Industriel: "#9b59b6",
    Secondaire: "#27ae60",
    Mixte: "#e67e22",
  };
  return colors[typeDepart] || "#95a5a6";
};

// Fonction pour calculer les connexions entre actifs d'un départ
const calculateConnectionsForDepart = (
  depart: Depart,
  actifs: Actif[]
): LatLng[][] => {
  const departActifs = depart.actifs
    .map((actifId) => actifs.find((a) => a.id === actifId))
    .filter(Boolean) as Actif[];

  if (departActifs.length <= 1) return [];

  const connections: LatLng[][] = [];

  // Trouver le poste d'origine (généralement un poste de distribution)
  const posteOrigine =
    departActifs.find(
      (a) => a.type === "POSTE_DISTRIBUTION" || a.id === depart.posteOrigine
    ) || departActifs[0];

  // Connecter tous les autres actifs au poste d'origine
  departActifs.forEach((actif) => {
    if (actif.id !== posteOrigine.id) {
      connections.push([
        new LatLng(
          posteOrigine.geolocalisation.latitude,
          posteOrigine.geolocalisation.longitude
        ),
        new LatLng(
          actif.geolocalisation.latitude,
          actif.geolocalisation.longitude
        ),
      ]);
    }
  });

  return connections;
};

// Fonction utilitaire pour calculer la distance
const calculateDistance = (
  pos1: { latitude: number; longitude: number },
  pos2: { latitude: number; longitude: number }
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
  const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.latitude * Math.PI) / 180) *
      Math.cos((pos2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useMapStore = create<MapState>((set, get) => {
  return {
    // Initial state
    actifs: inventaireActifs,
    filteredActifs: [],
    selectedActifs: [],

    // Départs
    departs: inventaireDeparts,
    filteredDeparts: inventaireDeparts,
    selectedDepart: null,
    departConnections: [],

    // UI State
    isSidebarOpen: false,
    isDrawingMode: "pan",
    searchTerm: "",
    departSearchTerm: "",

    // Display options
    showAllActifs: true,
    showDepartConnections: true,
    showDepartLabels: false,
    autoSelectFiltered: false,
    showAnalytics: false,

    // Filters
    filters: {
      types: [],
      regions: [],
      etatVisuel: [],
      etatFonctionnement: [],
      anneeMiseEnService: { min: 2000, max: 2024 },
    },
    departFilters: {
      types: [],
      regions: [],
      etatGeneral: [],
      tensionRange: { min: 0, max: 50000 },
    },
    advancedFilters: {
      valorisationRange: { min: 0, max: 1000000 },
      ageRange: { min: 0, max: 25 },
      communes: [],
      quartiers: [],
    },

    // Map state
    mapBounds: null,
    mapCenter: null,
    mapZoom: 7,

    // History & Favorites
    filterHistory: [],
    favoriteDeparts: [],
    recentSelections: [],

    // Actions - Actifs
    setActifs: (actifs) => {
      set({ actifs });
      get().applyFilters();
      get().calculateDepartConnections();
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
        const newSelection = state.selectedActifs.filter(
          (a) => a.id !== actifId
        );
        return {
          selectedActifs: newSelection,
          isSidebarOpen: newSelection.length > 0,
        };
      }),

    clearSelection: () =>
      set({
        selectedActifs: [],
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

    // Actions - Départs
    setDeparts: (departs) => {
      set({ departs });
      get().applyDepartFilters();
      get().calculateDepartConnections();
    },

    setSelectedDepart: (departId) => {
      set({ selectedDepart: departId });
      if (departId) {
        get().selectActifsByDepart(departId);
      }
    },

    selectActifsByDepart: (departId) => {
      const { departs, actifs } = get();
      const depart = departs.find((d) => d.id === departId);
      if (!depart) return;

      const departActifs = depart.actifs
        .map((actifId) => actifs.find((a) => a.id === actifId))
        .filter(Boolean) as Actif[];

      set({
        selectedActifs: departActifs,
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
      const connections: DepartConnection[] = departs.map((depart) => ({
        depart,
        actifs: depart.actifs
          .map((actifId) => actifs.find((a) => a.id === actifId))
          .filter(Boolean) as Actif[],
        connections: calculateConnectionsForDepart(depart, actifs),
        color: getDepartColor(depart.typeDepart),
        isVisible: true,
      }));

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

    // UI Actions
    setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    setDrawingMode: (isDrawingMode) => set({ isDrawingMode }),
    setShowAllActifs: (showAllActifs) => set({ showAllActifs }),
    setShowDepartConnections: (showDepartConnections) =>
      set({ showDepartConnections }),
    setShowDepartLabels: (showDepartLabels) => set({ showDepartLabels }),
    setAutoSelectFiltered: (autoSelectFiltered) => set({ autoSelectFiltered }),
    setShowAnalytics: (showAnalytics) => set({ showAnalytics }),

    setSearchTerm: (searchTerm) => {
      set({ searchTerm });
      get().applyFilters();
    },

    setDepartSearchTerm: (departSearchTerm) => {
      set({ departSearchTerm });
      get().applyDepartFilters();
    },

    // Filter Actions
    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      }));
      get().applyFilters();
    },

    setAdvancedFilters: (newFilters) => {
      set((state) => ({
        advancedFilters: { ...state.advancedFilters, ...newFilters },
      }));
      get().applyFilters();
    },

    setDepartFilters: (newFilters) => {
      set((state) => ({
        departFilters: { ...state.departFilters, ...newFilters },
      }));
      get().applyDepartFilters();
    },

    applyFilters: () =>
      set((state) => {
        const {
          actifs,
          filters,
          advancedFilters,
          searchTerm,
          autoSelectFiltered,
        } = state;
        let filtered = actifs;

        // Apply search filter
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (actif) =>
              actif.designationGenerale.toLowerCase().includes(searchLower) ||
              actif.type.toLowerCase().includes(searchLower) ||
              actif.region.toLowerCase().includes(searchLower) ||
              actif.commune.toLowerCase().includes(searchLower) ||
              actif.quartier.toLowerCase().includes(searchLower)
          );
        }

        // Apply type filter
        if (filters.types.length > 0) {
          filtered = filtered.filter((actif) =>
            filters.types.includes(actif.type)
          );
        }

        // Apply region filter
        if (filters.regions.length > 0) {
          filtered = filtered.filter((actif) =>
            filters.regions.includes(actif.region)
          );
        }

        // Apply visual state filter
        if (filters.etatVisuel.length > 0) {
          filtered = filtered.filter((actif) =>
            filters.etatVisuel.includes(actif.etatVisuel)
          );
        }

        // Apply functional state filter
        if (filters.etatFonctionnement.length > 0) {
          filtered = filtered.filter((actif) => {
            const etatFonctionnement = (actif as any).etatFonctionnement;
            return (
              etatFonctionnement &&
              filters.etatFonctionnement.includes(etatFonctionnement)
            );
          });
        }

        // Apply year filter
        filtered = filtered.filter(
          (actif) =>
            actif.anneeMiseEnService >= filters.anneeMiseEnService.min &&
            actif.anneeMiseEnService <= filters.anneeMiseEnService.max
        );

        // Apply advanced filters
        // Valorisation filter
        filtered = filtered.filter(
          (actif) =>
            actif.valorisation >= advancedFilters.valorisationRange.min &&
            actif.valorisation <= advancedFilters.valorisationRange.max
        );

        // Age filter
        const currentYear = new Date().getFullYear();
        filtered = filtered.filter((actif) => {
          const age = currentYear - actif.anneeMiseEnService;
          return (
            age >= advancedFilters.ageRange.min &&
            age <= advancedFilters.ageRange.max
          );
        });

        // Commune filter
        if (advancedFilters.communes.length > 0) {
          filtered = filtered.filter((actif) =>
            advancedFilters.communes.includes(actif.commune)
          );
        }

        // Quartier filter
        if (advancedFilters.quartiers.length > 0) {
          filtered = filtered.filter((actif) =>
            advancedFilters.quartiers.includes(actif.quartier)
          );
        }

        // Auto-select filtered actifs if enabled
        const selectedActifs = autoSelectFiltered
          ? filtered
          : state.selectedActifs;

        return {
          filteredActifs: filtered,
          selectedActifs,
          isSidebarOpen: selectedActifs.length > 0,
        };
      }),

    applyDepartFilters: () =>
      set((state) => {
        const { departs, departFilters, departSearchTerm } = state;
        let filtered = departs;

        // Apply search filter
        if (departSearchTerm.trim()) {
          const searchLower = departSearchTerm.toLowerCase();
          filtered = filtered.filter(
            (depart) =>
              depart.nom.toLowerCase().includes(searchLower) ||
              depart.typeDepart.toLowerCase().includes(searchLower) ||
              depart.zonesGeographiques.regions.some((r) =>
                r.toLowerCase().includes(searchLower)
              ) ||
              depart.zonesGeographiques.communes.some((c) =>
                c.toLowerCase().includes(searchLower)
              )
          );
        }

        // Apply type filter
        if (departFilters.types.length > 0) {
          filtered = filtered.filter((depart) =>
            departFilters.types.includes(depart.typeDepart)
          );
        }

        // Apply region filter
        if (departFilters.regions.length > 0) {
          filtered = filtered.filter((depart) =>
            depart.zonesGeographiques.regions.some((r) =>
              departFilters.regions.includes(r)
            )
          );
        }

        // Apply state filter
        if (departFilters.etatGeneral.length > 0) {
          filtered = filtered.filter((depart) =>
            departFilters.etatGeneral.includes(depart.etatGeneral)
          );
        }

        // Apply tension filter
        filtered = filtered.filter(
          (depart) =>
            depart.tension >= departFilters.tensionRange.min &&
            depart.tension <= departFilters.tensionRange.max
        );

        return { filteredDeparts: filtered };
      }),

    applyQuickFilter: (type) => {
      const { actifs } = get();
      let filteredIds: string[] = [];

      switch (type) {
        case "recent":
          // Actifs mis en service après 2020
          filteredIds = actifs
            .filter((a) => a.anneeMiseEnService >= 2020)
            .map((a) => a.id);
          break;
        case "old":
          // Actifs mis en service avant 2010
          filteredIds = actifs
            .filter((a) => a.anneeMiseEnService < 2010)
            .map((a) => a.id);
          break;
        case "defaillant":
          // Actifs en mauvais état
          filteredIds = actifs
            .filter((a) => a.etatVisuel === "Mauvais")
            .map((a) => a.id);
          break;
        case "highValue":
          // Actifs de forte valorisation (> 70000€)
          filteredIds = actifs
            .filter((a) => a.valorisation > 70000)
            .map((a) => a.id);
          break;
      }

      const selectedActifs = actifs.filter((a) => filteredIds.includes(a.id));
      set({
        selectedActifs,
        isSidebarOpen: selectedActifs.length > 0,
      });
    },

    saveFilterPreset: (name) => {
      const { filters, advancedFilters } = get();
      const preset = {
        id: Date.now().toString(),
        name,
        filters,
        advancedFilters,
        timestamp: new Date(),
      };

      set((state) => ({
        filterHistory: [...state.filterHistory, preset],
      }));
    },

    loadFilterPreset: (presetId) => {
      const { filterHistory } = get();
      const preset = filterHistory.find((p) => p.id === presetId);
      if (preset) {
        set({
          filters: preset.filters,
          advancedFilters: preset.advancedFilters,
        });
        get().applyFilters();
      }
    },

    clearAllFilters: () => {
      set({
        filters: {
          types: [],
          regions: [],
          etatVisuel: [],
          etatFonctionnement: [],
          anneeMiseEnService: { min: 2000, max: 2024 },
        },
        advancedFilters: {
          valorisationRange: { min: 0, max: 1000000 },
          ageRange: { min: 0, max: 25 },
          communes: [],
          quartiers: [],
        },
        searchTerm: "",
        selectedDepart: null,
        selectedActifs: [],
      });
      get().applyFilters();
    },

    // Map Actions
    setMapBounds: (mapBounds) => set({ mapBounds }),
    setMapCenter: (mapCenter: any) => set({ mapCenter }),
    setMapZoom: (mapZoom: any) => set({ mapZoom }),

    centerOnDepart: (departId: string) => {
      const { departs, actifs } = get();
      const depart = departs.find((d) => d.id === departId);
      if (!depart) return;

      const departActifs = depart.actifs
        .map((actifId) => actifs.find((a) => a.id === actifId))
        .filter(Boolean) as Actif[];

      if (departActifs.length > 0) {
        const latitudes = departActifs.map((a) => a.geolocalisation.latitude);
        const longitudes = departActifs.map((a) => a.geolocalisation.longitude);

        const bounds = new L.LatLngBounds([
          [Math.min(...latitudes), Math.min(...longitudes)],
          [Math.max(...latitudes), Math.max(...longitudes)],
        ]);

        set({ mapBounds: bounds });
      }
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

    resetMapView: () => {
      set({
        mapBounds: null,
        mapCenter: { lat: 7.3697, lng: 12.3547 },
        mapZoom: 7,
      });
    },

    // Export functions
    exportSelection: (format) => {
      const { selectedActifs } = get();
      if (selectedActifs.length === 0) return;

      let dataStr: string;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case "csv":
          dataStr = convertToCSV(selectedActifs);
          mimeType = "text/csv";
          fileName = `actifs_selection_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "json":
          dataStr = JSON.stringify(
            {
              actifs: selectedActifs,
              metadata: {
                exportDate: new Date().toISOString(),
                totalCount: selectedActifs.length,
                totalValorisation: selectedActifs.reduce(
                  (sum, a) => sum + a.valorisation,
                  0
                ),
              },
            },
            null,
            2
          );
          mimeType = "application/json";
          fileName = `actifs_selection_${
            new Date().toISOString().split("T")[0]
          }.json`;
          break;
        case "excel":
          dataStr = convertToExcel(selectedActifs);
          mimeType = "application/vnd.ms-excel";
          fileName = `actifs_selection_${
            new Date().toISOString().split("T")[0]
          }.xls`;
          break;
        default:
          return;
      }

      downloadFile(dataStr, mimeType, fileName);
    },

    exportFiltered: (format) => {
      const { filteredActifs } = get();
      if (filteredActifs.length === 0) return;

      let dataStr: string;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case "csv":
          dataStr = convertToCSV(filteredActifs);
          mimeType = "text/csv";
          fileName = `actifs_filtered_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "json":
          dataStr = JSON.stringify(
            {
              actifs: filteredActifs,
              filters: get().filters,
              metadata: {
                exportDate: new Date().toISOString(),
                totalCount: filteredActifs.length,
                totalValorisation: filteredActifs.reduce(
                  (sum, a) => sum + a.valorisation,
                  0
                ),
              },
            },
            null,
            2
          );
          mimeType = "application/json";
          fileName = `actifs_filtered_${
            new Date().toISOString().split("T")[0]
          }.json`;
          break;
        case "excel":
          dataStr = convertToExcel(filteredActifs);
          mimeType = "application/vnd.ms-excel";
          fileName = `actifs_filtered_${
            new Date().toISOString().split("T")[0]
          }.xls`;
          break;
        default:
          return;
      }

      downloadFile(dataStr, mimeType, fileName);
    },

    exportDepart: (departId, format) => {
      const { departs, actifs } = get();
      const depart = departs.find((d) => d.id === departId);
      if (!depart) return;

      const departActifs = depart.actifs
        .map((actifId) => actifs.find((a) => a.id === actifId))
        .filter(Boolean) as Actif[];

      if (departActifs.length === 0) return;

      let dataStr: string;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case "csv":
          dataStr = convertToCSV(departActifs);
          mimeType = "text/csv";
          fileName = `depart_${depart.nom.replace(/[^a-zA-Z0-9]/g, "_")}_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          break;
        case "json":
          dataStr = JSON.stringify(
            {
              depart,
              actifs: departActifs,
              statistics: get().getDepartStatistics(departId),
              exportDate: new Date().toISOString(),
            },
            null,
            2
          );
          mimeType = "application/json";
          fileName = `depart_${depart.nom.replace(/[^a-zA-Z0-9]/g, "_")}_${
            new Date().toISOString().split("T")[0]
          }.json`;
          break;
        case "excel":
          dataStr = convertToExcel(departActifs);
          mimeType = "application/vnd.ms-excel";
          fileName = `depart_${depart.nom.replace(/[^a-zA-Z0-9]/g, "_")}_${
            new Date().toISOString().split("T")[0]
          }.xls`;
          break;
        default:
          return;
      }

      downloadFile(dataStr, mimeType, fileName);
    },

    exportDepartAnalysis: () => {
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

    exportFullReport: () => {
      const actifStats = get().getActifStatistics();
      const departStats = get().getDepartAnalytics();
      const filterInsights = get().getFilterInsights();

      const fullReport = {
        reportDate: new Date().toISOString(),
        actifAnalytics: actifStats,
        departAnalytics: departStats,
        filterInsights,
        summary: {
          totalActifs: actifStats.total,
          totalDeparts: departStats.total,
          totalValorisation: actifStats.valorisationTotale,
          actifsEnService:
            actifStats.total - actifStats.actifsDefaillants.length,
          departsEnService: departStats.enService,
        },
      };

      const dataStr = JSON.stringify(fullReport, null, 2);
      downloadFile(
        dataStr,
        "application/json",
        `rapport_complet_${new Date().toISOString().split("T")[0]}.json`
      );
    },

    importActifs: (data) => {
      // Validation et import des actifs
      const validActifs = data.filter(
        (actif) => actif.id && actif.type && actif.geolocalisation
      );

      set((state) => ({
        actifs: [...state.actifs, ...validActifs],
      }));

      get().applyFilters();
      get().calculateDepartConnections();
    },

    exportMapImage: () => {
      // Implementation pour exporter une image de la carte
      // Nécessiterait l'intégration avec html2canvas ou similar
      console.log("Export d'image de carte - À implémenter");
    },

    // Analytics
    getDepartStatistics: (departId) => {
      const { departs, actifs } = get();

      if (departId) {
        const depart = departs.find((d) => d.id === departId);
        if (!depart) return null;

        const departActifs = depart.actifs
          .map((actifId) => actifs.find((a) => a.id === actifId))
          .filter(Boolean) as Actif[];

        return {
          depart: depart.nom,
          nombreActifs: departActifs.length,
          valorisationTotale: departActifs.reduce(
            (sum, actif) => sum + actif.valorisation,
            0
          ),
          typesActifs: [...new Set(departActifs.map((a) => a.type))],
          regionsDesservies: depart.zonesGeographiques.regions,
          communesDesservies: depart.zonesGeographiques.communes,
          longueurTotale: depart.longueurTotale,
          tension: depart.tension,
          etatGeneral: depart.etatGeneral,
          repartitionParType: departActifs.reduce((acc, actif) => {
            acc[actif.type] = (acc[actif.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          repartitionParEtat: departActifs.reduce((acc, actif) => {
            acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          moyenneAge:
            departActifs.reduce(
              (sum, actif) =>
                sum + (new Date().getFullYear() - actif.anneeMiseEnService),
              0
            ) / departActifs.length || 0,
        };
      }

      // Statistiques générales pour tous les départs
      return departs.map((depart) => get().getDepartStatistics(depart.id));
    },

    getActifStatistics: (): ActifAnalytics => {
      const { actifs, filteredActifs, selectedActifs } = get();
      const currentYear = new Date().getFullYear();

      const actifsPlusRecents = actifs
        .filter((a) => a.anneeMiseEnService >= 2020)
        .sort((a, b) => b.anneeMiseEnService - a.anneeMiseEnService)
        .slice(0, 10);

      const actifsPlusAnciens = actifs
        .filter((a) => a.anneeMiseEnService < 2010)
        .sort((a, b) => a.anneeMiseEnService - b.anneeMiseEnService)
        .slice(0, 10);

      const actifsDefaillants = actifs.filter(
        (a) => a.etatVisuel === "Mauvais" || a.etatVisuel === "Passable"
      );

      return {
        total: actifs.length,
        filtered: filteredActifs.length,
        selected: selectedActifs.length,
        parType: actifs.reduce((acc, actif) => {
          acc[actif.type] = (acc[actif.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        parRegion: actifs.reduce((acc, actif) => {
          acc[actif.region] = (acc[actif.region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        parEtat: actifs.reduce((acc, actif) => {
          acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        valorisationTotale: actifs.reduce(
          (sum, actif) => sum + actif.valorisation,
          0
        ),
        valorisationFiltered: filteredActifs.reduce(
          (sum, actif) => sum + actif.valorisation,
          0
        ),
        valorisationSelected: selectedActifs.reduce(
          (sum, actif) => sum + actif.valorisation,
          0
        ),
        moyenneAge:
          actifs.reduce(
            (sum, actif) => sum + (currentYear - actif.anneeMiseEnService),
            0
          ) / actifs.length,
        actifsPlusRecents,
        actifsPlusAnciens,
        actifsDefaillants,
        repartitionAnnuelle: actifs.reduce((acc, actif) => {
          acc[actif.anneeMiseEnService] =
            (acc[actif.anneeMiseEnService] || 0) + 1;
          return acc;
        }, {} as Record<number, number>),
      };
    },

    getDepartAnalytics: (): DepartAnalytics => {
      const { departs, filteredDeparts } = get();

      return {
        total: departs.length,
        filtered: filteredDeparts.length,
        enService: departs.filter((d) => d.etatGeneral === "En service").length,
        enMaintenance: departs.filter((d) => d.etatGeneral === "Maintenance")
          .length,
        horsService: departs.filter((d) => d.etatGeneral === "Hors service")
          .length,
        longueurTotale: departs.reduce((sum, d) => sum + d.longueurTotale, 0),
        tensionMoyenne:
          departs.reduce((sum, d) => sum + d.tension, 0) / departs.length,
        repartitionParType: departs.reduce((acc, depart) => {
          acc[depart.typeDepart] = (acc[depart.typeDepart] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        repartitionParRegion: departs.reduce((acc, depart) => {
          depart.zonesGeographiques.regions.forEach((region) => {
            acc[region] = (acc[region] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
        actifsParDepart: departs.reduce((acc, depart) => {
          acc[depart.nom] = depart.actifs.length;
          return acc;
        }, {} as Record<string, number>),
      };
    },

    getFilterInsights: () => {
      const { actifs, filteredActifs } = get();

      return {
        filterEfficiency: (filteredActifs.length / actifs.length) * 100,
        mostFilteredTypes: Object.entries(
          filteredActifs.reduce((acc, actif) => {
            acc[actif.type] = (acc[actif.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        )
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5),
        regionCoverage: [...new Set(filteredActifs.map((a) => a.region))]
          .length,
        averageAge:
          filteredActifs.reduce(
            (sum, actif) =>
              sum + (new Date().getFullYear() - actif.anneeMiseEnService),
            0
          ) / filteredActifs.length || 0,
        valueRange: {
          min: Math.min(...filteredActifs.map((a) => a.valorisation)),
          max: Math.max(...filteredActifs.map((a) => a.valorisation)),
          average:
            filteredActifs.reduce((sum, a) => sum + a.valorisation, 0) /
              filteredActifs.length || 0,
        },
      };
    },

    // Comparison & Analysis
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
        },
      };
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

    getMaintenanceReport: () => {
      const { actifs } = get();
      const currentYear = new Date().getFullYear();

      return {
        actifsParEtat: actifs.reduce((acc, actif) => {
          acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        maintenancePrioritaire: actifs
          .filter(
            (a) =>
              a.etatVisuel === "Mauvais" ||
              (a.etatVisuel === "Passable" &&
                currentYear - a.anneeMiseEnService > 15)
          )
          .sort((a, b) => b.valorisation - a.valorisation),
        maintenancePreventive: actifs
          .filter(
            (a) =>
              a.etatVisuel === "Bon" && currentYear - a.anneeMiseEnService > 10
          )
          .sort(
            (a, b) =>
              currentYear -
              a.anneeMiseEnService -
              (currentYear - b.anneeMiseEnService)
          ),
        coutEstimeMaintenance: actifs
          .filter((a) => a.etatVisuel !== "Bon")
          .reduce((sum, a) => sum + a.valorisation * 0.1, 0), // 10% de la valorisation
      };
    },

    getValorizationReport: () => {
      const { actifs, departs } = get();

      return {
        valorisationTotale: actifs.reduce((sum, a) => sum + a.valorisation, 0),
        valorisationParType: actifs.reduce((acc, actif) => {
          acc[actif.type] = (acc[actif.type] || 0) + actif.valorisation;
          return acc;
        }, {} as Record<string, number>),
        valorisationParRegion: actifs.reduce((acc, actif) => {
          acc[actif.region] = (acc[actif.region] || 0) + actif.valorisation;
          return acc;
        }, {} as Record<string, number>),
        valorisationParDepart: departs
          .map((depart) => ({
            nom: depart.nom,
            valorisation: depart.actifs.reduce((sum, actifId) => {
              const actif = actifs.find((a) => a.id === actifId);
              return sum + (actif?.valorisation || 0);
            }, 0),
          }))
          .sort((a, b) => b.valorisation - a.valorisation),
        depreciationEstimee: actifs.reduce((sum, actif) => {
          const age = new Date().getFullYear() - actif.anneeMiseEnService;
          const depreciationRate = Math.min(age * 0.05, 0.8); // Max 80% de dépréciation
          return sum + actif.valorisation * depreciationRate;
        }, 0),
      };
    },

    // Utility functions
    searchActifs: (query) => {
      const { actifs } = get();
      const searchLower = query.toLowerCase();

      return actifs.filter(
        (actif) =>
          actif.designationGenerale.toLowerCase().includes(searchLower) ||
          actif.type.toLowerCase().includes(searchLower) ||
          actif.region.toLowerCase().includes(searchLower) ||
          actif.commune.toLowerCase().includes(searchLower) ||
          actif.quartier.toLowerCase().includes(searchLower) ||
          actif.id.toLowerCase().includes(searchLower)
      );
    },

    getActifsInRadius: (center, radiusKm) => {
      const { actifs } = get();

      return actifs.filter((actif) => {
        const distance = calculateDistance(
          { latitude: center.lat, longitude: center.lng },
          actif.geolocalisation
        );
        return distance <= radiusKm;
      });
    },
    
  };
});

// Helper functions
function convertToCSV(data: Actif[]): string {
  if (data.length === 0) return "";

  const headers = [
    "ID",
    "Type",
    "Désignation",
    "Région",
    "Département",
    "Commune",
    "Quartier",
    "État Visuel",
    "Position Matériel",
    "Année Mise en Service",
    "Latitude",
    "Longitude",
    "Numéro Immo",
    "Numéro Compte",
    "Mode Acquisition",
    "Type de Bien",
    "Nature du Bien",
    "Valorisation",
    "Âge (années)",
  ];

  const currentYear = new Date().getFullYear();
  const rows = data.map((actif) => [
    actif.id,
    actif.type,
    actif.designationGenerale,
    actif.region,
    actif.departement,
    actif.commune,
    actif.quartier,
    actif.etatVisuel,
    actif.positionMateriel,
    actif.anneeMiseEnService,
    actif.geolocalisation.latitude,
    actif.geolocalisation.longitude,
    actif.numeroImmo,
    actif.numeroCompte,
    actif.modeDacquisition,
    actif.TypeDeBien,
    actif.natureDuBien,
    actif.valorisation,
    currentYear - actif.anneeMiseEnService,
  ]);

  return [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
}

function convertToExcel(data: Actif[]): string {
  const headers = [
    "ID",
    "Type",
    "Désignation",
    "Région",
    "Département",
    "Commune",
    "Quartier",
    "État Visuel",
    "Position Matériel",
    "Année Mise en Service",
    "Latitude",
    "Longitude",
    "Numéro Immo",
    "Numéro Compte",
    "Mode Acquisition",
    "Type de Bien",
    "Nature du Bien",
    "Valorisation",
    "Âge (années)",
  ];

  let html = '<table border="1"><tr>';
  headers.forEach((header) => {
    html += `<th style="background-color: #f0f0f0; font-weight: bold;">${header}</th>`;
  });
  html += "</tr>";

  const currentYear = new Date().getFullYear();
  data.forEach((actif) => {
    html += "<tr>";
    [
      actif.id,
      actif.type,
      actif.designationGenerale,
      actif.region,
      actif.departement,
      actif.commune,
      actif.quartier,
      actif.etatVisuel,
      actif.positionMateriel,
      actif.anneeMiseEnService,
      actif.geolocalisation.latitude,
      actif.geolocalisation.longitude,
      actif.numeroImmo,
      actif.numeroCompte,
      actif.modeDacquisition,
      actif.TypeDeBien,
      actif.natureDuBien,
      actif.valorisation,
      currentYear - actif.anneeMiseEnService,
    ].forEach((cell) => {
      html += `<td>${String(cell)}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  return html;
}

function downloadFile(
  dataStr: string,
  mimeType: string,
  fileName: string
): void {
  const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", fileName);
  linkElement.click();
}

// Initialize store
setTimeout(() => {
  const store = useMapStore.getState();
  store.applyFilters();
  store.applyDepartFilters();
  store.calculateDepartConnections();
}, 0);
export default useMapStore;