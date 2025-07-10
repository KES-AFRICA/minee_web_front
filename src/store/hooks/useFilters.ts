// src/store/hooks/useFilters.ts
import { useMapStore } from "../mapStore";


/**
 * Hook personnalisé qui encapsule toutes les fonctionnalités liées aux filtres
 */
export const useFilters = () => {
  // Sélecteur pour les états et actions liés aux filtres
  const {
    // États
    filters,
    advancedFilters,
    departFilters,
    searchTerm,
    departSearchTerm,
    filterHistory,
    autoSelectFiltered,

    // Actions
    setFilters,
    setAdvancedFilters,
    setDepartFilters,
    setSearchTerm,
    setDepartSearchTerm,
    setAutoSelectFiltered,
    applyFilters,
    applyDepartFilters,
    applyQuickFilter,
    saveFilterPreset,
    loadFilterPreset,
    clearAllFilters,
    getFilterInsights,
  } = useMapStore();

  // Calculer des statistiques supplémentaires sur les filtres
  const activeFiltersCount =
    (filters.types.length > 0 ? 1 : 0) +
    (filters.regions.length > 0 ? 1 : 0) +
    (filters.etatVisuel.length > 0 ? 1 : 0) +
    (filters.etatFonctionnement.length > 0 ? 1 : 0) +
    (advancedFilters.communes.length > 0 ? 1 : 0) +
    (advancedFilters.quartiers.length > 0 ? 1 : 0) +
    (searchTerm.trim() !== "" ? 1 : 0);

  const activeDepartFiltersCount =
    (departFilters.types.length > 0 ? 1 : 0) +
    (departFilters.regions.length > 0 ? 1 : 0) +
    (departFilters.etatGeneral.length > 0 ? 1 : 0) +
    (departSearchTerm.trim() !== "" ? 1 : 0);

  return {
    // États
    filters,
    advancedFilters,
    departFilters,
    searchTerm,
    departSearchTerm,
    filterHistory,
    autoSelectFiltered,

    // Statistiques
    activeFiltersCount,
    activeDepartFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
    hasActiveDepartFilters: activeDepartFiltersCount > 0,

    // Actions
    setFilters,
    setAdvancedFilters,
    setDepartFilters,
    setSearchTerm,
    setDepartSearchTerm,
    setAutoSelectFiltered,
    applyFilters,
    applyDepartFilters,
    applyQuickFilter,
    saveFilterPreset,
    loadFilterPreset,
    clearAllFilters,
    getFilterInsights,

    // Méthodes utilitaires
    setTypeFilter: (type: string, active: boolean) => {
      const newTypes = active
        ? [...filters.types, type]
        : filters.types.filter((t) => t !== type);
      setFilters({ types: newTypes });
    },

    setRegionFilter: (region: string, active: boolean) => {
      const newRegions = active
        ? [...filters.regions, region]
        : filters.regions.filter((r) => r !== region);
      setFilters({ regions: newRegions });
    },

    setEtatVisuelFilter: (etat: string, active: boolean) => {
      const newEtats = active
        ? [...filters.etatVisuel, etat]
        : filters.etatVisuel.filter((e) => e !== etat);
      setFilters({ etatVisuel: newEtats });
    },

    setAnneeRange: (min: number, max: number) => {
      setFilters({ anneeMiseEnService: { min, max } });
    },

    setCommuneFilter: (commune: string, active: boolean) => {
      const newCommunes = active
        ? [...advancedFilters.communes, commune]
        : advancedFilters.communes.filter((c) => c !== commune);
      setAdvancedFilters({ communes: newCommunes });
    },

    setQuartierFilter: (quartier: string, active: boolean) => {
      const newQuartiers = active
        ? [...advancedFilters.quartiers, quartier]
        : advancedFilters.quartiers.filter((q) => q !== quartier);
      setAdvancedFilters({ quartiers: newQuartiers });
    },

    setDepartTypeFilter: (type: string, active: boolean) => {
      const newTypes = active
        ? [...departFilters.types, type]
        : departFilters.types.filter((t) => t !== type);
      setDepartFilters({ types: newTypes });
    },

    getPresetByName: (name: string) =>
      filterHistory.find((preset) => preset.name === name),
  };
};
