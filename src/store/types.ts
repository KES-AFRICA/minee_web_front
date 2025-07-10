// src/store/types.ts
import { LatLng, LatLngBounds } from "leaflet";
import type { Actif, Filters, Depart } from "@/types";

// Type pour les connexions de départs
export interface DepartConnection {
  depart: Depart;
  actifs: Actif[];
  connections: LatLng[][];
  color: string;
  isVisible: boolean;
  bounds: LatLngBounds | null;
  centerPoint: LatLng | null;
  totalLength: number;
  connectionType: "radial" | "linear" | "mesh";
}

// Types pour les analytics avancés
export interface ActifAnalytics {
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

export interface DepartAnalytics {
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

// États du store découpés en slices
export interface ActifsState {
  actifs: Actif[];
  filteredActifs: Actif[];
  selectedActifs: Actif[];
}

export interface DepartsState {
  departs: Depart[];
  filteredDeparts: Depart[];
  selectedDepart: string | null;
  departConnections: DepartConnection[];
  favoriteDeparts: string[];
}

export interface UIState {
  isSidebarOpen: boolean;
  isDrawingMode: string | false;
  searchTerm: string;
  departSearchTerm: string;
  showAllActifs: boolean;
  showDepartConnections: boolean;
  showDepartLabels: boolean;
  autoSelectFiltered: boolean;
  showAnalytics: boolean;
  showConnectionAnimation: boolean;
  connectionOpacity: number;
}

export interface FiltersState {
  filters: Filters;
  departFilters: {
    types: string[];
    regions: string[];
    etatGeneral: string[];
    tensionRange: { min: number; max: number };
  };
  advancedFilters: {
    valorisationRange: { min: number; max: number };
    ageRange: { min: number; max: number };
    communes: string[];
    quartiers: string[];
  };
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
}

export interface MapState {
  mapBounds: LatLngBounds | null;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;
}

export interface HistoryState {
  recentSelections: Array<{
    actifs: string[];
    timestamp: Date;
    name?: string;
  }>;
}

// État global qui combine tous les slices
export interface RootState
  extends ActifsState,
    DepartsState,
    UIState,
    FiltersState,
    MapState,
    HistoryState {}
