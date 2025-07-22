import type {
  Actif,
  Depart,
  LigneAerienne,
  PosteDistribution,
  Transformateur,
  Support,
  OCR,
  PointLivraison,
  TableauBT,
  BaseActif,
} from '@/types'; // Importez vos types depuis votre fichier de types
import { geoJson } from './geod';
 // Importez vos types depuis votre fichier de types

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
  properties: {
    id: string;
    name: string;
    length: number;
    pointInterval: number;
    createdAt: string;
    updatedAt: string;
    points: any[];
  };
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

class DepartGenerator {
  private quartiers = ["Palmiers", "Bonamoussadi", "Makepe", "Bassa", "Logpom"];
  private communes = ["Douala I",
    "Douala II",
    "Douala III",
    "Douala IV",
    "Douala V",
    "Douala VI",
    "Edéa I",
    "Edéa II",
    "Dibombari"];
  private fabricants = ["Schneider Electric", "ABB", "Siemens", "GE", "Legrand"];
  private marques = ["Schneider", "ABB", "Siemens", "General Electric"];

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Calcule la distance entre deux points GPS
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Rayon de la Terre en mètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Génère les propriétés de base communes à tous les actifs
   */
  private generateBaseActif(coordinates: [number, number], index: number): Omit<BaseActif, 'id' | 'type'> {
    const currentYear = new Date().getFullYear();
    const anneeMiseEnService = currentYear - Math.floor(Math.random() * 15);
    const valeurAcquisition = 50000 + Math.random() * 200000;
    const dureeVie = 25 + Math.floor(Math.random() * 15);
    const tauxAmortissement = 100 / dureeVie;
    const ageActuel = currentYear - anneeMiseEnService;
    const valorisation = valeurAcquisition * (1 - (tauxAmortissement * ageActuel / 100));

    return {
      date: new Date().toISOString().split('T')[0],
      personnelKES: `KES${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      personnelENEO: `ENEO${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      personnelMINEE: `MINEE${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      personnelARSEL: `ARSEL${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé " + (Math.floor(Math.random() * 7) + 1),
      commune: this.communes[Math.floor(Math.random() * this.communes.length)],
      quartier: this.quartiers[Math.floor(Math.random() * this.quartiers.length)],
      rue: `Rue ${Math.floor(Math.random() * 100)}`,
      precisionLieu: `Point ${index}`,
      codificationDecoupageENEO: `ENEO-YDE-${index.toString().padStart(4, '0')}`,
      photo: [`photo_${this.generateId()}.jpg`],
      geolocalisation: {
        latitude: coordinates[1],
        longitude: coordinates[0]
      },
      valorisation: Math.round(valorisation),
      valeurAcquisition: Math.round(valeurAcquisition),
      anneeMiseEnService,
      dureeDeVieEstimative: dureeVie,
      tauxAmortissementAnnuel: Math.round(tauxAmortissement * 100) / 100,
      positionMateriel: Math.random() > 0.8 ? "Magasin" : "Terrain",
      etatVisuel: ["Bon", "Moyen", "Passable", "Mauvais"][Math.floor(Math.random() * 4)] as any,
      numeroImmo: `IMM${index.toString().padStart(6, '0')}`,
      numeroCompte: `CPT${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      libelleCompte: "Equipements électriques",
      modeDacquisition: ["directe", "par projet", "par immobilisation en cours"][Math.floor(Math.random() * 3)] as any,
      TypeDeBien: ["bien privée", "bien de retour", "bien de reprise", "bien cdi"][Math.floor(Math.random() * 4)] as any,
      natureDuBien: ["Concédé Etat", "privée (ENEO)", "Tier privée"][Math.floor(Math.random() * 3)] as any,
      designationGenerale: "Équipement de distribution électrique"
    };
  }

  /**
   * Génère un poste de distribution
   */
  private generatePosteDistribution(coordinates: [number, number], index: number): PosteDistribution {
    return {
      ...this.generateBaseActif(coordinates, index),
      id: this.generateId(),
      type: "POSTE_DISTRIBUTION",
      nomPoste: `POSTE_YDE_${index}`,
      departMT: `DEP_MT_${index}`,
      anneeFabrication: 2015 + Math.floor(Math.random() * 8),
      fabricant: this.fabricants[Math.floor(Math.random() * this.fabricants.length)],
      marque: this.marques[Math.floor(Math.random() * this.marques.length)],
      typePoste: "Poste de distribution MT/BT",
      numeroSerie: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      niveauTension: [15000, 20000, 30000][Math.floor(Math.random() * 3)],
      conditionsFonctionnement: "Normales",
      principauxIncidents: "Aucun incident majeur",
      typeMontage: ["Sol", "Poteau", "Cabine"][Math.floor(Math.random() * 3)] as any,
      genieCivil: "Béton armé",
      dimensionPoste: "3x3x2.5m",
      porte: "Métallique sécurisée",
      serrure: "Cadenas ENEO",
      observations: "État satisfaisant"
    };
  }

  /**
   * Génère un transformateur
   */
  private generateTransformateur(coordinates: [number, number], index: number): Transformateur {
    const puissances = [50, 100, 160, 250, 400, 630];
    const puissance = puissances[Math.floor(Math.random() * puissances.length)];
    
    return {
      ...this.generateBaseActif(coordinates, index),
      id: this.generateId(),
      type: "TRANSFORMATEUR",
      nomPoste: `TRANSFO_${index}`,
      departMT: `DEP_MT_${Math.floor(index / 10)}`,
      ensembleFonctionnel: `EF_${index}`,
      anneeFabrication: 2010 + Math.floor(Math.random() * 13),
      fabricant: this.fabricants[Math.floor(Math.random() * this.fabricants.length)],
      marque: this.marques[Math.floor(Math.random() * this.marques.length)],
      typeTransformateur: "Distribution",
      numeroSerie: `TR${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      poidsTotal: puissance * 8 + Math.random() * 200,
      poidsDielectrique: puissance * 2,
      poidsDecuivrage: puissance * 1.5,
      etatFonctionnement: Math.random() > 0.1 ? "En service" : "Hors service",
      principauxIncidents: "Maintenance préventive",
      typeTransfo: "Transfo MT/BT",
      dielectrique: Math.random() > 0.7 ? "Huile" : "Sec",
      typeMontage: ["Sol", "Poteau"][Math.floor(Math.random() * 2)] as any,
      coordonneesGeographiques: `${coordinates[1]}, ${coordinates[0]}`,
      tensionPrimaire: 20000,
      tensionSecondaire: 400,
      puissance,
      courantPrimaire: puissance / (Math.sqrt(3) * 20),
      courantSecondaire: puissance / (Math.sqrt(3) * 0.4),
      fuitesDielectriques: ["Aucune fuite", "Traces de fuites"][Math.floor(Math.random() * 2)] as any,
      typeRefroidissement: "ONAN",
      protectionMT: ["Fusible", "Disjoncteur"][Math.floor(Math.random() * 2)] as any,
      protectionBT: "Disjoncteur BT",
      observations: "Fonctionnement normal"
    };
  }

  /**
   * Génère un support
   */
  private generateSupport(coordinates: [number, number], index: number): Support {
    return {
      ...this.generateBaseActif(coordinates, index),
      id: this.generateId(),
      type: "SUPPORT",
      numeroLigne: `LIGNE_${Math.floor(index / 20)}`,
      anneeImplantation: 2010 + Math.floor(Math.random() * 13),
      nombreSupports: 1,
      classeSupport: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      effortTeteSupport: 500 + Math.random() * 1000,
      utilisation: Math.random() > 0.3 ? "BT" : "MT",
      tension: Math.random() > 0.3 ? 400 : 20000,
      observations: "Support en bon état",
      structure: {
        simple: Math.random() > 0.5,
        jumele: Math.random() > 0.8,
        contrefiche: Math.random() > 0.9,
        portique: false,
        transformateur: Math.random() > 0.9,
        IACM: Math.random() > 0.8,
        PMR: Math.random() > 0.9,
        IACT: Math.random() > 0.85,
        fusesave: Math.random() > 0.7,
        shotFuses: Math.random() > 0.8,
        isolateurs: true,
        comptage: Math.random() > 0.9
      },
      materiaux: {
        bois: {
          quantite: Math.random() > 0.6 ? 1 : 0,
          etat: Math.random() > 0.7 ? "Bon" : "Mauvais",
          observation: "État correct",
          geolocalisation: `${coordinates[1]}, ${coordinates[0]}`,
          photo: `support_bois_${this.generateId()}.jpg`
        },
        beton: {
          quantite: Math.random() > 0.4 ? 1 : 0,
          etat: Math.random() > 0.8 ? "Bon" : "Mauvais",
          observation: "État satisfaisant",
          geolocalisation: `${coordinates[1]}, ${coordinates[0]}`,
          photo: `support_beton_${this.generateId()}.jpg`
        },
        metallique: {
          quantite: Math.random() > 0.8 ? 1 : 0,
          etat: "Bon",
          observation: "Galvanisation intacte",
          geolocalisation: `${coordinates[1]}, ${coordinates[0]}`,
          photo: `support_metal_${this.generateId()}.jpg`
        },
        treillis: {
          quantite: Math.random() > 0.9 ? 1 : 0,
          etat: "Bon",
          observation: "Structure stable",
          geolocalisation: `${coordinates[1]}, ${coordinates[0]}`,
          photo: `support_treillis_${this.generateId()}.jpg`
        }
      }
    };
  }

  /**
   * Génère une ligne aérienne
   */
  private generateLigneAerienne(
    coordinates: [number, number][], 
    startIndex: number, 
    endIndex: number
  ): LigneAerienne {
    const startCoord = coordinates[startIndex];
    const endCoord = coordinates[endIndex];
    const longueur = this.calculateDistance(
      startCoord[1], startCoord[0], 
      endCoord[1], endCoord[0]
    ) / 1000; // en km

    // Générer les supports pour cette section
    const nombreSupports = Math.ceil(longueur * 1000 / 50); // Un support tous les 50m environ
    const supports: Support[] = [];
    
    for (let i = 0; i < nombreSupports; i++) {
      const ratio = i / (nombreSupports - 1);
      const lat = startCoord[1] + (endCoord[1] - startCoord[1]) * ratio;
      const lon = startCoord[0] + (endCoord[0] - startCoord[0]) * ratio;
      supports.push(this.generateSupport([lon, lat], startIndex * 100 + i));
    }

    return {
      ...this.generateBaseActif(startCoord, startIndex),
      id: this.generateId(),
      type: "LIGNE_AERIENNE",
      numeroLigne: `LIGNE_AERO_${startIndex}`,
      origineLigne: `POSTE_YDE_${Math.floor(startIndex / 10)}`,
      identificationDepart: `DEP_${Math.floor(startIndex / 20)}`,
      tension: Math.random() > 0.3 ? 400 : 20000,
      etatFonctionnement: Math.random() > 0.05 ? "En service" : "Hors service",
      typologieLigne: ["Principale", "Secondaire", "Dérivation"][Math.floor(Math.random() * 3)] as any,
      typeDistribution: Math.random() > 0.3 ? "Triphasé" : "Monophasé",
      structureReseau: Math.random() > 0.8 ? "Bouclé" : "Radial",
      typeCable: ["Torsadé", "Cuivre", "Alu/Acier", "Almélec"][Math.floor(Math.random() * 4)] as any,
      sectionConducteur: [25, 35, 50, 70, 95, 120][Math.floor(Math.random() * 6)],
      conducteur: Math.random() > 0.7 ? "Isolé" : "Nu",
      typeIsolateurs: "Composite",
      etatIsolateurs: "Bon état",
      longueurLigne: Math.round(longueur * 1000) / 1000,
      observationEtat: "Ligne en bon état général",
      nombreSupports,
      supports
    };
  }

  /**
   * Génère un point de livraison
   */
  private generatePointLivraison(coordinates: [number, number], index: number): PointLivraison {
    return {
      ...this.generateBaseActif(coordinates, index),
      id: this.generateId(),
      type: "POINT_LIVRAISON",
      numeroLigne: `LIGNE_${Math.floor(index / 10)}`,
      client: `CLIENT_${index}`,
      numeroContrat: `CTR${Math.random().toString().substr(2, 8)}`,
      typeComptage: Math.random() > 0.7 ? "MT" : "BT",
      anneeFabricationCompteur: 2015 + Math.floor(Math.random() * 8),
      natureComptage: Math.random() > 0.6 ? "PREPAYEE" : "POST PAYE",
      numeroCompteur: `CPT${Math.random().toString().substr(2, 10)}`,
      typeActivite: ["Résidentiel", "Commercial", "Industriel"][Math.floor(Math.random() * 3)],
      tension: Math.random() > 0.8 ? 20000 : 400,
      typeConstruction: "Standard",
      sectionConducteur: [10, 16, 25, 35][Math.floor(Math.random() * 4)],
      observations: "Point de livraison standard"
    };
  }



  /**
   * Génère tous les actifs pour un tracé
   */
  public generateActifsFromTrace(feature: GeoJSONFeature): { actifs: Actif[], departs: Depart[] } {
    const coordinates = feature.geometry.coordinates as [number, number][];
    const actifs: Actif[] = [];
    const departIds: string[] = [];

    // Générer le poste de départ (début du tracé)
    const posteDepart = this.generatePosteDistribution(coordinates[0], 0);
    actifs.push(posteDepart);

    // Générer des transformateurs tous les ~500m
    const transformateurInterval = Math.floor(coordinates.length / 12);
    for (let i = transformateurInterval; i < coordinates.length; i += transformateurInterval) {
      const transformateur = this.generateTransformateur(coordinates[i], i);
      actifs.push(transformateur);
      
      // Ajouter un tableau BT avec chaque transformateur
      const tableauBT: TableauBT = {
        ...this.generateBaseActif(coordinates[i], i + 1000),
        id: this.generateId(),
        type: "TABLEAU_BT",
        nomPoste: transformateur.nomPoste,
        departMT: transformateur.departMT,
        anneeFabrication: transformateur.anneeFabrication,
        fabricant: transformateur.fabricant,
        marque: transformateur.marque,
        typeTableau: "Distribution BT",
        numeroSerie: `TB${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        niveauTension: 400,
        etatFonctionnement: "En service",
        principauxIncidents: "Aucun",
        nombreDeparts: 4 + Math.floor(Math.random() * 8),
        nombreDepartsEquipes: 3 + Math.floor(Math.random() * 6),
        tension: 400,
        typeMontage: "Armoire"
      };
      actifs.push(tableauBT);
    }

    // Générer des lignes aériennes entre les sections principales
    const sectionLength = Math.floor(coordinates.length / 8);
    for (let i = 0; i < coordinates.length - sectionLength; i += sectionLength) {
      const ligne = this.generateLigneAerienne(coordinates, i, i + sectionLength);
      actifs.push(ligne);
      
      // Ajouter les supports de cette ligne aux actifs
      actifs.push(...ligne.supports);
    }

    // Générer des OCR tous les ~1km
    const ocrInterval = Math.floor(coordinates.length / 6);
    for (let i = ocrInterval; i < coordinates.length; i += ocrInterval) {
      const ocr: OCR = {
        ...this.generateBaseActif(coordinates[i], i + 2000),
        id: this.generateId(),
        type: "OCR",
        numeroLigne: `LIGNE_${Math.floor(i / 20)}`,
        anneeFabrication: 2015 + Math.floor(Math.random() * 8),
        fabricant: this.fabricants[Math.floor(Math.random() * this.fabricants.length)],
        marque: this.marques[Math.floor(Math.random() * this.marques.length)],
        typeOCR: "Réenclencheur automatique",
        numeroSerie: `OCR${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        niveauTension: 20000,
        intensiteNominale: 200 + Math.random() * 400,
        pouvoirCoupure: 12500,
        etatFonctionnement: "En service",
        principauxIncidents: "Aucun",
        typeMontage: "Poteau",
        tension: 20000,
        calibre: 200,
        observations: "OCR fonctionnel"
      };
      actifs.push(ocr);
    }

    // Générer des points de livraison de manière aléatoire
    const pointsLivraisonCount = Math.floor(coordinates.length / 5);
    for (let i = 0; i < pointsLivraisonCount; i++) {
      const randomIndex = Math.floor(Math.random() * coordinates.length);
      const pointLivraison = this.generatePointLivraison(coordinates[randomIndex], i + 3000);
      actifs.push(pointLivraison);
    }

    // Créer les départs
    const nombreDeparts = 1; // Diviser le tracé en 3 départs
    const departsData: Depart[] = [];
    
    for (let d = 0; d < nombreDeparts; d++) {
      const startIdx = Math.floor((d * coordinates.length) / nombreDeparts);
      const endIdx = Math.floor(((d + 1) * coordinates.length) / nombreDeparts);
      const departCoords = coordinates.slice(startIdx, endIdx);
      
      // Calculer la longueur totale du départ
      let longueurTotale = 0;
      for (let i = 0; i < departCoords.length - 1; i++) {
        longueurTotale += this.calculateDistance(
          departCoords[i][1], departCoords[i][0],
          departCoords[i + 1][1], departCoords[i + 1][0]
        );
      }

      // Sélectionner les actifs de ce départ (approximativement)
      const actifsDepart = actifs.filter(actif => {
        const actifLat = actif.geolocalisation.latitude;
        const actifLon = actif.geolocalisation.longitude;
        
        // Vérifier si l'actif est dans la zone du départ
        const minLat = Math.min(...departCoords.map(c => c[1]));
        const maxLat = Math.max(...departCoords.map(c => c[1]));
        const minLon = Math.min(...departCoords.map(c => c[0]));
        const maxLon = Math.max(...departCoords.map(c => c[0]));
        
        return actifLat >= minLat && actifLat <= maxLat && 
               actifLon >= minLon && actifLon <= maxLon;
      });

      const departId = this.generateId();
      departIds.push(departId);

      const depart: Depart = {
        id: departId,
        nom: `DEPART_DL_${d + 1}`,
        posteOrigine: posteDepart.id,
        zonesGeographiques: {
          regions: ["Littoral"],
          departements: ["Wouri"],
          communes: this.communes,
          quartiers: this.quartiers
        },
        tension: 20000,
        valorisation: actifsDepart.reduce((sum, actif) => sum + actif.valorisation, 0),
        valeurAcquisition: actifsDepart.reduce((sum, actif) => sum + actif.valeurAcquisition, 0),
        longueurTotale: Math.round(longueurTotale / 1000 * 1000) / 1000, // en km
        dateCreation: new Date().toISOString().split('T')[0],
        etatGeneral: "En service",
        typeDepart: ["Principal", "Secondaire", "Résidentiel"][d % 3] as any,
        actifs: actifsDepart.map(a => a.id)
      };

      departsData.push(depart);
    }

    return {
      actifs,
      departs: departsData
    };
  }

  public genereAllActifsFromTrace(geoJsonData: GeoJSONData): { actifs: Actif[], departs: Depart[] } {
    const features = geoJsonData.features;
    const actifs: Actif[] = [];
     const departsData: Depart[] = [];
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      const actifsFromFeature = this.generateActifsFromTrace(feature);
      actifs.push(...actifsFromFeature.actifs);
      departsData.push(...actifsFromFeature.departs);
    }

    return {
      actifs,
      departs: departsData
    }
  }

      


  public exportToJSON(actifs: Actif[], departs: Depart[]): string {
    return JSON.stringify({
      metadata: {
        generatedAt: new Date().toISOString(),
        totalActifs: actifs.length,
        totalDeparts: departs.length,
        types: actifs.reduce((acc, actif) => {
          acc[actif.type] = (acc[actif.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      },
      actifs,
      departs
    }, null, 2);
  }
}
const generator = new DepartGenerator();

export const { actifs, departs } = generator.genereAllActifsFromTrace(geoJson);
