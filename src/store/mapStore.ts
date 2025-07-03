/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { Actif, Filters, Depart } from "@/types";
// Import des données générées par le script Python
import {
  allAssets,
  departs as generatedDeparts,
  statistics,
} from "@/data/electrical_data";
import { LatLng } from "leaflet";
import L from "leaflet";

// Type pour les connexions de départs amélioré
interface DepartConnection {
  depart: Depart;
  actifs: Actif[];
  connections: LatLng[][];
  color: string;
  isVisible: boolean;
  bounds: L.LatLngBounds | null;
  centerPoint: LatLng | null;
  totalLength: number;
  connectionType: "radial" | "linear" | "mesh";
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
  connectivite: Record<string, number>;
  densiteActifs: Record<string, number>;
}

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
  showConnectionAnimation: boolean;
  connectionOpacity: number;

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
  setConnectionOpacity: (opacity: number) => void;
  setShowConnectionAnimation: (show: boolean) => void;

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
  setMapCenter: (center: { lat: number; lng: number }) => void;
  setMapZoom: (zoom: number) => void;
  resetMapView: () => void;
  fitMapToSelection: () => void;
  centerOnActif: (actifId: string) => void;

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
  getGeneratedStatistics: () => any;
}

// Couleurs distinctes pour chaque type de départ
const getDepartColor = (typeDepart: string, departId: string): string => {
  const colors: Record<string, string[]> = {
    Principal: ["#e74c3c", "#c0392b", "#a93226", "#922b21"],
    Résidentiel: ["#3498db", "#2980b9", "#2471a3", "#1f618d"],
    Commercial: ["#f39c12", "#e67e22", "#d68910", "#b7950b"],
    Industriel: ["#9b59b6", "#8e44ad", "#7d3c98", "#6c3483"],
    Secondaire: ["#27ae60", "#229954", "#1e8449", "#186a3b"],
    Mixte: ["#e67e22", "#d35400", "#ba4a00", "#a04000"],
  };

  const typeColors = colors[typeDepart] || [
    "#95a5a6",
    "#7f8c8d",
    "#707b7c",
    "#5d6d7e",
  ];

  // Utiliser l'ID du départ pour choisir une couleur spécifique
  const colorIndex = parseInt(departId.replace(/\D/g, "")) % typeColors.length;
  return typeColors[colorIndex];
};

// Fonction améliorée pour calculer les connexions d'un départ
const calculateConnectionsForDepart = (
  depart: Depart,
  actifs: Actif[]
): {
  connections: LatLng[][];
  bounds: L.LatLngBounds | null;
  centerPoint: LatLng | null;
  totalLength: number;
  connectionType: "radial" | "linear" | "mesh";
} => {
  const departActifs = depart.actifs
    .map((actifId) => actifs.find((a) => a.id === actifId))
    .filter(Boolean) as Actif[];

  if (departActifs.length <= 1) {
    return {
      connections: [],
      bounds: null,
      centerPoint: null,
      totalLength: 0,
      connectionType: "radial",
    };
  }

  const connections: LatLng[][] = [];
  let totalLength = 0;

  // Créer les points LatLng pour tous les actifs
  const actifPoints = departActifs.map((actif) => ({
    actif,
    point: new LatLng(
      actif.geolocalisation.latitude,
      actif.geolocalisation.longitude
    ),
  }));

  // Trouver le poste d'origine (priorité: POSTE_DISTRIBUTION, puis par ID)
  let posteOrigine = actifPoints.find(
    (ap) =>
      ap.actif.type === "POSTE_DISTRIBUTION" ||
      ap.actif.id === depart.posteOrigine
  );

  if (!posteOrigine) {
    // Si pas de poste d'origine identifié, prendre le transformateur le plus central
    const transformateurs = actifPoints.filter(
      (ap) => ap.actif.type === "TRANSFORMATEUR"
    );
    if (transformateurs.length > 0) {
      // Calculer le point le plus central
      const avgLat =
        actifPoints.reduce((sum, ap) => sum + ap.point.lat, 0) /
        actifPoints.length;
      const avgLng =
        actifPoints.reduce((sum, ap) => sum + ap.point.lng, 0) /
        actifPoints.length;

      posteOrigine = transformateurs.reduce((closest, current) => {
        const closestDist =
          Math.abs(closest.point.lat - avgLat) +
          Math.abs(closest.point.lng - avgLng);
        const currentDist =
          Math.abs(current.point.lat - avgLat) +
          Math.abs(current.point.lng - avgLng);
        return currentDist < closestDist ? current : closest;
      });
    } else {
      posteOrigine = actifPoints[0];
    }
  }

  // Déterminer le type de connexion basé sur la géographie et le type de départ
  let connectionType: "radial" | "linear" | "mesh" = "radial";

  if (depart.typeDepart === "Principal" || depart.typeDepart === "Secondaire") {
    // Pour les départs principaux et secondaires, utiliser une structure linéaire
    connectionType = "linear";
  } else if (departActifs.length > 10) {
    // Pour les gros départs, utiliser une structure en maillage
    connectionType = "mesh";
  }

  // Créer les connexions selon le type
  switch (connectionType) {
    case "linear":
      // Connecter en chaîne (ligne droite approximative)
      { const sortedPoints = actifPoints
        .filter((ap) => ap.actif.id !== posteOrigine.actif.id)
        .sort((a, b) => {
          // Trier par distance au poste d'origine
          const distA = calculateDistance(
            { latitude: a.point.lat, longitude: a.point.lng },
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            }
          );
          const distB = calculateDistance(
            { latitude: b.point.lat, longitude: b.point.lng },
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            }
          );
          return distA - distB;
        });

      // Connecter le poste d'origine au premier point
      if (sortedPoints.length > 0) {
        connections.push([posteOrigine.point, sortedPoints[0].point]);
        totalLength += calculateDistance(
          {
            latitude: posteOrigine.point.lat,
            longitude: posteOrigine.point.lng,
          },
          {
            latitude: sortedPoints[0].point.lat,
            longitude: sortedPoints[0].point.lng,
          }
        );
      }

      // Connecter les points en chaîne
      for (let i = 0; i < sortedPoints.length - 1; i++) {
        connections.push([sortedPoints[i].point, sortedPoints[i + 1].point]);
        totalLength += calculateDistance(
          {
            latitude: sortedPoints[i].point.lat,
            longitude: sortedPoints[i].point.lng,
          },
          {
            latitude: sortedPoints[i + 1].point.lat,
            longitude: sortedPoints[i + 1].point.lng,
          }
        );
      }
      break; }

    case "mesh":
      // Connecter chaque actif à ses 2-3 voisins les plus proches
      actifPoints.forEach((sourcePoint) => {
        const otherPoints = actifPoints.filter(
          (ap) => ap.actif.id !== sourcePoint.actif.id
        );
        const nearestNeighbors = otherPoints
          .map((ap) => ({
            point: ap,
            distance: calculateDistance(
              {
                latitude: sourcePoint.point.lat,
                longitude: sourcePoint.point.lng,
              },
              { latitude: ap.point.lat, longitude: ap.point.lng }
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, Math.min(3, otherPoints.length));

        nearestNeighbors.forEach((neighbor) => {
          // Éviter les doublons
          const connectionExists = connections.some(
            (conn) =>
              (conn[0].equals(sourcePoint.point) &&
                conn[1].equals(neighbor.point.point)) ||
              (conn[1].equals(sourcePoint.point) &&
                conn[0].equals(neighbor.point.point))
          );

          if (!connectionExists) {
            connections.push([sourcePoint.point, neighbor.point.point]);
            totalLength += neighbor.distance;
          }
        });
      });
      break;

    default: // radial
      // Connecter tous les actifs au poste d'origine (structure radiale)
      actifPoints.forEach((ap) => {
        if (ap.actif.id !== posteOrigine!.actif.id) {
          connections.push([posteOrigine!.point, ap.point]);
          totalLength += calculateDistance(
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            },
            { latitude: ap.point.lat, longitude: ap.point.lng }
          );
        }
      });
      break;
  }

  // Calculer les bounds et le centre
  const lats = actifPoints.map((ap) => ap.point.lat);
  const lngs = actifPoints.map((ap) => ap.point.lng);

  const bounds = new L.LatLngBounds([
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ]);

  const centerPoint = bounds.getCenter();

  return {
    connections,
    bounds,
    centerPoint,
    totalLength,
    connectionType,
  };
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
    // Initial state avec les données générées
    actifs: allAssets,
    filteredActifs: allAssets,
    selectedActifs: [],

    // Départs des données générées
    departs: generatedDeparts,
    filteredDeparts: generatedDeparts,
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
    showConnectionAnimation: true,
    connectionOpacity: 0.7,

    // Filters basés sur les données réelles
    filters: {
      types: [],
      regions: [],
      etatVisuel: [],
      etatFonctionnement: [],
      anneeMiseEnService: {
        min: Math.min(...allAssets.map((a) => a.anneeMiseEnService)),
        max: Math.max(...allAssets.map((a) => a.anneeMiseEnService)),
      },
    },
    departFilters: {
      types: [],
      regions: [],
      etatGeneral: [],
      tensionRange: {
        min: Math.min(...generatedDeparts.map((d) => d.tension)),
        max: Math.max(...generatedDeparts.map((d) => d.tension)),
      },
    },
    advancedFilters: {
      valorisationRange: {
        min: Math.min(...allAssets.map((a) => a.valorisation)),
        max: Math.max(...allAssets.map((a) => a.valorisation)),
      },
      ageRange: { min: 0, max: 25 },
      communes: [],
      quartiers: [],
    },

    // Map state - Centré sur le Cameroun
    mapBounds: null,
    mapCenter: { lat: 3.848, lng: 11.502 }, // Centre du Cameroun
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

    // Actions - Départs améliorées
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
        .filter(Boolean) as Actif[];

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
      const connections: DepartConnection[] = departs.map((depart) => {
        const connectionData = calculateConnectionsForDepart(depart, actifs);

        return {
          depart,
          actifs: depart.actifs
            .map((actifId) => actifs.find((a) => a.id === actifId))
            .filter(Boolean) as Actif[],
          connections: connectionData.connections,
          color: getDepartColor(depart.typeDepart, depart.id),
          isVisible: true,
          bounds: connectionData.bounds,
          centerPoint: connectionData.centerPoint,
          totalLength: connectionData.totalLength,
          connectionType: connectionData.connectionType,
        };
      });

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

    setConnectionOpacity: (connectionOpacity) => set({ connectionOpacity }),
    setShowConnectionAnimation: (showConnectionAnimation) =>
      set({ showConnectionAnimation }),

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
              actif.designationGenerale?.toLowerCase().includes(searchLower) ||
              actif.type.toLowerCase().includes(searchLower) ||
              actif.region.toLowerCase().includes(searchLower) ||
              actif.commune?.toLowerCase().includes(searchLower) ||
              actif.quartier?.toLowerCase().includes(searchLower)
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
          // Actifs de forte valorisation (> 500000)
          filteredIds = actifs
            .filter((a) => a.valorisation > 500000)
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
      const { actifs, departs } = get();
      set({
        filters: {
          types: [],
          regions: [],
          etatVisuel: [],
          etatFonctionnement: [],
          anneeMiseEnService: {
            min: Math.min(...actifs.map((a) => a.anneeMiseEnService)),
            max: Math.max(...actifs.map((a) => a.anneeMiseEnService)),
          },
        },
        advancedFilters: {
          valorisationRange: {
            min: Math.min(...actifs.map((a) => a.valorisation)),
            max: Math.max(...actifs.map((a) => a.valorisation)),
          },
          ageRange: { min: 0, max: 25 },
          communes: [],
          quartiers: [],
        },
        departFilters: {
          types: [],
          regions: [],
          etatGeneral: [],
          tensionRange: {
            min: Math.min(...departs.map((d) => d.tension)),
            max: Math.max(...departs.map((d) => d.tension)),
          },
        },
        searchTerm: "",
        departSearchTerm: "",
        selectedDepart: null,
        selectedActifs: [],
      });
      get().applyFilters();
      get().applyDepartFilters();
    },

    // Map Actions
    setMapBounds: (mapBounds) => set({ mapBounds }),
    setMapCenter: (mapCenter) => set({ mapCenter }),
    setMapZoom: (mapZoom) => set({ mapZoom }),

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
        mapCenter: { lat: 3.848, lng: 11.502 }, // Centre du Cameroun
        mapZoom: 7,
      });
    },

    // Export functions améliorées
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
                statistics: get().getActifStatistics(),
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
      const generatedStats = get().getGeneratedStatistics();

      const fullReport = {
        reportDate: new Date().toISOString(),
        actifAnalytics: actifStats,
        departAnalytics: departStats,
        filterInsights,
        generatedStatistics: generatedStats,
        summary: {
          totalActifs: actifStats.total,
          totalDeparts: departStats.total,
          totalValorisation: actifStats.valorisationTotale,
          actifsEnService:
            actifStats.total - actifStats.actifsDefaillants.length,
          departsEnService: departStats.enService,
          regionsDesservies: Object.keys(actifStats.parRegion).length,
          typesActifs: Object.keys(actifStats.parType).length,
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

    // Analytics améliorées avec les données générées
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
          .filter(Boolean) as Actif[];

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
      const { departs, filteredDeparts, departConnections } = get();

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
        connectivite: departConnections.reduce((acc, conn) => {
          acc[conn.connectionType] = (acc[conn.connectionType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        densiteActifs: departConnections.reduce((acc, conn) => {
          const density = conn.actifs.length / (conn.totalLength || 1);
          acc[conn.depart.nom] = density;
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

    // Nouvelle fonction pour récupérer les statistiques générées
    getGeneratedStatistics: () => {
      return statistics;
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
          densiteMoyenne:
            comparisons.reduce((sum, d) => sum + d.densiteActifs, 0) /
            comparisons.length,
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

// Helper functions améliorées
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
    "Valeur Acquisition",
    "Âge (années)",
    "Taux Amortissement",
    "Durée de vie estimée",
  ];

  const currentYear = new Date().getFullYear();
  const rows = data.map((actif) => [
    actif.id,
    actif.type,
    actif.designationGenerale,
    actif.region,
    actif.departement,
    actif.commune || "",
    actif.quartier || "",
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
    actif.valeurAcquisition || "",
    currentYear - actif.anneeMiseEnService,
    actif.tauxAmortissementAnnuel || "",
    actif.dureeDeVieEstimative || "",
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
    "Valeur Acquisition",
    "Âge (années)",
    "Taux Amortissement (%)",
    "Durée de vie estimée (années)",
  ];

  let html = '<table border="1"><tr>';
  headers.forEach((header) => {
    html += `<th style="background-color: #f0f0f0; font-weight: bold; padding: 5px;">${header}</th>`;
  });
  html += "</tr>";

  const currentYear = new Date().getFullYear();
  data.forEach((actif, index) => {
    const rowColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
    html += `<tr style="background-color: ${rowColor};">`;
    [
      actif.id,
      actif.type,
      actif.designationGenerale,
      actif.region,
      actif.departement,
      actif.commune || "",
      actif.quartier || "",
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
      actif.valeurAcquisition || "",
      currentYear - actif.anneeMiseEnService,
      actif.tauxAmortissementAnnuel || "",
      actif.dureeDeVieEstimative || "",
    ].forEach((cell) => {
      html += `<td style="padding: 3px; border: 1px solid #ddd;">${String(
        cell
      )}</td>`;
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
  linkElement.style.display = "none";
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}

// Initialize store avec les données générées
setTimeout(() => {
  const store = useMapStore.getState();
  console.log("🚀 Initialisation du store avec les données générées");
  console.log(`📊 ${store.actifs.length} actifs chargés`);
  console.log(`🔌 ${store.departs.length} départs chargés`);

  // Appliquer les filtres initiaux
  store.applyFilters();
  store.applyDepartFilters();

  // Calculer les connexions des départs
  store.calculateDepartConnections();

  console.log("✅ Store initialisé avec succès");
}, 0);

export default useMapStore;
