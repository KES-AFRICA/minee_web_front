export type Asset = {
  id: string;
  name: string;
  type: "Transformateur" | "Ligne" | "Poste" | "Compteur" | "Générateur";
  location: string;
  status: "Actif" | "En maintenance" | "Hors service" | "En panne";
  installationDate: string;
  lastInspection: string;
  value: number;
  criticality: "Haute" | "Moyenne" | "Basse";
};
