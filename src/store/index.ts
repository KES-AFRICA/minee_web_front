// src/store/index.ts
export { useMapStore } from "./mapStore";
//export type { MapStore } from "./mapStore";
export * from "./types";

// Exporter les hooks pour l'utilisation facile des slices
export { useActifs } from "./hooks/useActifs";
export { useDeparts } from "./hooks/useDeparts";
export { useFilters } from "./hooks/useFilters";
export { useAnalytics } from "./hooks/useAnalytics";
