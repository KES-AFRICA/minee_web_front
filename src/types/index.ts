export interface MapElement {
  id: string;
  name: string;
  type: 'restaurant' | 'hotel' | 'attraction' | 'shop';
  position: [number, number];
  description: string;
  rating: number;
  price: number;
  image: string;
  category: string;
}

export interface FilterState {
  types: string[];
  priceRange: [number, number];
  ratingMin: number;
  searchQuery: string;
}

export interface SelectionArea {
  bounds: [[number, number], [number, number]] | null;
  shape: 'rectangle' | 'polygon' | 'circle' | null;
  coordinates: [number, number][] | null;
}// Types pour les données d'inventaire des actifs électriques

// Types communs
export interface BaseActif {
  id: string;
  date: string;
  personnelKES: string;
  personnelENEO: string;
  personnelMINEE: string;
  personnelARSEL: string;
  region: string;
  departement: string;
  arrondissement: string;
  commune: string;
  quartier: string;
  rue: string;
  precisionLieu?: string;
  codificationDecoupageENEO: string;
  photo: string[];
  geolocalisation: {
    latitude: number;
    longitude: number;
  };
  valorisation: number;
  positionMateriel: 'Magasin' | 'Terrain';
  etatVisuel: 'Bon' | 'Moyen' | 'Passable' | 'Mauvais';
  numeroImmo: string;
  nouveauNumeroImmo?: string;
  numeroCompte: string;
  libelleCompte: string;
  modeDacquisition: 'directe' | 'par projet' | 'par immobilisation en cours';
  TypeDeBien: 'bien privée'|'bien de retour'|'bien de reprise'|'bien cdi';
  natureDuBien: 'Concédé Etat' | 'privée (ENEO)' | 'Tier privée' | 'Tier AER' | 'Tier MINEE' | 'Tier MUNICIPALITE' | 'Tier industriel' | 'Tier Riverains' | 'Tier MINEPAT';
  
  //natureDuBien: 'Concédé 2001' | 'ENEO' | 'Tier privée' | 'Tier AER' | 'Tier MINEE' | 'Tier MUNICIPALITE' | 'Tier industriel' | 'Tier Riverains' | 'Tier MINEPAT';
  designationGenerale: string;
  anneeMiseEnService: number;
}

// Ligne Aérienne
export interface LigneAerienne extends BaseActif {
  type: 'LIGNE_AERIENNE';
  numeroLigne: string;
  origineLigne: string;
  identificationDepart: string;
  tension: number;
  etatFonctionnement: 'En service' | 'Hors service';
  typologieLigne: 'Principale' | 'Secondaire' | 'Dérivation' | 'Branchement';
  typeDistribution: 'Monophasé' | 'Triphasé';
  structureReseau: 'Radial' | 'Bouclé';
  typeCable: 'Torsadé' | 'Cuivre' | 'Alu/Acier' | 'Almélec';
  sectionConducteur: number;
  conducteur: 'Nu' | 'Isolé';
  typeIsolateurs: string;
  etatIsolateurs: string;
  longueurLigne: number;
  observationEtat: string;
  nombreSupports: number;
  supports: Support[];
}

// Ligne Souterraine
export interface LigneSouterraine extends BaseActif {
  type: 'LIGNE_SOUTERRAINE';
  numeroLigne: string;
  origineLigne: string;
  identificationDepart: string;
  tension: number;
  etatFonctionnement: 'En service' | 'Hors service';
  typologieLigne: 'Principale' | 'Secondaire' | 'Dérivation' | 'Branchement';
  typeDistribution: 'Monophasé' | 'Triphasé';
  structureReseau: 'Radial' | 'Bouclé';
  typeCable: 'Torsadé' | 'Cuivre' | 'Alu/Acier' | 'Almélec';
  sectionConducteur: number;
  conducteur: 'Nu' | 'Isolé';
  typeIsolateurs: string;
  etatIsolateurs: string;
  longueurLigne: number;
  observationEtat: string;
  nombreSupports: number;
  supports: Support[];
}

// Poste de Distribution
export interface PosteDistribution extends BaseActif {
  type: 'POSTE_DISTRIBUTION';
  nomPoste: string;
  departMT: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typePoste: string;
  numeroSerie: string;
  niveauTension: number;
  conditionsFonctionnement: string;
  raisonDeclassement?: string;
  principauxIncidents: string;
  typeMontage: 'Sol' | 'Poteau' | 'Cabine' | 'Struct. Acier';
  genieCivil: string;
  dimensionPoste: string;
  porte: string;
  serrure: string;
  observations: string;
}

// Tableau BT
export interface TableauBT extends BaseActif {
  type: 'TABLEAU_BT';
  nomPoste: string;
  departMT: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typeTableau: string;
  numeroSerie: string;
  niveauTension: number;
  etatFonctionnement: 'En service' | 'Hors service';
  raisonsHorsService?: string;
  principauxIncidents: string;
  nombreDeparts: number;
  nombreDepartsEquipes: number;
  tension: number;
  typeMontage: string;
}

// Transformateur
export interface Transformateur extends BaseActif {
  type: 'TRANSFORMATEUR';
  nomPoste: string;
  departMT: string;
  ensembleFonctionnel: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typeTransformateur: string;
  numeroSerie: string;
  poidsTotal: number;
  poidsDielectrique: number;
  poidsDecuivrage: number;
  etatFonctionnement: 'En service' | 'Hors service';
  raisonsHorsService?: string;
  principauxIncidents: string;
  typeTransfo: 'Transfo de puissance' | 'Transfo de distr' | 'Transfo de tension' | 'Transfo de courant' | 'Combiné TT -TC' | 'TSA BPN' | 'Combiné TSA - BPN' | 'Transfo MT/MT' | 'Transfo MT/BT';
  dielectrique: 'Huile' | 'PCB' | 'Sec';
  typeMontage: 'Sol' | 'Poteau' | 'Cabine' | 'Struct. Acier';
  coordonneesGeographiques: string;
  tensionPrimaire: number;
  tensionSecondaire: number;
  puissance: number;
  courantPrimaire: number;
  courantSecondaire: number;
  fuitesDielectriques: 'Aucune fuite' | 'Traces de fuites' | 'Fuites avérées';
  typeRefroidissement: 'ONAN' | 'ONAF' | 'OFAF' | 'ODAF';
  protectionMT: 'Fusible' | 'Disjoncteur' | 'Cellule' | 'Inter-fusible';
  protectionBT: 'Disj haut de poteau' | 'Disjoncteur BT' | 'Autres';
  observations: string;
}

// Cellule Distribution Secondaire
export interface CelluleDistributionSecondaire extends BaseActif {
  type: 'CELLULE_DISTRIBUTION_SECONDAIRE';
  nomPoste: string;
  departMT: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typeCellule: string;
  numeroSerie: string;
  niveauTension: number;
  intensiteCourtCircuit: number;
  calibreJeuBarre: number;
  etatFonctionnement: 'En service' | 'Hors service';
  raisonsHorsService?: string;
  principauxIncidents: string;
  typeCelluleDistribution: string;
  tension: number;
  calibre: number;
  modele: string;
  typeMontage: string;
  caissonBT: string;
  typeRelaisProtection: string;
}

// Cellule Distribution Primaire
export interface CelluleDistributionPrimaire extends BaseActif {
  type: 'CELLULE_DISTRIBUTION_PRIMAIRE';
  nomPoste: string;
  departMT: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typeCellule: string;
  numeroSerie: string;
  niveauTension: number;
  intensiteCourtCircuit: number;
  calibreJeuBarre: number;
  etatFonctionnement: 'En service' | 'Hors service';
  raisonsHorsService?: string;
  principauxIncidents: string;
  equipements: {
    disjoncteur: boolean;
    interrupteur: boolean;
    mesure: boolean;
    protection: boolean;
    transfo: boolean;
  };
  disjoncteur: {
    type: 'Fixe' | 'Débrochable';
    calibre: number;
    modele: string;
  };
  modeleVM6: string;
  modeleSM6: string;
  tension: number;
  calibreBT: number;
  typeRelais: string;
  modeleRelais: string;
  typeMontage: string;
  surGaineTechnique: boolean;
  caissonBT: string;
  coordonneesGeographiques: string;
  observations: string;
  numeroPhotos: string;
  numeroTAG: string;
}

// Support
export interface Support extends BaseActif {
  id: string;
  type: 'SUPPORT';
  region: string;
  departement: string;
  arrondissement: string;
  commune: string;
  quartier: string;
  rue: string;
  numeroLigne: string;
  numeroImmo: string;
  nouveauNumeroImmo?: string;
  numeroCompte: string;
  libelleCompte: string;
  designationGenerale: string;
  anneeImplantation: number;
  nombreSupports: number;
  classeSupport: string;
  effortTeteSupport: number;
  utilisation: 'MT' | 'BT';
  tension: number;
  raisonsMauvaisEtat?: string;
  observations: string;
  structure: {
    simple: boolean;
    jumele: boolean;
    contrefiche: boolean;
    portique: boolean;
    transformateur: boolean;
    IACM: boolean;
    PMR: boolean;
    IACT: boolean;
    fusesave: boolean;
    shotFuses: boolean;
    isolateurs: boolean;
    comptage: boolean;
  };
  materiaux: {
    bois: { quantite: number; etat: 'Bon' | 'Mauvais'; observation: string; geolocalisation: string; photo: string; };
    beton: { quantite: number; etat: 'Bon' | 'Mauvais'; observation: string; geolocalisation: string; photo: string; };
    metallique: { quantite: number; etat: 'Bon' | 'Mauvais'; observation: string; geolocalisation: string; photo: string; };
    treillis: { quantite: number; etat: 'Bon' | 'Mauvais'; observation: string; geolocalisation: string; photo: string; };
  };
}

// OCR (Organe de Coupure Réenclencheur)
export interface OCR extends BaseActif {
  type: 'OCR';
  numeroLigne: string;
  anneeFabrication: number;
  fabricant: string;
  marque: string;
  typeOCR: string;
  numeroSerie: string;
  niveauTension: number;
  intensiteNominale: number;
  pouvoirCoupure: number;
  etatFonctionnement: 'En service' | 'Hors service';
  raisonsHorsService?: string;
  principauxIncidents: string;
  typeMontage: 'Poteau' | 'Struct. Acier';
  tension: number;
  calibre: number;
  observations: string;
}

// Point de Livraison
export interface PointLivraison extends BaseActif {
  type: 'POINT_LIVRAISON';
  numeroLigne: string;
  client: string;
  numeroContrat: string;
  typeComptage: 'MT' | 'BT';
  anneeFabricationCompteur: number;
  natureComptage: 'PREPAYEE' | 'POST PAYE';
  numeroCompteur: string;
  typeActivite: string;
  tension: number;
  typeConstruction: string;
  sectionConducteur: number;
  raisonsMauvaisEtat?: string;
  observations: string;
}

// Équipement en Réserve/Stock
export interface EquipementStock extends BaseActif {
  type: 'EQUIPEMENT_STOCK';
  numeroLigne: string;
  anneeMiseEnStock: number;
  nomEquipement: string;
  caracteristiques: string;
  raisonsMauvaisEtat?: string;
  observations?: string;
}

// Union type pour tous les actifs
export type Actif = LigneAerienne | LigneSouterraine | PosteDistribution | TableauBT | 
            Transformateur | CelluleDistributionSecondaire | CelluleDistributionPrimaire | 
            Support | OCR | PointLivraison | EquipementStock;


// Interface pour représenter un départ
export interface Depart {
  id: string;
  nom: string;
  posteOrigine: string; // ID du poste de distribution d'origine
  // Un départ peut traverser plusieurs zones géographiques
  zonesGeographiques: {
    regions: string[];
    departements: string[];
    communes: string[];
    quartiers: string[];
  };
  tension: number;
  valorisation: number;
  longueurTotale: number; // Longueur réelle en kilomètres
  dateCreation: string;
  etatGeneral: 'En service' | 'Hors service' | 'Maintenance';
  typeDepart: 'Principal' | 'Secondaire' | 'Industriel' | 'Résidentiel' | 'Commercial';
  actifs: string[]; // IDs des actifs connectés à ce départ
}

// Interface pour les statistiques par départ
export interface StatistiquesDepart {
  nombreActifs: number;
  typesActifs: Record<string, number>;
  zonesGeographiques: {
    regions: string[];
    departements: string[];
    communes: string[];
    quartiers: string[];
  };

  etatsService: Record<string, number>;
  tensionsUtilisees: number[];
  repartitionParType: Record<string, number>;
  longueurTotale: number;
  densiteActifs: number; // actifs par km
  couverture: {
    nombreRegions: number;
    nombreDepartements: number;
    nombreCommunes: number;
    nombreQuartiers: number;
  };
}
