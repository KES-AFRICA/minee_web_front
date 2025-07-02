export type Asset = {
  id: string;
  name: string;
  type: "Transformateur" | "Ligne" | "Poste source" | "Compteur" | "Générateur";
  location: string;
  commune: string;
  zone: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  specifications?: string;
  maintenanceHistory?: MaintenanceRecord[];
  depreciation?: number;
  estimatedLifespan?: number;
  currentAge?: number;
  status: "Actif" | "En maintenance" | "Hors service" | "En panne";
  installationDate: string;
  lastInspection: string;
  value: number;
  criticality: "Haute" | "Moyenne" | "Basse";
  departId?: string[];
};

export type Depart = {
  id: string;
  name?: string;
  actifs?: Asset[];
  poste?: Asset;
  criticality: "Haute" | "Moyenne" | "Basse";
};
export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  technician: string;
}
export interface AssetsProps {
  id: string;
  name: string;
  type: string;
  location: string;
  commune: string;
  zone: string;
  status: string;
  value: number;
  criticality: string;
  installationDate: string;
  lastInspection: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  specifications?: string;
  maintenanceHistory?: MaintenanceRecord[];
  depreciation?: number;
  estimatedLifespan?: number;
  currentAge?: number;
}
