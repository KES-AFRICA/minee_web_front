// src/store/slices/filtersSlice.ts
import { StateCreator } from "zustand";
import type { FiltersState, RootState } from "../types";
import type { Filters } from "@/types";

export interface FiltersSlice extends FiltersState {
  // Actions pour les filtres
  setFilters: (filters: Partial<Filters>) => void;
  setAdvancedFilters: (filters: Partial<FiltersState["advancedFilters"]>) => void;
  setDepartFilters: (filters: Partial<FiltersState["departFilters"]>) => void;
  applyFilters: () => void;
  applyDepartFilters: () => void;
  applyQuickFilter: (type: "recent" | "old" | "defaillant" | "highValue") => void;
  saveFilterPreset: (name: string) => void;
  loadFilterPreset: (presetId: string) => void;
  clearAllFilters: () => void;
  getFilterInsights: () => any;
}

// Créateur du slice Filtres
export const createFiltersSlice: StateCreator<
  RootState,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  // État initial
  filters: {
    types: [],
    regions: [],
    etatVisuel: [],
    etatFonctionnement: [],
    anneeMiseEnService: {
      min: 1990,
      max: 2025,
    },
  },
  departFilters: {
    types: [],
    regions: [],
    etatGeneral: [],
    tensionRange: {
      min: 0,
      max: 30000,
    },
  },
  advancedFilters: {
    valorisationRange: {
      min: 0,
      max: 10000000,
    },
    ageRange: { min: 0, max: 25 },
    communes: [],
    quartiers: [],
  },
  filterHistory: [],

  // Actions
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  setAdvancedFilters: (newFilters) => {
    set((state) => ({
      advancedFilters: { ...state.advancedFilters, ...newFilters },
    }));
    get().applyFilters();
  },

  setDepartFilters: (newFilters) => {
    set((state) => ({
      departFilters: { ...state.departFilters, ...newFilters },
    }));
    get().applyDepartFilters();
  },

  applyFilters: () =>
    set((state) => {
      const {
        actifs,
        filters,
        advancedFilters,
        searchTerm,
        autoSelectFiltered,
      } = state;
      let filtered = actifs;

      // Apply search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (actif) =>
            actif.designationGenerale?.toLowerCase().includes(searchLower) ||
            actif.type.toLowerCase().includes(searchLower) ||
            actif.region.toLowerCase().includes(searchLower) ||
            actif.commune?.toLowerCase().includes(searchLower) ||
            actif.quartier?.toLowerCase().includes(searchLower)
        );
      }

      // Apply type filter
      if (filters.types.length > 0) {
        filtered = filtered.filter((actif) =>
          filters.types.includes(actif.type)
        );
      }

      // Apply region filter
      if (filters.regions.length > 0) {
        filtered = filtered.filter((actif) =>
          filters.regions.includes(actif.region)
        );
      }

      // Apply visual state filter
      if (filters.etatVisuel.length > 0) {
        filtered = filtered.filter((actif) =>
          filters.etatVisuel.includes(actif.etatVisuel)
        );
      }

      // Apply functional state filter
      if (filters.etatFonctionnement.length > 0) {
        filtered = filtered.filter((actif) => {
          const etatFonctionnement = (actif as any).etatFonctionnement;
          return (
            etatFonctionnement &&
            filters.etatFonctionnement.includes(etatFonctionnement)
          );
        });
      }

      // Apply year filter
      filtered = filtered.filter(
        (actif) =>
          actif.anneeMiseEnService >= filters.anneeMiseEnService.min &&
          actif.anneeMiseEnService <= filters.anneeMiseEnService.max
      );

      // Apply advanced filters
      // Valorisation filter
      filtered = filtered.filter(
        (actif) =>
          actif.valorisation >= advancedFilters.valorisationRange.min &&
          actif.valorisation <= advancedFilters.valorisationRange.max
      );

      // Age filter
      const currentYear = new Date().getFullYear();
      filtered = filtered.filter((actif) => {
        const age = currentYear - actif.anneeMiseEnService;
        return (
          age >= advancedFilters.ageRange.min &&
          age <= advancedFilters.ageRange.max
        );
      });

      // Commune filter
      if (advancedFilters.communes.length > 0) {
        filtered = filtered.filter((actif) =>
          advancedFilters.communes.includes(actif.commune)
        );
      }

      // Quartier filter
      if (advancedFilters.quartiers.length > 0) {
        filtered = filtered.filter((actif) =>
          advancedFilters.quartiers.includes(actif.quartier)
        );
      }

      // Auto-select filtered actifs if enabled
      const selectedActifs = autoSelectFiltered
        ? filtered
        : state.selectedActifs;

      return {
        filteredActifs: filtered,
        selectedActifs,
        isSidebarOpen: selectedActifs.length > 0,
      };
    }),

  applyDepartFilters: () =>
    set((state) => {
      const { departs, departFilters, departSearchTerm } = state;
      let filtered = departs;

      // Apply search filter
      if (departSearchTerm.trim()) {
        const searchLower = departSearchTerm.toLowerCase();
        filtered = filtered.filter(
          (depart) =>
            depart.nom.toLowerCase().includes(searchLower) ||
            depart.typeDepart.toLowerCase().includes(searchLower) ||
            depart.zonesGeographiques.regions.some((r) =>
              r.toLowerCase().includes(searchLower)
            ) ||
            depart.zonesGeographiques.communes.some((c) =>
              c.toLowerCase().includes(searchLower)
            )
        );
      }

      // Apply type filter
      if (departFilters.types.length > 0) {
        filtered = filtered.filter((depart) =>
          departFilters.types.includes(depart.typeDepart)
        );
      }

      // Apply region filter
      if (departFilters.regions.length > 0) {
        filtered = filtered.filter((depart) =>
          depart.zonesGeographiques.regions.some((r) =>
            departFilters.regions.includes(r)
          )
        );
      }

      // Apply state filter
      if (departFilters.etatGeneral.length > 0) {
        filtered = filtered.filter((depart) =>
          departFilters.etatGeneral.includes(depart.etatGeneral)
        );
      }

      // Apply tension filter
      filtered = filtered.filter(
        (depart) =>
          depart.tension >= departFilters.tensionRange.min &&
          depart.tension <= departFilters.tensionRange.max
      );

      return { filteredDeparts: filtered };
    }),

  applyQuickFilter: (type) => {
    const { actifs } = get();
    let filteredIds: string[] = [];
    const currentYear = new Date().getFullYear();

    switch (type) {
      case "recent":
        // Actifs mis en service après 2020
        filteredIds = actifs
          .filter((a) => a.anneeMiseEnService >= 2020)
          .map((a) => a.id);
        break;
      case "old":
        // Actifs mis en service avant 2010
        filteredIds = actifs
          .filter((a) => a.anneeMiseEnService < 2010)
          .map((a) => a.id);
        break;
      case "defaillant":
        // Actifs en mauvais état
        filteredIds = actifs
          .filter((a) => a.etatVisuel === "Mauvais" || a.etatVisuel === "Pourri Critique")
          .map((a) => a.id);
        break;
      case "highValue":
        // Actifs de forte valorisation (> 500000)
        filteredIds = actifs
          .filter((a) => a.valorisation > 500000)
          .map((a) => a.id);
        break;
    }

    const selectedActifs = actifs.filter((a) => filteredIds.includes(a.id));
    set({
      selectedActifs,
      isSidebarOpen: selectedActifs.length > 0,
    });
  },

  saveFilterPreset: (name) => {
    const { filters, advancedFilters } = get();
    const preset = {
      id: Date.now().toString(),
      name,
      filters,
      advancedFilters,
      timestamp: new Date(),
    };

    set((state) => ({
      filterHistory: [...state.filterHistory, preset],
    }));
  },

  loadFilterPreset: (presetId) => {
    const { filterHistory } = get();
    const preset = filterHistory.find((p) => p.id === presetId);
    if (preset) {
      set({
        filters: preset.filters,
        advancedFilters: preset.advancedFilters,
      });
      get().applyFilters();
    }
  },

  clearAllFilters: () => {
    const { actifs, departs } = get();
    set({
      filters: {
        types: [],
        regions: [],
        etatVisuel: [],
        etatFonctionnement: [],
        anneeMiseEnService: {
          min: Math.min(...actifs.map((a) => a.anneeMiseEnService)),
          max: Math.max(...actifs.map((a) => a.anneeMiseEnService)),
        },
      },
      advancedFilters: {
        valorisationRange: {
          min: Math.min(...actifs.map((a) => a.valorisation)),
          max: Math.max(...actifs.map((a) => a.valorisation)),
        },
        ageRange: { min: 0, max: 25 },
        communes: [],
        quartiers: [],
      },
      departFilters: {
        types: [],
        regions: [],
        etatGeneral: [],
        tensionRange: {
          min: Math.min(...departs.map((d) => d.tension)),
          max: Math.max(...departs.map((d) => d.tension)),
        },
      },
      searchTerm: "",
      departSearchTerm: "",
      selectedDepart: null,
      selectedActifs: [],
    });
    get().applyFilters();
    get().applyDepartFilters();
  },

  getFilterInsights: () => {
    const { actifs, filteredActifs } = get();

    return {
      filterEfficiency: (filteredActifs.length / actifs.length) * 100,
      mostFilteredTypes: Object.entries(
        filteredActifs.reduce((acc, actif) => {
          acc[actif.type] = (acc[actif.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      )
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      regionCoverage: [...new Set(filteredActifs.map((a) => a.region))].length,
      averageAge:
        filteredActifs.reduce(
          (sum, actif) =>
            sum + (new Date().getFullYear() - actif.anneeMiseEnService),
          0
        ) / filteredActifs.length || 0,
      valueRange: {
        min: Math.min(...filteredActifs.map((a) => a.valorisation)),
        max: Math.max(...filteredActifs.map((a) => a.valorisation)),
        average:
          filteredActifs.reduce((sum, a) => sum + a.valorisation, 0) /
            filteredActifs.length || 0,
      },
    };
  },
});
a) => a.anneeMiseEnService)),
        },
      },
      advancedFilters: {
        valorisationRange: {
          min: Math.min(...actifs.map((a) => a.valorisation)),
          max: Math.max(...actifs.map((a) => a.valorisation)),
        },
        ageRange: { min: 0, max: 25 },
        communes: [],
        quartiers: [],  
        },
        selectedActifs: [],
        isSidebarOpen: false,
      };
    }), 
    clearAllFilters: () => {
      const { actifs, departs } = get();
      set({
        filters: {
          types: [],
          regions: [],
          etatVisuel: [],
          etatFonctionnement: [],
          anneeMiseEnService: {
            min: Math.min(...actifs.map((a) => a.anneeMiseEnService)),
            max: Math.max(...actifs.map((a) => a.anneeMiseEnService)),
          },
        },
        advancedFilters: {
          valorisationRange: {
            min: Math.min(...actifs.map((a) => a.valorisation)),
            max: Math.max(...actifs.map((a) => a.valorisation)),
          },
          ageRange: { min: 0, max: 25 },
          communes: [],
          quartiers: [],
        },
        departFilters: {
          types: [],
          regions: [],
          etatGeneral: [],
          tensionRange: {
            min: Math.min(...departs.map((d) => d.tension)),
            max: Math.max(...departs.map((d) => d.tension)),
          },
        },
        searchTerm: "",
        departSearchTerm: "",
        selectedDepart: null,
        selectedActifs: [],
      });
      get().applyFilters();
      get().applyDepartFilters();
    }
  }),
    getFilterInsights: () => {
        const { actifs, filteredActifs } = get();
    
        return {
        filterEfficiency: (filteredActifs.length / actifs.length) * 100,
        mostFilteredTypes: Object.entries(
            filteredActifs.reduce((acc, actif) => {
            acc[actif.type] = (acc[actif.type] || 0) + 1;
            return acc;
            }, {} as Record<string, number>)
        )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5),
        regionCoverage: [...new Set(filteredActifs.map((a) => a.region))].length,
        averageAge:
            filteredActifs.reduce(
            (sum, actif) =>
                sum + (new Date().getFullYear() - actif.anneeMiseEnService),
            0
            ) / filteredActifs.length || 0,
        valueRange: {
            min: Math.min(...filteredActifs.map((a) => a.valorisation)),
            max: Math.max(...filteredActifs.map((a) => a.valorisation)),
            average:
            filteredActifs.reduce((sum, a) => sum + a.valorisation, 0) /
                filteredActifs.length || 0,
        },
        };
    },  
    