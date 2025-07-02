import type { User } from "../components/pages/utilisateur/types";

export const Users: User[] = [
  {
    id: "1",
    fullName: "Jean Dupont",
    email: "jean.dupont@eneo.cm",
    role: {
      id: "1",
      name: "Administrateur systeme",
    },
    status: "Actif",
    createdAt: "15/03/2024",
    avatar: "",
    structure: {
      id: "1",
      name: "Eneo",
    },
  },
  {
    id: "2",
    fullName: "Marie Kamga",
    email: "marie.kamga@eneo.cm",
    role: {
      id: "2",
      name: "Collecteur",
    },
    status: "Bloqué",
    createdAt: "22/04/2024",
    avatar: "",
    structure: {
      id: "2",
      name: "KES IP",
    },
  },
  {
    id: "3",
    fullName: "Paul Mbappe",
    email: "paul.mbappe@eneo.cm",
    role: {
      id: "2",
      name: "Administrateur Eneo",
    },
    status: "Inactif",
    createdAt: "05/05/2024",
    avatar: "",
    structure: {
      id: "3",
      name: "Minee",
    },
  },
  {
    id: "4",
    fullName: "Alice Ngo",
    email: "alice.ngo@eneo.cm",
    role: {
      id: "2",
      name: "Administrateur Kes ",
    },
    status: "Actif",
    createdAt: "18/06/2024",
    avatar: "",
    structure: {
      id: "4",
      name: "KES EC",
    },
  },
  {
    id: "5",
    fullName: "Lucie Tchoupo",
    email: "lucie.tchoupo@eneo.cm",
    role: {
      id: "2",
      name: "Collecteur",
    },
    status: "Actif",
    createdAt: "25/07/2024",
    avatar: "",
    structure: {
      id: "1",
      name: "Eneo",
    },
  },
];

export const UserStructures = [
  {
    id: "1",
    name: "Eneo",
  },
  {
    id: "2",
    name: "KES IP",
  },
  {
    id: "3",
    name: "Minee",
  },
  {
    id: "4",
    name: "KES EC",
  },
];

export const UserRoles = [
  {
    id: "1",
    name: "Administrateur systeme",
  },
  {
    id: "2",
    name: "Administrateur Kes ",
  },
  {
    id: "3",
    name: "Administrateur Eneo",
  },
  {
    id: "4",
    name: "Collecteur",
  },
];

export const currentUser = {
  id: "1",
  fullName: "Admin",
  email: "admin@eneo.cm",
  position: "Administrateur système",
  phone: "+237 6 XX XX XX XX",
  role: {
    id: "1",
    name: "Administrateur systeme",
  },
  status: "Actif",
  createdAt: "15/03/2024",
  structure: {
    id: "1",
    name: "Eneo",
  },
};
