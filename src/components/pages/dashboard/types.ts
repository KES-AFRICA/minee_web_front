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

export const Colors = [
  "#00c853", // Indigo moderne
  "#10b981", // Emerald
  "#c5e1a5", // Amber
  "#00e5ff", // Red
  "#1de9b6", // Violet
  "#004d40", // Cyan
  "#01579b", // Lime
  "#4dd0e1", // Orange
  "#80cbc4", // Pink
  "#14b8a6", // Teal
  "#00acc1", // Purple
  "#3b82f6", // Blue
];
export const Colors2 = [
  "#8884d8",
  "#82ca9d",
  "#00ff97a7",
  "#80cbc4",
  "#004d40",
  "#ff9800",
  "#a4de6c",
  "#00e5ff",
  "#03a9f4",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
];