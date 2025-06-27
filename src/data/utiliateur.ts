import type { User } from "../components/pages/utilisateur/types";

export const Users: User[] = [
  {
    id: "1",
    fullName: "Jean Dupont",
    email: "jean.dupont@eneo.cm",
    role: "Administrateur",
    status: "Actif",
    createdAt: "15/03/2024",
    avatar: "",
  },
  {
    id: "2",
    fullName: "Marie Kamga",
    email: "marie.kamga@eneo.cm",
    role: "Collecteur",
    status: "Actif",
    createdAt: "22/04/2024",
  },
  {
    id: "3",
    fullName: "Paul Mbappe",
    email: "paul.mbappe@eneo.cm",
    role: "Technicien",
    status: "Inactif",
    createdAt: "05/05/2024",
  },
  {
    id: "4",
    fullName: "Alice Ngo",
    email: "alice.ngo@eneo.cm",
    role: "Superviseur",
    status: "Actif",
    createdAt: "18/06/2024",
  },
];
