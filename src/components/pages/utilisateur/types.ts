export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "Administrateur" | "Superviseur" | "Technicien" | "Collecteur";
  status: "Actif" | "Inactif";
  createdAt: string;
  avatar?: string;
};
