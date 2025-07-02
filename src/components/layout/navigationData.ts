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
        name: "Immobilisations",
        href: "/immobilisations",
        iconName: "immobilisations",
      },
    ],
  },
  {
    items: [
      {
        name: "Suivi de l'inventaire",
        href: "/suivi-inventaire",
        iconName: "suivi_inventaire",
      },
    ],
  },
  {
    items: [
      {
        name: "SIG",
        href: "/systeme_information_graphique",
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
