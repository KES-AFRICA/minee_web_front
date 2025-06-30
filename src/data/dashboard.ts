export const actifsByRegion = [
  {
    region: "Centre",
    transformateurs: 450,
    lignes: 1200,
    postes: 89,
    valeur: 12500000,
  },
  {
    region: "Littoral",
    transformateurs: 380,
    lignes: 950,
    postes: 67,
    valeur: 9800000,
  },
];

export const typeActifs = [
  { name: "Transformateurs", value: 2590, color: "#0D9488" },
  { name: "Lignes HT/MT", value: 6710, color: "#06B6D4" },
  { name: "Postes", value: 438, color: "#14B8A6" },
  { name: "Cables aerien", value: 610, color: "#06B6D477" },
  { name: "Cable souterain", value: 418, color: "#14B" },
  { name: "Poteaux", value: 1580, color: "#220" },
  { name: "Point de livraison", value: 1820, color: "#2EE" },
];

export const regionsData = {
  Littoral: {
    communes: [
      {
        name: "Douala 1",
        actifs: {
          transformateurs: 450,
          lignes: 1200,
          postes: 85,
          cablesAerien: 120,
          cableSouterrain: 89,
          poteaux: 320,
          pointLivraison: 380,
        },
      },
      {
        name: "Douala 2",
        actifs: {
          transformateurs: 380,
          lignes: 980,
          postes: 65,
          cablesAerien: 95,
          cableSouterrain: 67,
          poteaux: 280,
          pointLivraison: 320,
        },
      },
      {
        name: "Douala 3",
        actifs: {
          transformateurs: 420,
          lignes: 1100,
          postes: 78,
          cablesAerien: 110,
          cableSouterrain: 82,
          poteaux: 300,
          pointLivraison: 350,
        },
      },
      {
        name: "Douala 4",
        actifs: {
          transformateurs: 290,
          lignes: 850,
          postes: 55,
          cablesAerien: 80,
          cableSouterrain: 58,
          poteaux: 220,
          pointLivraison: 280,
        },
      },
      {
        name: "Douala 5",
        actifs: {
          transformateurs: 350,
          lignes: 950,
          postes: 68,
          cablesAerien: 90,
          cableSouterrain: 72,
          poteaux: 260,
          pointLivraison: 310,
        },
      },
      {
        name: "Edea",
        actifs: {
          transformateurs: 180,
          lignes: 520,
          postes: 35,
          cablesAerien: 45,
          cableSouterrain: 28,
          poteaux: 140,
          pointLivraison: 180,
        },
      },
    ],
    totalValeur: 2850000000,
  },
  Centre: {
    communes: [
      {
        name: "Yaoundé 1",
        actifs: {
          transformateurs: 320,
          lignes: 890,
          postes: 62,
          cablesAerien: 85,
          cableSouterrain: 65,
          poteaux: 250,
          pointLivraison: 290,
        },
      },
      {
        name: "Yaoundé 2",
        actifs: {
          transformateurs: 280,
          lignes: 750,
          postes: 48,
          cablesAerien: 70,
          cableSouterrain: 52,
          poteaux: 210,
          pointLivraison: 250,
        },
      },
      {
        name: "Yaoundé 3",
        actifs: {
          transformateurs: 260,
          lignes: 680,
          postes: 45,
          cablesAerien: 65,
          cableSouterrain: 48,
          poteaux: 190,
          pointLivraison: 230,
        },
      },
      {
        name: "Yaoundé 4",
        actifs: {
          transformateurs: 240,
          lignes: 620,
          postes: 42,
          cablesAerien: 60,
          cableSouterrain: 45,
          poteaux: 180,
          pointLivraison: 210,
        },
      },
      {
        name: "Mbalmayo",
        actifs: {
          transformateurs: 150,
          lignes: 420,
          postes: 28,
          cablesAerien: 35,
          cableSouterrain: 25,
          poteaux: 120,
          pointLivraison: 140,
        },
      },
      {
        name: "Obala",
        actifs: {
          transformateurs: 120,
          lignes: 350,
          postes: 22,
          cablesAerien: 28,
          cableSouterrain: 20,
          poteaux: 95,
          pointLivraison: 110,
        },
      },
    ],
    totalValeur: 1950000000,
  },
};

export const evolutionValeur = [
  { mois: "Jan", valeur: 65000000, maintenance: 2100000 },
  { mois: "Fév", valeur: 67200000, maintenance: 1950000 },
  { mois: "Mar", valeur: 69500000, maintenance: 2300000 },
  { mois: "Avr", valeur: 71800000, maintenance: 2000000 },
  { mois: "Mai", valeur: 73600000, maintenance: 2250000 },
  { mois: "Jun", valeur: 75800000, maintenance: 2100000 },
];

export const etatActifs = [
  { etat: "Excellent", count: 3580, pourcentage: 32 },
  { etat: "Bon", count: 4250, pourcentage: 38 },
  { etat: "Moyen", count: 2340, pourcentage: 21 },
  { etat: "Critique", count: 1000, pourcentage: 9 },
];
