// src/store/utils/colorUtils.ts

/**
 * Obtient une couleur distinctive pour un départ en fonction de son type et de son ID
 */
export const getDepartColor = (
  typeDepart: string,
  departId: string
): string => {
  const colors: Record<string, string[]> = {
    Principal: ["#e74c3c", "#c0392b", "#a93226", "#922b21"],
    Résidentiel: ["#3498db", "#2980b9", "#2471a3", "#1f618d"],
    Commercial: ["#f39c12", "#e67e22", "#d68910", "#b7950b"],
    Industriel: ["#9b59b6", "#8e44ad", "#7d3c98", "#6c3483"],
    Secondaire: ["#27ae60", "#229954", "#1e8449", "#186a3b"],
    Mixte: ["#e67e22", "#d35400", "#ba4a00", "#a04000"],
  };

  const typeColors = colors[typeDepart] || [
    "#95a5a6",
    "#7f8c8d",
    "#707b7c",
    "#5d6d7e",
  ];

  // Utiliser l'ID du départ pour choisir une couleur spécifique
  const colorIndex = parseInt(departId.replace(/\D/g, "")) % typeColors.length;
  return typeColors[colorIndex];
};

/**
 * Obtient une couleur pour un type d'actif
 */
export const getActifTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    LIGNE_AERIENNE: "#3498db",
    LIGNE_SOUTERRAINE: "#9b59b6",
    TRANSFORMATEUR: "#e74c3c",
    POSTE_DISTRIBUTION: "#27ae60",
    SUPPORT: "#f39c12",
    OCR: "#c0392b",
    TABLEAU_BT: "#2980b9",
    CELLULE_DISTRIBUTION_SECONDAIRE: "#16a085",
    CELLULE_DISTRIBUTION_PRIMAIRE: "#2c3e50",
    POINT_LIVRAISON: "#e84393",
    EQUIPEMENT_STOCK: "#f1c40f",
  };

  return colors[type] || "#95a5a6";
};

/**
 * Obtient une couleur en fonction de l'état d'un actif
 */
export const getEtatColor = (etat: string): string => {
  const colors: Record<string, string> = {
    Bon: "#27ae60",
    Moyen: "#f39c12",
    Passable: "#e67e22",
    Mauvais: "#e74c3c",
    "Pourri Critique": "#c0392b",
  };

  return colors[etat] || "#95a5a6";
};

/**
 * Obtient une couleur en fonction de l'âge d'un actif
 */
export const getAgeColor = (anneeMiseEnService: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - anneeMiseEnService;

  if (age < 5) return "#27ae60"; // Très récent - vert
  if (age < 10) return "#2ecc71"; // Récent - vert clair
  if (age < 15) return "#f39c12"; // Moyen - orange
  if (age < 20) return "#e67e22"; // Ancien - orange foncé
  return "#e74c3c"; // Très ancien - rouge
};
