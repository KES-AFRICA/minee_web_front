export type AssetType = 'Transformateur' | 'Ligne' | 'Poste' | 'Compteur' | 'Générateur';

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  position: [number, number];
  status: 'Actif' | 'En maintenance' | 'Hors service' | 'En alerte';
  capacity?: string;
  length?: string;
  lastInspection: string;
  nextMaintenance: string;
  region: string;
  criticality: 'Haute' | 'Moyenne' | 'Faible';
  installationDate: string;
  temperature?: number;
  load?: number;
  voltage?: number;
  alerts?: Alert[];
  specifications?: Record<string, string | number | boolean>;
};

export type Alert = {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
};

export type FilterState = {
  type: string;
  region: string;
  criticality: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  search: string;
};

export type MapViewState = {
  showHeatmap: boolean;
  showClusters: boolean;
  showMeasurements: boolean;
  selectedAssets: string[];
  compareMode: boolean;
};
