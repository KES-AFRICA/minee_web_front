export type ActifByRegion = {
  region: string;
  transformateurs: number;
  lignes: number;
  postes: number;
  valeur: number;
};

export type KPICardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "teal" | "cyan" | "emerald" | "amber";
  delay?: number;
};
