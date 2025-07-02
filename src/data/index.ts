// Base de données fictive

import type {
  Actif,
  BaseActif,
  CelluleDistributionPrimaire,
  CelluleDistributionSecondaire,
  Depart,
  EquipementStock,
  LigneAerienne,
  LigneSouterraine,
  OCR,
  PointLivraison,
  PosteDistribution,
  Support,
  TableauBT,
  Transformateur,
} from "@/types";

export const inventaireActifs: Actif[] = [
  // Lignes Aériennes
  {
    id: "LA_001",
    type: "LIGNE_AERIENNE",
    date: "2024-03-15",
    personnelKES: "Jean MBALLA",
    personnelENEO: "Pierre NGONO",
    personnelMINEE: "Marie FOUDA",
    personnelARSEL: "Paul ATANGANA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 1er",
    commune: "Douala 1er",
    quartier: "Akwa",
    rue: "Avenue de la Liberté",
    precisionLieu: "Face à la Poste Centrale",
    codificationDecoupageENEO: "LT-WR-DLA1-AKW-001",
    photo: ["/images/ligneA1.jpg","/images/LIGNE AERIENNE.png"],
    geolocalisation: { latitude: 4.0511, longitude: 9.7679 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-LA-001",
    numeroCompte: "CPT-6001",
    libelleCompte: "Ligne MT Akwa Principal",
    modeDacquisition: 'directe' ,
    TypeDeBien: 'bien privée',
    natureDuBien: 'privée (ENEO)',
    valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1000000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2018,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
  
    designationGenerale: "Ligne aérienne MT 15kV Akwa-Centre",
    numeroLigne: "LN-AKW-001",
    origineLigne: "Poste Akwa",
    identificationDepart: "DEP-AKW-01",
    tension: 15000,
    etatFonctionnement: "En service",
    typologieLigne: "Principale",
    typeDistribution: "Triphasé",
    structureReseau: "Radial",
    typeCable: "Alu/Acier",
    sectionConducteur: 95,
    conducteur: "Nu",
    typeIsolateurs: "Verre trempé",
    etatIsolateurs: "Bon état général",
    longueurLigne: 2500,
    observationEtat: "Ligne en bon état, maintenance régulière",
    nombreSupports: 25,
    supports: [
      {
        // Propriétés héritées de BaseActif
        id: "SUP_001",
        date: "2024-03-21",
        personnelKES: "Blaise FOKOU",
        personnelENEO: "Antoinette MANDENG",
        personnelMINEE: "Serge NANA",
        personnelARSEL: "Martine ABEGA",
        etatVisuel: "Moyen",
        region: "Littoral",
        departement: "Wouri",
        arrondissement: "Douala 1er",
        commune: "Douala 1er",
        quartier: "Akwa",
        rue: "Avenue de la Liberté",
        precisionLieu: "Face à la Poste Centrale",
        codificationDecoupageENEO: "LT-WR-DLA1-AKW-001",
        photo: ["/images/support1.jpg","/images/support2.jpg","images/support3.jpg","/images/SUPPORT.png"],
        geolocalisation: { latitude: 4.0511, longitude: 9.7679 },
        positionMateriel: "Terrain",
        numeroImmo: "IMM-SUP-001",
        nouveauNumeroImmo: undefined,
        numeroCompte: "CPT-12001",
        libelleCompte: "Support béton Akwa-01",
        modeDacquisition: "par projet",
        TypeDeBien: "bien privée",
        natureDuBien: "privée (ENEO)",
        valorisation: 5000,

        designationGenerale: "Support béton centrifugé MT",
        valeurAcquisition: 234000, // Valeur d'origine lors de l'acquisition
        anneeMiseEnService: 2018,
        dureeDeVieEstimative: 10, // En années
        tauxAmortissementAnnuel: 12, // En pourcentage (ex: 5 pour 5%)

        // Propriétés spécifiques au Support
        type: "SUPPORT",
        numeroLigne: "LN-AKW-001",
        anneeImplantation: 2018,
        nombreSupports: 1,
        classeSupport: "Classe B",
        effortTeteSupport: 2500,
        utilisation: "MT",
        tension: 15,
        observations: "Support en bon état général",
        structure: {
          simple: true,
          jumele: false,
          contrefiche: false,
          portique: false,
          transformateur: false,
          IACM: false,
          PMR: false,
          IACT: false,
          fusesave: false,
          shotFuses: false,
          isolateurs: true,
          comptage: false,
        },
        materiaux: {
          bois: {
            quantite: 0,
            etat: "Bon",
            observation: "N/A",
            geolocalisation: "",
            photo: "",
          },
          beton: {
            quantite: 1,
            etat: "Bon",
            observation: "Béton en parfait état",
            geolocalisation: "4.0511,9.7679",
            photo: "SUP_001_beton.jpg",
          },
          metallique: {
            quantite: 0,
            etat: "Bon",
            observation: "N/A",
            geolocalisation: "",
            photo: "",
          },
          treillis: {
            quantite: 0,
            etat: "Bon",
            observation: "N/A",
            geolocalisation: "",
            photo: "",
          },
        },
      },
    ],
  },

  // Lignes Souterraines
  {
    id: "LS_001",
    type: "LIGNE_SOUTERRAINE",
    date: "2024-03-16",
    personnelKES: "Henri BIYA",
    personnelENEO: "Sophie MANGA",
    personnelMINEE: "André MVONDO",
    personnelARSEL: "Claire ESSOMBA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 2ème",
    commune: "Douala 2ème",
    quartier: "Bonapriso",
    rue: "Rue Joss",
    codificationDecoupageENEO: "LT-WR-DLA2-BNP-002",
    photo: ["/images/ligneS1.jpg","/images/ligneS2.jpg","images/LIGNE SOUTERAINE.png"],
    geolocalisation: { latitude: 4.0483, longitude: 9.6961 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-LS-001",
    numeroCompte: "CPT-6002",
    libelleCompte: "Ligne souterraine Bonapriso",
    modeDacquisition: "directe",
    TypeDeBien: "bien cdi",
    natureDuBien: "Tier MUNICIPALITE",
    valorisation: 60000,
    designationGenerale: "Câble souterrain MT 10kV Bonapriso",
    valeurAcquisition: 1000000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2020,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    numeroLigne: "LN-BNP-002",
    origineLigne: "Poste Bonapriso",
    identificationDepart: "DEP-BNP-01",
    tension: 10000,
    etatFonctionnement: "En service",
    typologieLigne: "Secondaire",
    typeDistribution: "Triphasé",
    structureReseau: "Bouclé",
    typeCable: "Cuivre",
    sectionConducteur: 150,
    conducteur: "Isolé",
    typeIsolateurs: "N/A",
    etatIsolateurs: "N/A",
    longueurLigne: 1800,
    observationEtat: "Câble récent, isolation parfaite",
    nombreSupports: 0,
    supports: [],
  },

  // Postes de Distribution
  {
    id: "PD_001",
    type: "POSTE_DISTRIBUTION",
    date: "2024-03-17",
    personnelKES: "Robert TALLA",
    personnelENEO: "Françoise NDONGO",
    personnelMINEE: "Michel ONANA",
    personnelARSEL: "Sylvie MEBARA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 3ème",
    commune: "Douala 3ème",
    quartier: "Makepe",
    rue: "Carrefour Makepe",
    codificationDecoupageENEO: "LT-WR-DLA3-MKP-003",
    photo: ["/images/posteD1.jpg","/images/posteD2.jpg","/images/POSTE.png"],
    geolocalisation: { latitude: 4.0792, longitude: 9.7326 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-PD-001",
    numeroCompte: "CPT-7001",
    libelleCompte: "Poste Makepe Centre",
    modeDacquisition: "directe",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier privée",
    valorisation: 60000,
    designationGenerale: "Poste de distribution MT/BT Makepe",
    valeurAcquisition: 2222000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2015,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 5, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Makepe Centre",
    departMT: "Départ Makepe Principal",
    anneeFabrication: 2014,
    fabricant: "Schneider Electric",
    marque: "Schneider",
    typePoste: "Poste cabine maçonnée",
    numeroSerie: "SCH-2014-MKP-001",
    niveauTension: 15000,
    conditionsFonctionnement: "Fonctionnement normal",
    principauxIncidents: "Aucun incident majeur",
    typeMontage: "Cabine",
    genieCivil: "Béton armé",
    dimensionPoste: "4m x 3m x 2.5m",
    porte: "Métallique avec serrure",
    serrure: "Serrure à clé ENEO",
    observations: "Poste en excellent état",
  },

  // Tableaux BT
  {
    id: "TBT_001",
    type: "TABLEAU_BT",
    date: "2024-03-18",
    personnelKES: "Alain MBOMA",
    personnelENEO: "Georgette NOAH",
    personnelMINEE: "Fabrice OWONA",
    personnelARSEL: "Berthe MVENG",
    etatVisuel: "Mauvais",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 4ème",
    commune: "Douala 4ème",
    quartier: "Ndokoti",
    rue: "Marché Ndokoti",
    codificationDecoupageENEO: "LT-WR-DLA4-NDK-004",
    photo: ["/images/tabBT1.jpg","/images/tabBT2.jpg","images/TABLEAU BT.png"],
    geolocalisation: { latitude: 4.0626, longitude: 9.7578 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-TBT-001",
    numeroCompte: "CPT-8001",
    libelleCompte: "Tableau BT Ndokoti Marché",
    modeDacquisition: "par projet",
    TypeDeBien: "bien cdi",
    natureDuBien: "privée (ENEO)",
    valorisation: 60000,
    designationGenerale: "Tableau général basse tension Ndokoti",
    valeurAcquisition: 500000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2017,
    dureeDeVieEstimative: 25, // En années
    tauxAmortissementAnnuel: 13, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Ndokoti Marché",
    departMT: "Départ Ndokoti Commercial",
    anneeFabrication: 2016,
    fabricant: "Legrand",
    marque: "Legrand",
    typeTableau: "TGBT étanche IP55",
    numeroSerie: "LGR-2016-NDK-TB01",
    niveauTension: 400,
    etatFonctionnement: "En service",
    principauxIncidents: "Surcharge occasionnelle",
    nombreDeparts: 12,
    nombreDepartsEquipes: 10,
    tension: 400,
    typeMontage: "Montage mural",
  },

  // Transformateurs
  {
    id: "TR_001",
    type: "TRANSFORMATEUR",
    date: "2024-03-19",
    personnelKES: "Emmanuel ELOUNDOU",
    personnelENEO: "Yvette BASSILEKIN",
    personnelMINEE: "Charles MBALLA",
    personnelARSEL: "Odette FEUDJOU",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 5ème",
    commune: "Douala 5ème",
    quartier: "Kotto",
    rue: "Carrefour Kotto",
    codificationDecoupageENEO: "LT-WR-DLA5-KTT-005",
    photo: ["/images/transformateur1.jpg","/images/transformateur2.jpg","images/TRANSFORMATEURS.png"],
    geolocalisation: { latitude: 4.0341, longitude: 9.7018 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-TR-001",
    numeroCompte: "CPT-9001",
    libelleCompte: "Transformateur Kotto Principal",
    modeDacquisition: "par immobilisation en cours",
    TypeDeBien: "bien de reprise",
    natureDuBien: "Concédé Etat",
    valorisation: 60000,
    designationGenerale: "Transformateur de distribution MT/BT Kotto",
    valeurAcquisition: 8880000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2015,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Kotto Principal",
    departMT: "Départ Kotto Centre",
    ensembleFonctionnel: "Transformateur de distribution sur poteau",
    anneeFabrication: 2015,
    fabricant: "ABB",
    marque: "ABB",
    typeTransformateur: "Transformateur de distribution",
    numeroSerie: "ABB-2015-KTT-TR001",
    poidsTotal: 850,
    poidsDielectrique: 120,
    poidsDecuivrage: 180,
    etatFonctionnement: "En service",
    principauxIncidents: "Maintenance préventive régulière",
    typeTransfo: "Transfo MT/BT",
    dielectrique: "Huile",
    typeMontage: "Poteau",
    coordonneesGeographiques: "4°02'02.8\"N 9°42'06.5\"E",
    tensionPrimaire: 15000,
    tensionSecondaire: 400,
    puissance: 250,
    courantPrimaire: 9.6,
    courantSecondaire: 361,
    fuitesDielectriques: "Aucune fuite",
    typeRefroidissement: "ONAN",
    protectionMT: "Fusible",
    protectionBT: "Disjoncteur BT",
    observations: "Transformateur en parfait état de fonctionnement",
  },

  // Cellules Distribution Secondaire
  {
    id: "CDS_001",
    type: "CELLULE_DISTRIBUTION_SECONDAIRE",
    date: "2024-03-20",
    personnelKES: "Gaston BILONG",
    personnelENEO: "Patience MEKE",
    personnelMINEE: "Roger FANDIO",
    personnelARSEL: "Jacqueline TOWA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 6ème",
    commune: "Douala 6ème",
    quartier: "Bepanda",
    rue: "Carrefour Bepanda",
    codificationDecoupageENEO: "LT-WR-DLA6-BPD-006",
    photo: ["/images/celluleS1.jpg","/images/celluleS2.jpg","images/CELLULE DISTRIBUTION SECONDAIRE.png"],
    geolocalisation: { latitude: 4.0973, longitude: 9.7445 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-CDS-001",
    numeroCompte: "CPT-10001",
    libelleCompte: "Cellule BT Bepanda",
    modeDacquisition: "par projet",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier Riverains",
    valorisation: 60000,
    designationGenerale: "Cellule de distribution secondaire Bepanda",
    valeurAcquisition: 8540000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2018,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Bepanda Distribution",
    departMT: "Départ Bepanda Résidentiel",
    anneeFabrication: 2018,
    fabricant: "Siemens",
    marque: "Siemens",
    typeCellule: "Cellule modulaire BT",
    numeroSerie: "SIE-2018-BPD-CD01",
    niveauTension: 400,
    intensiteCourtCircuit: 16000,
    calibreJeuBarre: 630,
    etatFonctionnement: "En service",
    principauxIncidents: "Défaut d'isolement résolu",
    typeCelluleDistribution: "Cellule débrochable",
    tension: 400,
    calibre: 400,
    modele: "8PT20",
    typeMontage: "Sol",
    caissonBT: "Métallique IP31",
    typeRelaisProtection: "Numérique multifonction",
  },

  // Cellules Distribution Primaire
  {
    id: "CDP_001",
    type: "CELLULE_DISTRIBUTION_PRIMAIRE",
    date: "2024-03-21",
    personnelKES: "Blaise FOKOU",
    personnelENEO: "Antoinette MANDENG",
    personnelMINEE: "Serge NANA",
    personnelARSEL: "Martine ABEGA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 1er",
    commune: "Douala 1er",
    quartier: "Bonanjo",
    rue: "Boulevard de la Liberté",
    codificationDecoupageENEO: "LT-WR-DLA1-BNJ-007",
    photo: ["/images/celluleP1.jpg","/images/celluleP2.jpg","/images/CELLULE DISTRIBUTION PRIMAIRE.png"],
    geolocalisation: { latitude: 4.0492, longitude: 9.6967 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-CDP-001",
    numeroCompte: "CPT-11001",
    libelleCompte: "Cellule MT Bonanjo",
    modeDacquisition: "directe",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier MINEE",
    valorisation: 60000,
    designationGenerale: "Cellule de distribution primaire Bonanjo",
    valeurAcquisition: 330000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2017,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 20, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Bonanjo Centre",
    departMT: "Départ Bonanjo Commercial",
    anneeFabrication: 2016,
    fabricant: "Schneider Electric",
    marque: "Schneider",
    typeCellule: "Cellule SF6 étanche",
    numeroSerie: "SCH-2016-BNJ-CP01",
    niveauTension: 15000,
    intensiteCourtCircuit: 20000,
    calibreJeuBarre: 630,
    etatFonctionnement: "En service",
    principauxIncidents: "Maintenance préventive annuelle",
    equipements: {
      disjoncteur: true,
      interrupteur: true,
      mesure: true,
      protection: true,
      transfo: false,
    },
    disjoncteur: {
      type: "Débrochable",
      calibre: 400,
      modele: "SF1",
    },
    modeleVM6: "VM6-DM1A",
    modeleSM6: "SM6-DM1A",
    tension: 15000,
    calibreBT: 400,
    typeRelais: "Sepam",
    modeleRelais: "Sepam S40",
    typeMontage: "Cabine maçonnée",
    surGaineTechnique: true,
    caissonBT: "Métallique IP43",
    coordonneesGeographiques: "4°02'57.3\"N 9°41'48.1\"E",
    observations: "Cellule en parfait état de fonctionnement",
    numeroPhotos: "CDP_001_01 à CDP_001_05",
    numeroTAG: "TAG-CDP-BNJ-001",
  },

  // Supports
  {
    // Propriétés héritées de BaseActif
    id: "SUP_001",
    date: "2024-03-21",
    personnelKES: "Blaise FOKOU",
    personnelENEO: "Antoinette MANDENG",
    personnelMINEE: "Serge NANA",
    personnelARSEL: "Martine ABEGA",
    etatVisuel: "Moyen",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 1er",
    commune: "Douala 1er",
    quartier: "Akwa",
    rue: "Avenue de la Liberté",
    precisionLieu: "Face à la Poste Centrale",
    codificationDecoupageENEO: "LT-WR-DLA1-AKW-001",
    photo: ["/images/support1.jpg","/images/support2.jpg","images/support3.jpg","images/SUPPORT.png"],
    geolocalisation: { latitude: 4.0511, longitude: 9.7679 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-SUP-001",
    nouveauNumeroImmo: undefined,
    numeroCompte: "CPT-12001",
    libelleCompte: "Support béton Akwa-01",
    modeDacquisition: "par immobilisation en cours",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier industriel",

    designationGenerale: "Support béton centrifugé MT",
    valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1000000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2018,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)

    // Propriétés spécifiques au Support
    type: "SUPPORT",
    numeroLigne: "LN-AKW-001",
    anneeImplantation: 2018,
    nombreSupports: 1,
    classeSupport: "Classe B",
    effortTeteSupport: 2500,
    utilisation: "MT",
    tension: 15,
    observations: "Support en bon état général",
    structure: {
      simple: true,
      jumele: false,
      contrefiche: false,
      portique: false,
      transformateur: false,
      IACM: false,
      PMR: false,
      IACT: false,
      fusesave: false,
      shotFuses: false,
      isolateurs: true,
      comptage: false,
    },
    materiaux: {
      bois: {
        quantite: 0,
        etat: "Bon",
        observation: "N/A",
        geolocalisation: "",
        photo: "",
      },
      beton: {
        quantite: 1,
        etat: "Bon",
        observation: "Béton en parfait état",
        geolocalisation: "4.0511,9.7679",
        photo: "SUP_001_beton.jpg",
      },
      metallique: {
        quantite: 0,
        etat: "Bon",
        observation: "N/A",
        geolocalisation: "",
        photo: "",
      },
      treillis: {
        quantite: 0,
        etat: "Bon",
        observation: "N/A",
        geolocalisation: "",
        photo: "",
      },
    },
  },

  // OCR (Organe de Coupure Réenclencheur)
  {
    id: "OCR_001",
    type: "OCR",
    date: "2024-03-22",
    personnelKES: "Théodore NGAH",
    personnelENEO: "Célestine BOMDA",
    personnelMINEE: "Vincent EYENGA",
    personnelARSEL: "Rosine MBARGA",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 2ème",
    commune: "Douala 2ème",
    quartier: "New Bell",
    rue: "Marché New Bell",
    codificationDecoupageENEO: "LT-WR-DLA2-NWB-008",
    photo: ["/images/ocr1.jpg","/images/ocr2.jpg","/images/OCR.png"],
    geolocalisation: { latitude: 4.0612, longitude: 9.7103 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-OCR-001",
    numeroCompte: "CPT-13001",
    libelleCompte: "OCR New Bell Principal",
    modeDacquisition: "directe",
    TypeDeBien: "bien privée",
    natureDuBien: "Concédé Etat",
    valorisation: 60000,

    designationGenerale: "Organe de coupure réenclencheur New Bell",
    valeurAcquisition: 55000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2019,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    numeroLigne: "LN-NWB-003",
    anneeFabrication: 2018,
    fabricant: "Cooper Power Systems",
    marque: "Cooper",
    typeOCR: "Recloser triphasé",
    numeroSerie: "CPS-2018-NWB-RC01",
    niveauTension: 15000,
    intensiteNominale: 630,
    pouvoirCoupure: 12500,
    etatFonctionnement: "En service",
    principauxIncidents: "Fonctionnement optimal",
    typeMontage: "Poteau",
    tension: 15000,
    calibre: 630,
    observations: "OCR performant, téléconduite opérationnelle",
  },

  // Points de Livraison
  {
    id: "PL_001",
    type: "POINT_LIVRAISON",
    date: "2024-03-23",
    personnelKES: "Barnabé YONTA",
    personnelENEO: "Hélène MOUKOKO",
    personnelMINEE: "Félix NKOA",
    personnelARSEL: "Isabelle EBODE",
    etatVisuel: "Bon",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 3ème",
    commune: "Douala 3ème",
    quartier: "Logbaba",
    rue: "Carrefour Logbaba",
    codificationDecoupageENEO: "LT-WR-DLA3-LGB-009",
    photo: ["/images/plivraison1.jpg","/images/plivraison2.jpg","/images/POINT DE LIVRAISON.png"],
    geolocalisation: { latitude: 4.0891, longitude: 9.7234 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-PL-001",
    numeroCompte: "CPT-14001",
    libelleCompte: "Point livraison Logbaba Industries",
    modeDacquisition: "par immobilisation en cours",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier MINEPAT",
    valorisation: 55000,

    designationGenerale: "Point de livraison MT industriel",
    valeurAcquisition: 1000000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2019,
    dureeDeVieEstimative: 16, // En années
    tauxAmortissementAnnuel: 22, // En pourcentage (ex: 5 pour 5%)
    numeroLigne: "LN-LGB-004",
    client: "SOCAVER Industries SARL",
    numeroContrat: "CNT-IND-2020-0145",
    typeComptage: "MT",
    anneeFabricationCompteur: 2019,
    natureComptage: "POST PAYE",
    numeroCompteur: "CPT-MT-2019-5547",
    typeActivite: "Industrie agroalimentaire",
    tension: 15000,
    typeConstruction: "Cabine béton",
    sectionConducteur: 95,
    observations: "Installation conforme aux normes industrielles",
  },

  // Équipements en Stock
  {
    id: "ES_001",
    type: "EQUIPEMENT_STOCK",
    date: "2024-03-24",
    personnelKES: "Norbert MBEDE",
    personnelENEO: "Joséphine BELLA",
    personnelMINEE: "Stéphane MEVA",
    personnelARSEL: "Philomène TCHUENTE",
    region: "Littoral",
    departement: "Wouri",
    arrondissement: "Douala 1er",
    commune: "Douala 1er",
    quartier: "Akwa",
    rue: "Magasin Central ENEO",
    codificationDecoupageENEO: "LT-WR-DLA1-AKW-MAG",
    photo: ["/images/stock1.jpg","/images/stock2.jpg","/images/POTEAU.png"],
    geolocalisation: { latitude: 4.0523, longitude: 9.7691 },
    positionMateriel: "Magasin",
    numeroImmo: "IMM-ES-001",
    numeroCompte: "CPT-15001",
    libelleCompte: "Stock transformateur 100kVA",
    modeDacquisition: "directe",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier AER",
    valorisation: 65000,

    designationGenerale: "Transformateur de distribution en stock",
    valeurAcquisition: 124500, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2024,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    numeroLigne: "STOCK-MAG-001",
    anneeMiseEnStock: 2023,
    nomEquipement: "Transformateur MT/BT 100kVA",
    caracteristiques: "15kV/400V, 100kVA, diélectrique huile, fabricant ABB",
    etatVisuel: "Bon",
    observations: "Équipement neuf, prêt pour installation",
  },
  // Ligne Aérienne supplémentaire
  {
    id: "LA_002",
    type: "LIGNE_AERIENNE",
    date: "2024-03-25",
    personnelKES: "Cyprien MFOUMOU",
    personnelENEO: "Marguerite NGOLLE",
    personnelMINEE: "Hervé BILLONG",
    personnelARSEL: "Monique ATEBA",
    region: "Centre",
    departement: "Mfoundi",
    arrondissement: "Yaoundé 1er",
    commune: "Yaoundé 1er",
    quartier: "Centre Ville",
    rue: "Avenue Kennedy",
    codificationDecoupageENEO: "CT-MF-YDE1-CVL-010",
    photo: ["/images/ligneA1.jpg","/images/LIGNE AERIENNE.png"],
    geolocalisation: { latitude: 3.848, longitude: 11.5021 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-LA-002",
    numeroCompte: "CPT-6002",
    libelleCompte: "Ligne MT Centre Ville Yaoundé",
    modeDacquisition: "par immobilisation en cours",
    TypeDeBien: "bien privée",
    natureDuBien: "privée (ENEO)",
    valorisation: 80000,
    designationGenerale: "Ligne aérienne MT 15kV Centre Ville",
    valeurAcquisition: 4440000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2021,
    dureeDeVieEstimative: 5, // En années
    tauxAmortissementAnnuel: 32, // En pourcentage (ex: 5 pour 5%)
    numeroLigne: "LN-CVL-002",
    origineLigne: "Poste Centre Ville",
    identificationDepart: "DEP-CVL-02",
    tension: 15000,
    etatFonctionnement: "En service",
    typologieLigne: "Principale",
    typeDistribution: "Triphasé",
    structureReseau: "Bouclé",
    typeCable: "Almélec",
    sectionConducteur: 150,
    conducteur: "Nu",
    typeIsolateurs: "Composite",
    etatIsolateurs: "Excellent état",
    longueurLigne: 3200,
    etatVisuel: "Bon",
    observationEtat: "Ligne récente, performances optimales",
    nombreSupports: 32,
    supports: [],
  },

  // Transformateur supplémentaire
  {
    id: "TR_002",
    type: "TRANSFORMATEUR",
    date: "2024-03-26",
    personnelKES: "Aristide NANGA",
    personnelENEO: "Véronique ESSONO",
    personnelMINEE: "Laurent MBALLA",
    personnelARSEL: "Brigitte FOUDA",
    region: "Centre",
    departement: "Mfoundi",
    arrondissement: "Yaoundé 3ème",
    commune: "Yaoundé 3ème",
    quartier: "Melen",
    rue: "Carrefour Melen",
    codificationDecoupageENEO: "CT-MF-YDE3-MLN-011",
    photo: ["/images/transformateur1.jpg","/images/transformateur2.jpg","/images/TRANSFORMATEURS.png"],
    geolocalisation: { latitude: 3.8267, longitude: 11.4926 },
    positionMateriel: "Terrain",
    numeroImmo: "IMM-TR-002",
    numeroCompte: "CPT-9002",
    libelleCompte: "Transformateur Melen Principal",
    modeDacquisition: "directe",
    TypeDeBien: "bien privée",
    natureDuBien: "Tier MUNICIPALITE",
    valorisation: 75000,
    designationGenerale: "Transformateur de distribution MT/BT Melen",
    valeurAcquisition: 1000000, // Valeur d'origine lors de l'acquisition
    anneeMiseEnService: 2022,
    dureeDeVieEstimative: 15, // En années
    tauxAmortissementAnnuel: 30, // En pourcentage (ex: 5 pour 5%)
    nomPoste: "Poste Melen Distribution",
    departMT: "Départ Melen Résidentiel",
    ensembleFonctionnel: "Transformateur sur socle béton",
    anneeFabrication: 2021,
    fabricant: "Siemens",
    marque: "Siemens",
    typeTransformateur: "Transformateur immergé",
    numeroSerie: "SIE-2021-MLN-TR002",
    poidsTotal: 1200,
    poidsDielectrique: 180,
    poidsDecuivrage: 250,
    etatFonctionnement: "En service",
    etatVisuel: "Bon",
    principauxIncidents: "Aucun incident",
    typeTransfo: "Transfo MT/BT",
    dielectrique: "Huile",
    typeMontage: "Sol",
    coordonneesGeographiques: "3°49'36.1\"N 11°29'33.4\"E",
    tensionPrimaire: 15000,
    tensionSecondaire: 400,
    puissance: 400,
    courantPrimaire: 15.4,
    courantSecondaire: 577,
    fuitesDielectriques: "Aucune fuite",
    typeRefroidissement: "ONAN",
    protectionMT: "Disjoncteur",
    protectionBT: "Disjoncteur BT",
    observations: "Transformateur neuf, performances excellentes",
  },
];

export const inventaireDeparts: Depart[] = [
  {
    id: "DEP-AKW-01",
    nom: "Départ Akwa Principal",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 1er", "Douala 2ème"],
      quartiers: ["Akwa", "Bonanjo", "Bonapriso"],
    },
    tension: 15000,
    longueurTotale: 8.5,
    dateCreation: "2018-03-15",
    etatGeneral: "En service",
    typeDepart: "Principal",
    actifs: ["LA_001", "CDP_001", "TR_001", "SUP_001", "OCR_001"],
    valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-BNP-01",
    nom: "Départ Bonapriso Résidentiel",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 2ème"],
      quartiers: ["Bonapriso", "New Bell"],
    },
    tension: 10000,
    longueurTotale: 4.2,
    dateCreation: "2020-03-16",
    etatGeneral: "En service",
    typeDepart: "Résidentiel",
    actifs: ["LS_001", "TBT_001", "PL_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-MKP-01",
    nom: "Départ Makepe Commercial",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 3ème"],
      quartiers: ["Makepe", "Logbaba"],
    },
    tension: 15000,
    longueurTotale: 6.8,
    dateCreation: "2015-05-10",
    etatGeneral: "En service",
    typeDepart: "Commercial",
    actifs: ["LA_002", "TR_002", "CDS_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-NDK-01",
    nom: "Départ Ndokoti Industriel",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 4ème", "Douala 5ème"],
      quartiers: ["Ndokoti", "Kotto", "Bepanda"],
    },
    tension: 15000,
    longueurTotale: 12.3,
    dateCreation: "2017-08-22",
    etatGeneral: "En service",
    typeDepart: "Industriel",
    actifs: ["LA_001", "TR_001", "CDP_001", "CDS_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-YDE-01",
    nom: "Départ Centre Ville Yaoundé",
    posteOrigine: "PD_002",
    zonesGeographiques: {
      regions: ["Centre"],
      departements: ["Mfoundi"],
      communes: ["Yaoundé 1er", "Yaoundé 3ème"],
      quartiers: ["Centre Ville", "Melen", "Essos"],
    },
    tension: 15000,
    longueurTotale: 9.7,
    dateCreation: "2021-01-18",
    etatGeneral: "En service",
    typeDepart: "Principal",
    actifs: ["LA_002", "TR_002"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-BPD-01",
    nom: "Départ Bepanda Mixte",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 6ème"],
      quartiers: ["Bepanda", "Kotto"],
    },
    tension: 15000,
    longueurTotale: 5.4,
    dateCreation: "2019-11-05",
    etatGeneral: "Maintenance",
    typeDepart: "Résidentiel",
    actifs: ["CDS_001", "TBT_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-LGB-01",
    nom: "Départ Logbaba Industries",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 3ème"],
      quartiers: ["Logbaba"],
    },
    tension: 15000,
    longueurTotale: 3.8,
    dateCreation: "2020-06-12",
    etatGeneral: "En service",
    typeDepart: "Industriel",
    actifs: ["PL_001", "TR_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
  {
    id: "DEP-NWB-01",
    nom: "Départ New Bell Secondaire",
    posteOrigine: "PD_001",
    zonesGeographiques: {
      regions: ["Littoral"],
      departements: ["Wouri"],
      communes: ["Douala 2ème"],
      quartiers: ["New Bell"],
    },
    tension: 10000,
    longueurTotale: 2.9,
    dateCreation: "2019-04-08",
    etatGeneral: "En service",
    typeDepart: "Secondaire",
    actifs: ["OCR_001", "LS_001"],
     valorisation: 0, // Valeur actuelle (calculée)
    valeurAcquisition: 1200000, // Valeur d'origine lors de l'acquisition
  },
];

// Fonctions utilitaires pour la base de données

// TypeDeBien: 'bien privée'|'bien de retour'|'bien de reprise'|'bien cdi';
// natureDuBien: 'Concédé Etat' | 'privée (ENEO)' | 'Tier privée' | 'Tier AER' | 'Tier MINEE' | 'Tier MUNICIPALITE' | 'Tier industriel' | 'Tier Riverains' | 'Tier MINEPAT';

export const getAllActifs = (): Actif[] => {
  return inventaireActifs;
};

export const getAllDeparts = (): Depart[] => {
  return inventaireDeparts;
};

export const getDepartById = (id: string): Depart | undefined => {
  return inventaireDeparts.find((depart) => depart.id === id);
};

export const getActifById = (id: string): Actif | undefined => {
  return inventaireActifs.find((actif) => actif.id === id);
};

export const getDepartColor = (typeDepart: string): string => {
  const colors: Record<string, string> = {
    Principal: "#e74c3c",
    Résidentiel: "#3498db",
    Commercial: "#f39c12",
    Industriel: "#9b59b6",
    Secondaire: "#27ae60",
  };
  return colors[typeDepart] || "#95a5a6";
};

// Icônes pour différents types d'actifs
export const getActifIcon = (type: string): string => {
  const icons: Record<string, string> = {
    LIGNE_AERIENNE: "🔌",
    LIGNE_SOUTERRAINE: "⚡",
    POSTE_DISTRIBUTION: "🏭",
    TRANSFORMATEUR: "⚙️",
    TABLEAU_BT: "📋",
    CELLULE_DISTRIBUTION_PRIMAIRE: "🔧",
    CELLULE_DISTRIBUTION_SECONDAIRE: "🔧",
    SUPPORT: "🗼",
    OCR: "🔄",
    POINT_LIVRAISON: "📍",
    EQUIPEMENT_STOCK: "📦",
  };
  return icons[type] || "❓";
};

export const getActifsByType = <T extends Actif["type"]>(
  type: T
): Extract<Actif, { type: T }>[] => {
  return inventaireActifs.filter((actif) => actif.type === type) as Extract<
    Actif,
    { type: T }
  >[];
};
export const getActifsByModeDacquisition = (
  mode: BaseActif["modeDacquisition"]
): Actif[] => {
  return inventaireActifs.filter((actif) => actif.modeDacquisition === mode);
};

export const getActifsByTypeDeBien = (
  typeDeBien: BaseActif["TypeDeBien"]
): Actif[] => {
  return inventaireActifs.filter((actif) => actif.TypeDeBien === typeDeBien);
};

export const getActifsByNatureDuBienStrict = (
  nature:
    | "Concédé Etat"
    | "privée (ENEO)"
    | "Tier privée"
    | "Tier AER"
    | "Tier MINEE"
    | "Tier MUNICIPALITE"
    | "Tier industriel"
    | "Tier Riverains"
    | "Tier MINEPAT"
): Actif[] => {
  return inventaireActifs.filter((actif) => actif.natureDuBien === nature);
};

export const getActifsByRegion = (region: string): Actif[] => {
  return inventaireActifs.filter((actif) => actif.region === region);
};

export const getActifsByDepartement = (departement: string): Actif[] => {
  return inventaireActifs.filter((actif) => actif.departement === departement);
};

export const getActifsByCommune = (commune: string): Actif[] => {
  return inventaireActifs.filter((actif) => actif.commune === commune);
};

export const getActifsByQuartier = (quartier: string): Actif[] => {
  return inventaireActifs.filter((actif) => actif.quartier === quartier);
};

export const getActifsByRue = (rue: string): Actif[] => {
  return inventaireActifs.filter((actif) => actif.rue === rue);
};

export const getActifsByDepart = (departId: string): Actif[] => {
  const depart = inventaireDeparts.find((d) => d.id === departId);
  if (!depart) return [];
  return depart.actifs
    .map((actifId) => getActifById(actifId))
    .filter(Boolean) as Actif[];
};

export const getActifsByEtat = (
  etat: "En service" | "Hors service"
): Actif[] => {
  return inventaireActifs.filter((actif) => {
    if ("etatFonctionnement" in actif) {
      return actif.etatFonctionnement === etat;
    }
    return false;
  });
};

export const getActifsByNatureDuBien = (
  nature: BaseActif["natureDuBien"]
): Actif[] => {
  return inventaireActifs.filter((actif) => actif.natureDuBien === nature);
};
/**
 * Calcule l'âge de l'actif en années
 */
function calculerAgeActif(actif: BaseActif, anneeCourante: number = new Date().getFullYear()): number {
  return anneeCourante - actif.anneeMiseEnService;
}

/**
 * Calcule la valeur résiduelle avec amortissement personnalisé
 */
function calculerAmortissementPersonnalise(actif: BaseActif, anneeCourante?: number): number {
  const age = calculerAgeActif(actif, anneeCourante);
  let valeurResiduelle = actif.valeurAcquisition;
  
  for (let i = 0; i < age; i++) {
    valeurResiduelle *= (1 - actif.tauxAmortissementAnnuel / 100);
  }
  
  return Math.max(0, valeurResiduelle);
}

/**
 * Ajuste la valeur en fonction de l'état visuel
 */
function ajusterPourEtat(actif: BaseActif, valeurCalculee: number): number {
  const coefficients = {
    'Bon': 1,
    'Moyen': 0.8,
    'Passable': 0.6,
    'Mauvais': 0.4
  };
  
  return valeurCalculee * coefficients[actif.etatVisuel];
}

/**
 * Fonction principale pour estimer la valeur actuelle
 */
export function estimerValeurActuelle(actif: BaseActif): number {
  const valeur = calculerAmortissementPersonnalise(actif);
  return ajusterPourEtat(actif, valeur);
}

/**
 * Vérifie si l'actif est totalement amorti (valeur résiduelle < 1% de la valeur d'acquisition)
 */
export function estTotalementAmorti(actif: BaseActif): boolean {
  const valeurResiduelle = estimerValeurActuelle(actif);
  return valeurResiduelle < (actif.valeurAcquisition * 0.01);
}

/**
 * Calcule la valeur théorique pour une année spécifique
 */
export function projetervaleur(actif: BaseActif, anneeFuture: number): number {
  return calculerAmortissementPersonnalise({
    ...actif,
    anneeMiseEnService: actif.anneeMiseEnService
  }, anneeFuture);
}

(function initialiserValorisationsAuChargement() {
  inventaireActifs.forEach(actif => {
    if (actif.valorisation === 0) {
      actif.valorisation = Math.round(estimerValeurActuelle(actif));
    }
  });

  inventaireDeparts.forEach(depart => {
    if (depart.valorisation === 0) {
      const valorisationTotale = depart.actifs.reduce((total, actifId) => {
        const actif = inventaireActifs.find(a => a.id === actifId);
        return total + (actif?.valorisation || 0);
      }, 0);
      depart.valorisation = valorisationTotale;
    }
  });
})();

export const getStatistiques = () => {
  const stats = {
    total: inventaireActifs.length,
    parType: {} as Record<string, number>,
    parRegion: {} as Record<string, number>,
    parCommunes: {} as Record<string, number>,
    parQuartier: {} as Record<string, number>,
    parRues: {} as Record<string, number>,
    parDepart: {} as Record<string, number>,
    parEtat: { "En service": 0, "Hors service": 0 },
    parNature: {} as Record<string, number>,
  };

  inventaireActifs.forEach((actif) => {
    // Statistiques par type
    stats.parType[actif.type] = (stats.parType[actif.type] || 0) + 1;

    // Statistiques par région
    stats.parRegion[actif.region] = (stats.parRegion[actif.region] || 0) + 1;

    // Statistiques par commune
    stats.parCommunes[actif.commune] =
      (stats.parCommunes[actif.commune] || 0) + 1;

    // Statistiques par quartier
    stats.parQuartier[actif.quartier] =
      (stats.parQuartier[actif.quartier] || 0) + 1;

    // Statistiques par rue
    stats.parRues[actif.rue] = (stats.parRues[actif.rue] || 0) + 1;

    // Statistiques par depart
    stats.parDepart[actif.numeroCompte] =
      (stats.parDepart[actif.numeroCompte] || 0) + 1;

    // Statistiques par état de fonctionnement
    if ("etatFonctionnement" in actif) {
      stats.parEtat[actif.etatFonctionnement]++;
    }

    // Statistiques par nature du bien
    stats.parNature[actif.natureDuBien] =
      (stats.parNature[actif.natureDuBien] || 0) + 1;
  });

  return stats;
};

// Export des types pour utilisation externe
export type {
  Actif,
  BaseActif,
  LigneAerienne,
  LigneSouterraine,
  PosteDistribution,
  TableauBT,
  Transformateur,
  CelluleDistributionSecondaire,
  CelluleDistributionPrimaire,
  Support,
  OCR,
  PointLivraison,
  EquipementStock,
};
