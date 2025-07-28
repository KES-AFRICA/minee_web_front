import type { Actif, BaseActif, Depart, LigneAerienne, Support, Transformateur } from "@/types";

// Utilitaires pour la génération aléatoire
const getRandomElement = <T>(array: readonly T[] | T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min: number, max: number, decimals: number = 2): number => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Données de référence pour la génération
const sampleData = {
    regions: ["Centre", "Littoral", "Ouest", "Nord", "Sud", "Extreme Nord", "Nord Ouest", "Sud Ouest", "Adamaoua", "Est"],
    departements: ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Garoua", "Maroua", "Ngaoundéré", "Bertoua", "Ebolowa", "Kribi"],
    villes: ["Douala", "Yaoundé", "Bafoussam", "Bamenda", "Garoua", "Maroua", "Ngaoundéré", "Bertoua", "Ebolowa", "Kribi"],
    communes: ["Commune 1", "Commune 2", "Commune 3", "Commune 4", "Commune 5"],
    quartiers: ["Quartier A", "Quartier B", "Quartier C", "Quartier D", "Quartier E"],
    rues: ["Rue de la Paix", "Avenue Principale", "Boulevard Central", "Rue Commerciale", "Avenue Résidentielle"],
    fabricants: ["Schneider Electric", "ABB", "Siemens", "General Electric", "Legrand", "Eaton"],
    marques: ["Schneider", "ABB", "Siemens", "GE", "Legrand", "Eaton"],
    typeDeBien: ["bien privée", "bien de retour", "bien de reprise", "bien cdi"] as const,
    natureDuBien: ["Concédé Etat", "privée (ENEO)", "Tier privée", "Tier AER", "Tier MINEE", "Tier MUNICIPALITE", "Tier industriel", "Tier Riverains", "Tier MINEPAT"] as const,
    etatVisuel: ["Bon", "Moyen", "Passable", "Mauvais"] as const,
    etatFonctionnement: ["En service", "Hors service"] as const,
    positionMateriel: ["Magasin", "Terrain"] as const,
    modeDacquisition: ["directe", "par projet", "par immobilisation en cours"] as const,
};

// Fonction pour générer les propriétés communes à tous les actifs
const generateBaseActif = (): BaseActif => {
    const anneeService = getRandomNumber(1990, 2024);
    const dureeVie = getRandomNumber(15, 40);
    const taux = getRandomFloat(2, 10, 1);
    const valeurAcquisition = getRandomNumber(50000, 5000000);
    const ageActuel = 2024 - anneeService;
    const valorisation = Math.max(valeurAcquisition * (1 - (taux / 100) * ageActuel), valeurAcquisition * 0.1);

    return {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        personnelKES: `KES-${getRandomNumber(1000, 9999)}`,
        personnelENEO: `ENEO-${getRandomNumber(1000, 9999)}`,
        personnelMINEE: `MINEE-${getRandomNumber(1000, 9999)}`,
        personnelARSEL: `ARSEL-${getRandomNumber(1000, 9999)}`,
        region: getRandomElement(sampleData.regions),
        departement: getRandomElement(sampleData.departements),
        ville: getRandomElement(sampleData.villes),
        arrondissement: `Arrondissement ${getRandomNumber(1, 5)}`,
        commune: getRandomElement(sampleData.communes),
        quartier: getRandomElement(sampleData.quartiers),
        rue: getRandomElement(sampleData.rues),
        precisionLieu: Math.random() > 0.5 ? `Près de ${getRandomElement(['école', 'marché', 'église', 'hôpital'])}` : undefined,
        codificationDecoupageENEO: `CD-${getRandomNumber(1000, 9999)}`,
        photo: [`photo_${generateId()}.jpg`, `photo_${generateId()}.jpg`],
        geolocalisation: {
            latitude: getRandomFloat(2, 13, 6),
            longitude: getRandomFloat(8, 16, 6)
        },
        valorisation: Math.round(valorisation),
        valeurAcquisition,
        anneeMiseEnService: anneeService,
        dureeDeVieEstimative: dureeVie,
        tauxAmortissementAnnuel: taux,
        positionMateriel: getRandomElement(sampleData.positionMateriel),
        etatVisuel: getRandomElement(sampleData.etatVisuel),
        numeroImmo: `IMMO-${getRandomNumber(100000, 999999)}`,
        nouveauNumeroImmo: Math.random() > 0.7 ? `NIMMO-${getRandomNumber(100000, 999999)}` : undefined,
        numeroCompte: `CPT-${getRandomNumber(10000, 99999)}`,
        libelleCompte: `Compte ${getRandomElement(['Équipement', 'Infrastructure', 'Matériel'])}`,
        modeDacquisition: getRandomElement(sampleData.modeDacquisition),
        TypeDeBien: getRandomElement(sampleData.typeDeBien),
        natureDuBien: getRandomElement(sampleData.natureDuBien),
        designationGenerale: `Équipement électrique ${getRandomNumber(1, 1000)}`
    };
};

// Générateur de Support
const generateSupport = (): Support => {
    const base = generateBaseActif();
    return {
        ...base,
        type: "SUPPORT",
        numeroLigne: `LG-${getRandomNumber(1000, 9999)}`,
        anneeImplantation: getRandomNumber(1990, 2024),
        nombreSupports: getRandomNumber(1, 10),
        classeSupport: `Classe ${getRandomElement(['A', 'B', 'C'])}`,
        effortTeteSupport: getRandomNumber(500, 2000),
        utilisation: getRandomElement(["MT", "BT"]),
        tension: getRandomElement([15000, 30000, 220, 380]),
        raisonsMauvaisEtat: base.etatVisuel === "Mauvais" ? "Corrosion avancée" : undefined,
        observations: `Support en ${base.etatVisuel.toLowerCase()} état`,
        structure: {
            simple: Math.random() > 0.5,
            jumele: Math.random() > 0.7,
            contrefiche: Math.random() > 0.8,
            portique: Math.random() > 0.9,
            transformateur: Math.random() > 0.8,
            IACM: Math.random() > 0.7,
            PMR: Math.random() > 0.6,
            IACT: Math.random() > 0.8,
            fusesave: Math.random() > 0.9,
            shotFuses: Math.random() > 0.9,
            isolateurs: Math.random() > 0.3,
            comptage: Math.random() > 0.7
        },
        materiaux: {
            bois: {
                quantite: getRandomNumber(0, 5),
                etat: getRandomElement(["Bon", "Mauvais"]),
                observation: "Matériau bois",
                geolocalisation: `${base.geolocalisation.latitude},${base.geolocalisation.longitude}`,
                photo: `photo_bois_${generateId()}.jpg`
            },
            beton: {
                quantite: getRandomNumber(0, 3),
                etat: getRandomElement(["Bon", "Mauvais"]),
                observation: "Matériau béton",
                geolocalisation: `${base.geolocalisation.latitude},${base.geolocalisation.longitude}`,
                photo: `photo_beton_${generateId()}.jpg`
            },
            metallique: {
                quantite: getRandomNumber(0, 8),
                etat: getRandomElement(["Bon", "Mauvais"]),
                observation: "Matériau métallique",
                geolocalisation: `${base.geolocalisation.latitude},${base.geolocalisation.longitude}`,
                photo: `photo_metal_${generateId()}.jpg`
            },
            treillis: {
                quantite: getRandomNumber(0, 4),
                etat: getRandomElement(["Bon", "Mauvais"]),
                observation: "Matériau treillis",
                geolocalisation: `${base.geolocalisation.latitude},${base.geolocalisation.longitude}`,
                photo: `photo_treillis_${generateId()}.jpg`
            }
        }
    };
};

// Générateur de Ligne Aérienne
const generateLigneAerienne = (): LigneAerienne => {
    const base = generateBaseActif();
    return {
        ...base,
        type: "LIGNE_AERIENNE",
        numeroLigne: `LA-${getRandomNumber(1000, 9999)}`,
        origineLigne: `Poste ${getRandomElement(['A', 'B', 'C', 'D'])}`,
        identificationDepart: `DEP-${getRandomNumber(100, 999)}`,
        tension: getRandomElement([15000, 30000, 220, 380]),
        etatFonctionnement: getRandomElement(sampleData.etatFonctionnement),
        typologieLigne: getRandomElement(["Principale", "Secondaire", "Dérivation", "Branchement"]),
        typeDistribution: getRandomElement(["Monophasé", "Triphasé"]),
        structureReseau: getRandomElement(["Radial", "Bouclé"]),
        typeCable: getRandomElement(["Torsadé", "Cuivre", "Alu/Acier", "Almélec"]),
        sectionConducteur: getRandomElement([25, 35, 50, 70, 95, 120, 150, 185, 240]),
        conducteur: getRandomElement(["Nu", "Isolé"]),
        typeIsolateurs: `Type ${getRandomElement(['I1', 'I2', 'I3'])}`,
        etatIsolateurs: getRandomElement(["Bon", "Moyen", "Mauvais"]),
        longueurLigne: getRandomFloat(0.5, 15, 2),
        observationEtat: `Ligne en état ${base.etatVisuel.toLowerCase()}`,
        nombreSupports: getRandomNumber(3, 25),
        supports: Array.from({ length: getRandomNumber(1, 5) }, () => generateSupport())
    };
};

// Générateur de Transformateur
const generateTransformateur = (): Transformateur => {
    const base = generateBaseActif();
    const puissance = getRandomElement([50, 100, 160, 250, 400, 630, 1000, 1600]);

    return {
        ...base,
        type: "TRANSFORMATEUR",
        nomPoste: `Poste ${getRandomElement(['Alpha', 'Beta', 'Gamma', 'Delta'])}`,
        departMT: `DEP-MT-${getRandomNumber(100, 999)}`,
        ensembleFonctionnel: `EF-${getRandomNumber(1, 100)}`,
        anneeFabrication: getRandomNumber(1990, 2024),
        fabricant: getRandomElement(sampleData.fabricants),
        marque: getRandomElement(sampleData.marques),
        typeTransformateur: `TR-${getRandomElement(['A', 'B', 'C'])}`,
        numeroSerie: `SN-${getRandomNumber(100000, 999999)}`,
        poidsTotal: getRandomNumber(500, 5000),
        poidsDielectrique: getRandomNumber(100, 1000),
        poidsDecuivrage: getRandomNumber(50, 500),
        etatFonctionnement: getRandomElement(sampleData.etatFonctionnement),
        raisonsHorsService: base.etatVisuel === "Mauvais" ? "Défaut isolation" : undefined,
        principauxIncidents: "Aucun incident majeur",
        typeTransfo: getRandomElement([
            "Transfo de puissance", "Transfo de distr", "Transfo de tension",
            "Transfo de courant", "Combiné TT -TC", "TSA BPN",
            "Combiné TSA - BPN", "Transfo MT/MT", "Transfo MT/BT"
        ]),
        dielectrique: getRandomElement(["Huile", "PCB", "Sec"]),
        typeMontage: getRandomElement(["Sol", "Poteau", "Cabine", "Struct. Acier"]),
        coordonneesGeographiques: `${base.geolocalisation.latitude},${base.geolocalisation.longitude}`,
        tensionPrimaire: getRandomElement([15000, 30000]),
        tensionSecondaire: getRandomElement([220, 380, 400]),
        puissance,
        courantPrimaire: Math.round(puissance / (Math.sqrt(3) * 15000) * 1000),
        courantSecondaire: Math.round(puissance / (Math.sqrt(3) * 380) * 1000),
        fuitesDielectriques: getRandomElement(["Aucune fuite", "Traces de fuites", "Fuites avérées"]),
        typeRefroidissement: getRandomElement(["ONAN", "ONAF", "OFAF", "ODAF"]),
        protectionMT: getRandomElement(["Fusible", "Disjoncteur", "Cellule", "Inter-fusible"]),
        protectionBT: getRandomElement(["Disj haut de poteau", "Disjoncteur BT", "Autres"]),
        observations: `Transformateur ${puissance}kVA en bon état de fonctionnement`
    };
};

// Fonction principale pour générer un actif selon le type spécifié
export const generateActif = (type?: string): Actif => {
    const availableTypes = [
        "LIGNE_AERIENNE", "LIGNE_SOUTERRAINE", "POSTE_DISTRIBUTION",
        "TABLEAU_BT", "TRANSFORMATEUR", "CELLULE_DISTRIBUTION_SECONDAIRE",
        "CELLULE_DISTRIBUTION_PRIMAIRE", "SUPPORT", "OCR",
        "POINT_LIVRAISON", "EQUIPEMENT_STOCK"
    ];

    const selectedType = type || getRandomElement(availableTypes);

    // Pour cet exemple, j'implémente les types les plus importants
    switch (selectedType) {
        case "LIGNE_AERIENNE":
            return generateLigneAerienne();
        case "SUPPORT":
            return generateSupport();
        case "TRANSFORMATEUR":
            return generateTransformateur();
        default:
            // Pour les autres types, génère une ligne aérienne par défaut
            return generateLigneAerienne();
    }
};

// Fonction pour générer plusieurs actifs
export const generateActifs = (count: number, type?: string): Actif[] => {
    return Array.from({ length: count }, () => generateActif(type));
};

// Fonction pour générer un départ
export const generateDepart = (actifs?: Actif[]): Depart => {
    const generatedActifs = actifs || generateActifs(getRandomNumber(5, 20));
    const regions = [...new Set(generatedActifs.map(a => a.region))];
    const departements = [...new Set(generatedActifs.map(a => a.departement))];
    const communes = [...new Set(generatedActifs.map(a => a.commune))];
    const quartiers = [...new Set(generatedActifs.map(a => a.quartier))];

    const valorisationTotale = generatedActifs.reduce((sum, actif) => sum + actif.valorisation, 0);
    const valeurAcquisitionTotale = generatedActifs.reduce((sum, actif) => sum + actif.valeurAcquisition, 0);

    // Calcul de la longueur totale (basé sur les lignes présentes)
    const longueurTotale = generatedActifs
        .filter(actif => actif.type === "LIGNE_AERIENNE" || actif.type === "LIGNE_SOUTERRAINE")
        .reduce((sum, ligne) => {
            return sum + ((ligne as LigneAerienne).longueurLigne || 0);
        }, 0);

    return {
        id: generateId(),
        nom: `Départ ${getRandomElement(['Nord', 'Sud', 'Est', 'Ouest', 'Centre'])}-${getRandomNumber(1, 999)}`,
        posteOrigine: `POSTE-${getRandomNumber(100, 999)}`,
        zonesGeographiques: {
            regions,
            departements,
            communes,
            quartiers
        },
        tension: getRandomElement([15000, 30000]),
        valorisation: valorisationTotale,
        valeurAcquisition: valeurAcquisitionTotale,
        longueurTotale,
        dateCreation: new Date(Date.now() - getRandomNumber(0, 365 * 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        etatGeneral: getRandomElement(["En service", "Hors service", "Maintenance"]),
        typeDepart: getRandomElement(["Principal", "Secondaire", "Industriel", "Résidentiel", "Commercial"]),
        actifs: generatedActifs.map(actif => actif.id)
    };
};

// Fonction pour générer plusieurs départs
export const generateDeparts = (count: number): Depart[] => {
    return Array.from({ length: count }, () => generateDepart());
};

// Fonction utilitaire pour générer un dataset complet
export const generateDataset = (options: {
    departsCount?: number;
    actifsPerDepart?: { min: number; max: number };
}) => {
    const { departsCount = 10, actifsPerDepart = { min: 5, max: 20 } } = options;

    const departs: Depart[] = [];
    const allActifs: Actif[] = [];

    for (let i = 0; i < departsCount; i++) {
        const actifCount = getRandomNumber(actifsPerDepart.min, actifsPerDepart.max);
        const actifs = generateActifs(actifCount);
        const depart = generateDepart(actifs);

        departs.push(depart);
        allActifs.push(...actifs);
    }

    return {
        departs,
        actifs: allActifs,
        statistics: {
            totalDeparts: departs.length,
            totalActifs: allActifs.length,
            totalValorisation: allActifs.reduce((sum, actif) => sum + actif.valorisation, 0),
            averageActifsPerDepart: Math.round(allActifs.length / departs.length)
        }
    };
};

// Exemple d'utilisation
  /*
  // Générer un actif aléatoire
  const actif = generateActif();
  
  // Générer un transformateur spécifiquement
  const transformateur = generateActif("TRANSFORMATEUR");
  
  // Générer 10 actifs aléatoires
  const actifs = generateActifs(10);
  
  // Générer un départ avec des actifs spécifiques
  const depart = generateDepart(actifs);
  
  // Générer 5 départs
  const departs = generateDeparts(5);
  
  // Générer un dataset complet
  const dataset = generateDataset({
    departsCount: 15,
    actifsPerDepart: { min: 8, max: 25 }
  });
  
  console.log(dataset);
  */


// Générer 10 actifs aléatoires
export const fakeActifs = generateActifs(10);

export const fakeDeparts = generateDeparts(5);