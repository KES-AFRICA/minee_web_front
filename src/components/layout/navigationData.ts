export interface NavigationItem {
  name: string;
  href: string;
  iconName?: string;
  badge?: string;
}
export interface NavigationGroup {
  items: NavigationItem[];
}

export const navigationLinks: NavigationGroup[] = [
  {
    items: [
      {
        name: "Tableau de Bord",
        href: "/",
        iconName: "dashboard",
      },
    ],
  },
  {
    items: [
      {
        name: "Utilisateurs",
        href: "/utilisateur",
        iconName: "utilisateur",
      },
    ],
  },
  {
    items: [
      {
        name: "Actifs",
        href: "/actifs",
        iconName: "actifs",
      },
    ],
  },
  {
    items: [
      {
        name: "Cartographie",
        href: "/carte",
        iconName: "carte",
      },
    ],
  },
  {
    items: [
      {
        name: "Rapports",
        href: "/rapport",
        iconName: "rapport",
      },
    ],
  },
  {
    items: [
      {
        name: "Parametres",
        href: "/parametres",
        iconName: "parametres",
      },
    ],
  },
];
