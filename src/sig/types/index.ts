export interface Actif {
  id: string;
  nom: string;
  type: TypeActif;
  localisation: Localisation;
  etatVisuel: EtatVisuel;
  etatFonctionnement: EtatFonctionnement;
  anneeMiseEnService: number;
  valorisation: number;
  depart: string;
  region: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
  coordonneesLigne?: {
    lat: number;
    lng: number;
  }[];
  description?: string;
  photo?: string;
  derniereInspection?: string;
}

export interface Depart {
  id: string;
  nom: string;
  region: string;
  coordonnees: {
    lat: number;
    lng: number;
  };
  nombreActifs: number;
  valorisationTotale: number;
}

export interface StatistiquesDepart {
  departId: string;
  nombreActifs: number;
  valorisationTotale: number;
  repartitionParType: Record<TypeActif, number>;
  repartitionParEtat: Record<EtatVisuel, number>;
}

export type TypeActif = 
  | 'poste_ht'
  | 'poste_mt'
  | 'poste_bt'
  | 'ligne_ht'
  | 'ligne_mt'
  | 'ligne_bt'
  | 'transformateur'
  | 'compteur'
  | 'pylone'
  | 'cable_souterrain';

export type EtatVisuel = 'bon' | 'moyen' | 'passable' | 'mauvais';
export type EtatFonctionnement = 'en_service' | 'hors_service' | 'maintenance';

export interface Localisation {
  adresse: string;
  ville: string;
  region: string;
  codePostal?: string;
}

export interface Filters {
  types: TypeActif[];
  regions: string[];
  etatsVisuels: EtatVisuel[];
  etatsFonctionnement: EtatFonctionnement[];
  anneeMin: number;
  anneeMax: number;
  searchTerm: string;
  selectedArea?: SelectionArea;
}

export interface SelectionArea {
  type: 'rectangle' | 'circle' | 'polygon';
  bounds?: [number[], number[]]; // [[minLat, minLng], [maxLat, maxLng]]
  center?: [number, number];
  radius?: number;
  points?: [number, number][];
}

export type MapView = 'carte' | 'satellite';

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  selectedActifs: string[];
  includeMap?: boolean;
}

export const ACTIF_TYPES = {
  poste_ht: { label: 'Poste HT', color: '#DC2626', icon: 'zap' },
  poste_mt: { label: 'Poste MT', color: '#EA580C', icon: 'zap' },
  poste_bt: { label: 'Poste BT', color: '#F59E0B', icon: 'zap' },
  ligne_ht: { label: 'Ligne HT', color: '#7C3AED', icon: 'minus' },
  ligne_mt: { label: 'Ligne MT', color: '#2563EB', icon: 'minus' },
  ligne_bt: { label: 'Ligne BT', color: '#0891B2', icon: 'minus' },
  transformateur: { label: 'Transformateur', color: '#059669', icon: 'box' },
  compteur: { label: 'Compteur', color: '#65A30D', icon: 'gauge' },
  pylone: { label: 'Pylône', color: '#6B7280', icon: 'radio' },
  cable_souterrain: { label: 'Câble souterrain', color: '#92400E', icon: 'cable' }
} as const;

export const ETAT_VISUAL_COLORS = {
  bon: '#10B981',
  moyen: '#F59E0B',
  passable: '#EF4444',
  mauvais: '#DC2626'
} as const;

export const REGIONS_CAMEROUN = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral',
  'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'
] as const;