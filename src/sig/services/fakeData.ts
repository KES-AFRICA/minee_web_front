import { type Actif, type Depart, type TypeActif, type EtatVisuel, type EtatFonctionnement, REGIONS_CAMEROUN } from '../types';

// Coordonnées approximatives des régions du Cameroun
const REGION_COORDINATES: Record<string, { lat: number; lng: number; bounds: [number, number, number, number] }> = {
  'Centre': { lat: 3.8667, lng: 11.5167, bounds: [2.5, 10.5, 5.2, 12.5] },
  'Littoral': { lat: 4.0511, lng: 9.7679, bounds: [3.0, 8.5, 5.0, 10.5] },
  'Ouest': { lat: 5.4667, lng: 10.4167, bounds: [4.5, 9.5, 6.4, 11.3] },
  'Nord-Ouest': { lat: 6.2167, lng: 10.1500, bounds: [5.4, 9.0, 7.0, 11.0] },
  'Sud-Ouest': { lat: 4.1500, lng: 9.2333, bounds: [3.8, 8.3, 6.6, 10.2] },
  'Sud': { lat: 2.8000, lng: 11.5167, bounds: [1.0, 9.4, 4.5, 16.2] },
  'Est': { lat: 4.3667, lng: 13.5833, bounds: [1.0, 11.2, 7.4, 16.2] },
  'Adamaoua': { lat: 6.8333, lng: 12.3833, bounds: [6.0, 11.0, 8.0, 15.2] },
  'Nord': { lat: 8.5000, lng: 13.3500, bounds: [7.0, 11.9, 10.5, 15.2] },
  'Extrême-Nord': { lat: 10.5833, lng: 14.2000, bounds: [10.0, 13.0, 13.1, 16.2] }
};

const VILLES_PAR_REGION: Record<string, string[]> = {
  'Centre': ['Yaoundé', 'Mbalmayo', 'Obala', 'Mfou', 'Ntui'],
  'Littoral': ['Douala', 'Edéa', 'Nkongsamba', 'Kribi', 'Loum'],
  'Ouest': ['Bafoussam', 'Dschang', 'Mbouda', 'Foumban', 'Bandjoun'],
  'Nord-Ouest': ['Bamenda', 'Wum', 'Ndop', 'Kumbo', 'Bali'],
  'Sud-Ouest': ['Buéa', 'Limbé', 'Kumba', 'Mamfé', 'Tiko'],
  'Sud': ['Ebolowa', 'Kribi', 'Sangmélima', 'Ambam', 'Mvangan'],
  'Est': ['Bertoua', 'Batouri', 'Yokadouma', 'Abong-Mbang', 'Kéndé'],
  'Adamaoua': ['Ngaoundéré', 'Meiganga', 'Banyo', 'Tignère', 'Tibati'],
  'Nord': ['Garoua', 'Maroua', 'Guider', 'Figuil', 'Poli'],
  'Extrême-Nord': ['Maroua', 'Kousseri', 'Mora', 'Yagoua', 'Kaélé']
};

function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateCoordinatesInRegion(region: string): { lat: number; lng: number } {
  const regionData = REGION_COORDINATES[region];
  if (!regionData) {
    // Default to Centre region if region not found
    return { lat: 3.8667, lng: 11.5167 };
  }
  
  const [minLat, minLng, maxLat, maxLng] = regionData.bounds;
  return {
    lat: randomInRange(minLat, maxLat),
    lng: randomInRange(minLng, maxLng)
  };
}

function generateActif(index: number): Actif {
  const types: TypeActif[] = [
    'poste_ht', 'poste_mt', 'poste_bt', 'ligne_ht', 'ligne_mt', 
    'ligne_bt', 'transformateur', 'compteur', 'pylone', 'cable_souterrain'
  ];
  
  const etatsVisuels: EtatVisuel[] = ['bon', 'moyen', 'passable', 'mauvais'];
  const etatsFonctionnement: EtatFonctionnement[] = ['en_service', 'hors_service', 'maintenance'];
  
  const type = randomFromArray(types);
  const region = randomFromArray([...REGIONS_CAMEROUN]);
  const ville = randomFromArray(VILLES_PAR_REGION[region]);
  const coordonnees = generateCoordinatesInRegion(region);
  
  // Générer des coordonnées supplémentaires pour les lignes et câbles
  let coordonneesLigne: { lat: number; lng: number }[] | undefined;
  if (['ligne_ht', 'ligne_mt', 'ligne_bt', 'cable_souterrain'].includes(type)) {
    const nombrePoints = Math.floor(randomInRange(2, 5));
    coordonneesLigne = [coordonnees];
    
    for (let i = 1; i < nombrePoints; i++) {
      const lastPoint = coordonneesLigne[i - 1];
      const newPoint = {
        lat: lastPoint.lat + randomInRange(-0.01, 0.01),
        lng: lastPoint.lng + randomInRange(-0.01, 0.01)
      };
      coordonneesLigne.push(newPoint);
    }
  }
  
  const etatVisuel = randomFromArray(etatsVisuels);
  const etatFonctionnement = randomFromArray(etatsFonctionnement);
  const anneeMiseEnService = Math.floor(randomInRange(1990, 2024));
  
  // Valorisation basée sur le type et l'âge
  const baseValue = {
    'poste_ht': 500000,
    'poste_mt': 200000,
    'poste_bt': 50000,
    'ligne_ht': 100000,
    'ligne_mt': 30000,
    'ligne_bt': 10000,
    'transformateur': 80000,
    'compteur': 5000,
    'pylone': 25000,
    'cable_souterrain': 40000
  }[type];
  
  const ageDepreciation = Math.max(0.3, 1 - (2024 - anneeMiseEnService) * 0.02);
  const stateMultiplier = {
    'bon': 1,
    'moyen': 0.8,
    'passable': 0.6,
    'mauvais': 0.4
  }[etatVisuel];
  
  const valorisation = Math.floor(baseValue * ageDepreciation * stateMultiplier);
  
  return {
    id: `actif_${index + 1}`,
    nom: `${type.toUpperCase()}_${ville}_${index + 1}`,
    type,
    localisation: {
      adresse: `Rue ${Math.floor(Math.random() * 100) + 1}, ${ville}`,
      ville,
      region,
      codePostal: `${Math.floor(Math.random() * 90000) + 10000}`
    },
    coordonnees,
    etatVisuel,
    etatFonctionnement,
    anneeMiseEnService,
    valorisation,
    depart: `DEPART_${region.toUpperCase()}_${Math.floor(Math.random() * 5) + 1}`,
    region,
    coordonneesLigne,
    description: `Actif électrique de type ${type} installé en ${anneeMiseEnService}`,
    derniereInspection: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
}

function generateDeparts(): Depart[] {
  return [...REGIONS_CAMEROUN].map((region, index) => {
    const coordonnees = REGION_COORDINATES[region];
    return {
      id: `depart_${index + 1}`,
      nom: `Départ ${region}`,
      region,
      coordonnees: coordonnees ? { lat: coordonnees.lat, lng: coordonnees.lng } : { lat: 0, lng: 0 },
      nombreActifs: Math.floor(randomInRange(3, 12)),
      valorisationTotale: Math.floor(randomInRange(500000, 5000000))
    };
  });
}

// Générer les données factices
export const fakeActifs: Actif[] = Array.from({ length: 75 }, (_, index) => generateActif(index));
export const fakeDeparts: Depart[] = generateDeparts();

// Fonction pour obtenir les statistiques par départ
export function getStatistiquesByDepart(actifs: Actif[]): unknown {
  return fakeDeparts.map(depart => {
    const actifsDepart = actifs.filter(actif => actif.depart === depart.nom);
    
    const repartitionParType: Record<string, number> = {};
    const repartitionParEtat: Record<string, number> = {};
    
    actifsDepart.forEach(actif => {
      repartitionParType[actif.type] = (repartitionParType[actif.type] || 0) + 1;
      repartitionParEtat[actif.etatVisuel] = (repartitionParEtat[actif.etatVisuel] || 0) + 1;
    });
    
    return {
      departId: depart.id,
      nombreActifs: actifsDepart.length,
      valorisationTotale: actifsDepart.reduce((sum, actif) => sum + actif.valorisation, 0),
      repartitionParType,
      repartitionParEtat
    };
  });
}