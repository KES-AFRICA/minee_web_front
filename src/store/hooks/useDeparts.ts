// src/store/hooks/useDeparts.ts
import { useMapStore } from "../mapStore";
import type { DepartConnection } from "../types";

/**
 * Hook personnalisé qui encapsule toutes les fonctionnalités liées aux départs
 */
export const useDeparts = () => {
  // Sélecteur pour les états et actions liés aux départs
  const {
    // États
    departs,
    filteredDeparts,
    selectedDepart,
    departConnections,
    favoriteDeparts,

    // Actions
    setDeparts,
    setSelectedDepart,
    selectActifsByDepart,
    toggleDepartVisibility,
    calculateDepartConnections,
    addFavoriteDepart,
    removeFavoriteDepart,
    centerOnDepart,
    compareDeparts,
    getDepartStatistics,

    // Exportation
    exportDepart,
    exportDepartAnalysis,

    // Options d'affichage
    showDepartConnections,
    showDepartLabels,
    connectionOpacity,
    showConnectionAnimation,
    setShowDepartConnections,
    setShowDepartLabels,
    setConnectionOpacity,
    setShowConnectionAnimation,
  } = useMapStore();

  return {
    // États
    departs,
    filteredDeparts,
    selectedDepart,
    departConnections,
    favoriteDeparts,
    totalCount: departs.length,
    filteredCount: filteredDeparts.length,

    // Actions
    setDeparts,
    setSelectedDepart,
    selectActifsByDepart,
    toggleDepartVisibility,
    calculateDepartConnections,
    addFavoriteDepart,
    removeFavoriteDepart,
    centerOnDepart,
    compareDeparts,
    getDepartStatistics,

    // Exportation
    exportDepart,
    exportDepartAnalysis,

    // Options d'affichage
    showDepartConnections,
    showDepartLabels,
    connectionOpacity,
    showConnectionAnimation,
    setShowDepartConnections,
    setShowDepartLabels,
    setConnectionOpacity,
    setShowConnectionAnimation,

    // Méthodes utilitaires
    isSelected: (departId: string) => selectedDepart === departId,
    isFavorite: (departId: string) => favoriteDeparts.includes(departId),
    getById: (departId: string) => departs.find((d) => d.id === departId),
    getByType: (type: string) => departs.filter((d) => d.typeDepart === type),
    getConnectionById: (departId: string): DepartConnection | undefined =>
      departConnections.find((conn) => conn.depart.id === departId),
    getVisibleConnections: (): DepartConnection[] =>
      departConnections.filter((conn) => conn.isVisible),
  };
};
