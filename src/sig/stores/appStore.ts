import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import type { Actif, Depart, Filters, MapView, SelectionArea } from '../types';
import { apiService } from '../services/api';

// 1. Séparer les interfaces pour une meilleure organisation
interface DataState {
  actifs: Actif[];
  departs: Depart[];
  filteredActifs: Actif[];
}

interface UIState {
  loading: boolean;
  error: string | null;
  showExportModal: boolean;
  showSelectionTools: boolean;
  currentPage: number;
  itemsPerPage: number;
}

interface FilterState {
  filters: Filters;
  selectionArea: SelectionArea | null;
}

interface MapState {
  mapView: MapView;
  selectedActifs: string[];
}

interface AppState extends DataState, UIState, FilterState, MapState { }

// 2. Créer des actions plus spécifiques et optimisées
interface DataActions {
  loadActifs: () => Promise<void>;
  loadDeparts: () => Promise<void>;
  refreshData: () => Promise<void>;
}

interface FilterActions {
  updateFilters: (updates: Partial<Filters>) => void;
  resetFilters: () => void;
  applyFilters: () => Promise<void>;
}

interface SelectionActions {
  selectActifs: (ids: string[]) => void;
  toggleActifSelection: (id: string) => void;
  selectAllFilteredActifs: () => void;
  clearSelection: () => void;
  selectActifsInArea: (area: SelectionArea) => void;
}

interface UIActions {
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  toggleExportModal: () => void;
  toggleSelectionTools: () => void;
  setMapView: (view: MapView) => void;
  setSelectionArea: (area: SelectionArea | null) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

interface ExportActions {
  exportData: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
}

interface AppActions extends DataActions, FilterActions, SelectionActions, UIActions, ExportActions { }

// 3. Optimiser les filtres initiaux
const initialFilters: Filters = {
  types: [],
  regions: [],
  etatsVisuels: [],
  etatsFonctionnement: [],
  anneeMin: 1990,
  anneeMax: new Date().getFullYear(),
  searchTerm: '',
  selectedArea: undefined
};

// 4. Créer des utilitaires pour le debouncing
class FilterDebouncer {
  private timeoutId: NodeJS.Timeout | null = null;

  debounce(fn: () => void, delay: number = 300) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(fn, delay);
  }

  clear() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

const filterDebouncer = new FilterDebouncer();

// 5. Créer des sélecteurs optimisés
export const selectors = {
  // Sélecteurs pour éviter les re-renders inutiles
  getActifs: (state: AppState) => state.actifs,
  getFilteredActifs: (state: AppState) => state.filteredActifs,
  getSelectedActifs: (state: AppState) => state.selectedActifs,
  getFilters: (state: AppState) => state.filters,
  getUIState: (state: AppState) => ({
    loading: state.loading,
    error: state.error,
    showExportModal: state.showExportModal,
    showSelectionTools: state.showSelectionTools
  }),
  getPaginationState: (state: AppState) => ({
    currentPage: state.currentPage,
    itemsPerPage: state.itemsPerPage,
    totalItems: state.filteredActifs.length,
    totalPages: Math.ceil(state.filteredActifs.length / state.itemsPerPage)
  }),
  getPaginatedActifs: (state: AppState) => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.filteredActifs.slice(startIndex, endIndex);
  },
  getSelectedActifsData: (state: AppState) =>
    state.actifs.filter(actif => state.selectedActifs.includes(actif.id)),
  hasSelection: (state: AppState) => state.selectedActifs.length > 0,
  isAllFilteredActifsSelected: (state: AppState) =>
    state.filteredActifs.length > 0 &&
    state.filteredActifs.every(actif => state.selectedActifs.includes(actif.id))
};

// 6. Store principal optimisé
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // État initial
        actifs: [],
        departs: [],
        filteredActifs: [],
        loading: false,
        error: null,
        filters: { ...initialFilters },
        mapView: 'carte' as MapView,
        selectedActifs: [],
        selectionArea: null,
        showSelectionTools: false,
        showExportModal: false,
        currentPage: 1,
        itemsPerPage: 20,

        // Actions optimisées
        loadActifs: async () => {
          const state = get();
          if (state.loading) return; // Éviter les appels multiples

          set((draft) => {
            draft.loading = true;
            draft.error = null;
          });

          try {
            const actifs = await apiService.getActifs();
            set((draft) => {
              draft.actifs = actifs;
              draft.filteredActifs = actifs;
              draft.loading = false;
            });
          } catch (error) {
            set((draft) => {
              draft.error = error instanceof Error ? error.message : 'Erreur lors du chargement';
              draft.loading = false;
            });
          }
        },

        loadDeparts: async () => {
          try {
            const departs = await apiService.getDeparts();
            set((draft) => {
              draft.departs = departs;
            });
          } catch (error) {
            console.error('Erreur lors du chargement des départs:', error);
            set((draft) => {
              draft.error = 'Erreur lors du chargement des départements';
            });
          }
        },

        refreshData: async () => {
          const actions = get();
          await Promise.allSettled([
            actions.loadActifs(),
            actions.loadDeparts()
          ]);
        },

        updateFilters: (updates) => {
          set((draft) => {
            Object.assign(draft.filters, updates);
          });

          // Debounce optimisé
          filterDebouncer.debounce(() => {
            get().applyFilters();
          }, 300);
        },

        resetFilters: () => {
          filterDebouncer.clear();
          set((draft) => {
            draft.filters = { ...initialFilters };
            draft.selectionArea = null;
            draft.currentPage = 1;
            draft.selectedActifs = []; // Clear selection aussi
          });
          get().applyFilters();
        },

        applyFilters: async () => {
          const state = get();

          set((draft) => {
            draft.loading = true;
            draft.error = null;
          });

          try {
            const filteredActifs = await apiService.getActifs(state.filters);
            set((draft) => {
              draft.filteredActifs = filteredActifs;
              draft.loading = false;
              draft.currentPage = 1;
              // Nettoyer la sélection des actifs qui ne sont plus dans les résultats filtrés
              draft.selectedActifs = draft.selectedActifs.filter(id =>
                filteredActifs.some(actif => actif.id === id)
              );
            });
          } catch (error) {
            set((draft) => {
              draft.error = error instanceof Error ? error.message : 'Erreur lors du filtrage';
              draft.loading = false;
            });
          }
        },

        setMapView: (view) => {
          set((draft) => {
            draft.mapView = view;
          });
        },

        setSelectionArea: (area) => {
          set((draft) => {
            draft.selectionArea = area;
            if (area) {
              draft.filters.selectedArea = area;
            } else {
              delete draft.filters.selectedArea;
            }
          });
          get().applyFilters();
        },

        toggleSelectionTools: () => {
          set((draft) => {
            draft.showSelectionTools = !draft.showSelectionTools;
            if (!draft.showSelectionTools) {
              draft.selectionArea = null;
              delete draft.filters.selectedArea;
            }
          });
        },

        selectActifs: (ids) => {
          set((draft) => {
            draft.selectedActifs = [...ids]; // Créer une nouvelle référence
          });
        },

        toggleActifSelection: (id) => {
          set((draft) => {
            const index = draft.selectedActifs.indexOf(id);
            if (index >= 0) {
              draft.selectedActifs.splice(index, 1);
            } else {
              draft.selectedActifs.push(id);
            }
          });
        },

        selectAllFilteredActifs: () => {
          set((draft) => {
            draft.selectedActifs = draft.filteredActifs.map(a => a.id);
          });
        },

        clearSelection: () => {
          set((draft) => {
            draft.selectedActifs = [];
          });
        },

        // Nouvelle action pour sélectionner dans une zone
        selectActifsInArea: (area) => {
          if (!area) return;
          const state = get();
          const actifsInArea = state.filteredActifs.filter(actif => {
            // Logique pour vérifier si l'actif est dans la zone
            // À adapter selon votre logique métier
            console.log(`Vérification de l'actif ${actif.id} dans la zone`, area);
            return true; // Placeholder
          });

          set((draft) => {
            draft.selectedActifs = actifsInArea.map(a => a.id);
          });
        },

        toggleExportModal: () => {
          set((draft) => {
            draft.showExportModal = !draft.showExportModal;
          });
        },

        exportData: async (format) => {
          const state = get();

          if (state.selectedActifs.length === 0) {
            set((draft) => {
              draft.error = 'Aucun actif sélectionné pour l\'export';
            });
            return;
          }

          set((draft) => {
            draft.loading = true;
            draft.error = null;
          });

          try {
            const blob = await apiService.exportActifs(state.selectedActifs, format);

            // Optimiser le téléchargement
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `actifs_${format}_${new Date().toISOString().split('T')[0]}.${format}`;

            // Éviter l'ajout au DOM
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Nettoyer immédiatement
            setTimeout(() => URL.revokeObjectURL(url), 100);

            set((draft) => {
              draft.loading = false;
              draft.showExportModal = false;
            });
          } catch (error) {
            set((draft) => {
              draft.error = error instanceof Error ? error.message : 'Erreur lors de l\'export';
              draft.loading = false;
            });
          }
        },

        setPage: (page) => {
          const state = get();
          const maxPage = Math.ceil(state.filteredActifs.length / state.itemsPerPage);
          const validPage = Math.max(1, Math.min(page, maxPage));

          set((draft) => {
            draft.currentPage = validPage;
          });
        },

        setItemsPerPage: (count) => {
          const validCount = Math.max(1, Math.min(count, 100)); // Limiter entre 1 et 100

          set((draft) => {
            draft.itemsPerPage = validCount;
            draft.currentPage = 1;
          });
        },

        setError: (error) => {
          set((draft) => {
            draft.error = error;
          });
        },

        setLoading: (loading) => {
          set((draft) => {
            draft.loading = loading;
          });
        }
      }))
    ),
    {
      name: 'map-store', // Pour le devtools
    }
  )
);

// 7. Hooks spécialisés pour éviter les re-renders
export const useActifs = () => useAppStore(selectors.getActifs);
export const useFilteredActifs = () => useAppStore(selectors.getFilteredActifs);
export const usePaginatedActifs = () => useAppStore(selectors.getPaginatedActifs);
export const useSelectedActifs = () => useAppStore(selectors.getSelectedActifs);
export const useFilters = () => useAppStore(selectors.getFilters);
export const useUIState = () => useAppStore(selectors.getUIState);
export const usePagination = () => useAppStore(selectors.getPaginationState);
export const useHasSelection = () => useAppStore(selectors.hasSelection);

// 8. Hook pour les actions (évite de re-créer les fonctions)
export const useAppActions = () => useAppStore((state) => ({
  loadActifs: state.loadActifs,
  loadDeparts: state.loadDeparts,
  refreshData: state.refreshData,
  updateFilters: state.updateFilters,
  resetFilters: state.resetFilters,
  applyFilters: state.applyFilters,
  selectActifs: state.selectActifs,
  toggleActifSelection: state.toggleActifSelection,
  selectAllFilteredActifs: state.selectAllFilteredActifs,
  clearSelection: state.clearSelection,
  toggleExportModal: state.toggleExportModal,
  exportData: state.exportData,
  setPage: state.setPage,
  setItemsPerPage: state.setItemsPerPage,
  setMapView: state.setMapView,
  setSelectionArea: state.setSelectionArea,
  toggleSelectionTools: state.toggleSelectionTools
}));