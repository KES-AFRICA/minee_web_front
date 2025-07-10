// src/store/hooks/useActifs.ts
import { useMapStore } from "../mapStore";

/**
 * Hook personnalisé qui encapsule toutes les fonctionnalités liées aux actifs
 */
export const useActifs = () => {
  // Sélecteur pour les états et actions liés aux actifs
  const {
    // États
    actifs,
    filteredActifs,
    selectedActifs,

    // Actions
    setActifs,
    setSelectedActifs,
    addSelectedActif,
    removeSelectedActif,
    clearSelection,
    selectFilteredActifs,
    selectActifsByType,
    selectActifsByRegion,
    selectActifsByEtat,
    invertSelection,
    searchActifs,
    getActifsInRadius,
    findSimilarActifs,
    importActifs,

    // Exportation
    // exportSelection, // Commented out until implemented in MapStore
    //exportFiltered,

    // Outils de carte
    centerOnActif,
    fitMapToSelection,
  } = useMapStore();

  return {
    // États
    actifs,
    filteredActifs,
    selectedActifs,
    selectedCount: selectedActifs.length,
    filteredCount: filteredActifs.length,
    totalCount: actifs.length,

    // Actions
    setActifs,
    setSelectedActifs,
    addSelectedActif,
    removeSelectedActif,
    clearSelection,
    selectFilteredActifs,
    selectActifsByType,
    selectActifsByRegion,
    selectActifsByEtat,
    invertSelection,
    searchActifs,
    getActifsInRadius,
    findSimilarActifs,
    importActifs,

    // Exportation
    //exportSelection,
    //exportFiltered,

    // Outils de carte
    centerOnActif,
    fitMapToSelection,

    // Méthodes utilitaires
    isSelected: (actifId: string) =>
      selectedActifs.some((a) => a.id === actifId),
    getById: (actifId: string) => actifs.find((a) => a.id === actifId),
    getByType: (type: string) => actifs.filter((a) => a.type === type),
    getByRegion: (region: string) => actifs.filter((a) => a.region === region),
    getByEtat: (etat: string) => actifs.filter((a) => a.etatVisuel === etat),
  };
};
