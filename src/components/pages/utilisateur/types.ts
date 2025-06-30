export type User = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: "Actif" | "Inactif" | "Bloqué";
  createdAt: string;
  avatar?: string;
  structure: UserStructure;
};

export type UserStructure = {
  id: string;
  name: string;
};
export type UserRole = {
  id: string;
  name: string;
};
