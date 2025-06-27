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
  {
    region: "Ouest",
    transformateurs: 320,
    lignes: 800,
    postes: 54,
    valeur: 8200000,
  },
  {
    region: "Nord-Ouest",
    transformateurs: 280,
    lignes: 720,
    postes: 45,
    valeur: 7100000,
  },
  {
    region: "Sud",
    transformateurs: 250,
    lignes: 650,
    postes: 38,
    valeur: 6500000,
  },
  {
    region: "Est",
    transformateurs: 200,
    lignes: 520,
    postes: 32,
    valeur: 5200000,
  },
  {
    region: "Nord",
    transformateurs: 180,
    lignes: 480,
    postes: 28,
    valeur: 4800000,
  },
  {
    region: "Adamaoua",
    transformateurs: 150,
    lignes: 390,
    postes: 24,
    valeur: 3900000,
  },
  {
    region: "Sud-Ouest",
    transformateurs: 220,
    lignes: 580,
    postes: 35,
    valeur: 5800000,
  },
  {
    region: "Extrême-Nord",
    transformateurs: 160,
    lignes: 420,
    postes: 26,
    valeur: 4200000,
  },
];

export const typeActifs = [
  { name: "Transformateurs", value: 2590, color: "#0D9488" },
  { name: "Lignes HT/MT", value: 6710, color: "#06B6D4" },
  { name: "Postes", value: 438, color: "#14B8A6" },
  { name: "Équipements", value: 1580, color: "#22D3EE" },
  { name: "Cables aerien", value: 610, color: "#06B6D477" },
  { name: "Cable souterain", value: 418, color: "#14B" },
  { name: "Support", value: 1580, color: "#220" },
  { name: "Point de livraison", value: 180, color: "#2EE" },
];

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
