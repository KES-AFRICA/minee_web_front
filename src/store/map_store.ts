/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mtData, posteData, supportsData, type GeoJSONFeature } from '@/data/sup';

// Types pour le store
export interface ConversionStats {
  totalFeatures: number;
  validCoordinates: number;
  invalidCoordinates: number;
}

export interface LayerVisibility {
  mt: boolean;
  postes: boolean;
  supports: boolean;
}

export interface FilterCriteria {
  // Filtres pour les supports
  supportType: string | null;
  supportStatus: string | null;

  // Filtres pour les postes
  postType: string | null;
  postStatus: string | null;
  postVoltage: string | null;

  // Filtres pour les lignes MT
  lineType: string | null;
  lineStatus: string | null;
  lineVoltage: string | null;

  // Filtres généraux
  searchTerm: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface SelectionState {
  selectedFeatures: GeoJSONFeature[];
  selectionMode: 'single' | 'multiple';
  highlightedFeatures: string[]; // Changé de Set à array pour éviter les problèmes de sérialisation
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'kml' | 'excel';
  includeGeometry: boolean;
  selectedOnly: boolean;
  layerTypes: ('mt' | 'postes' | 'supports')[];
}

export interface MapState {
  // État de la carte
  mapInstance: L.Map | null;
  isMapInitialized: boolean;
  mapType: 'street' | 'satellite' | 'terrain';

  // Couches et visibilité
  layerVisibility: LayerVisibility;
  selectedLayer: string;

  // Sélection
  selection: SelectionState;

  // Statistiques
  conversionStats: ConversionStats;

  // Filtres
  filters: FilterCriteria;
  activeFilters: string[];
  filteredFeatures: {
    mt: GeoJSONFeature[];
    postes: GeoJSONFeature[];
    supports: GeoJSONFeature[];
  };

  // UI
  showLayerPanel: boolean;
  showInfoPanel: boolean;
  showStatsPanel: boolean;
  showFilterPanel: boolean;
  showSelectionPanel: boolean;
  showExportPanel: boolean;
}

export interface MapActions {
  // Actions pour la carte
  setMapInstance: (map: L.Map | null) => void;
  setMapInitialized: (initialized: boolean) => void;
  setMapType: (type: 'street' | 'satellite' | 'terrain') => void;
  toggleMapType: () => void;

  // Actions pour les couches
  toggleLayer: (layerName: keyof LayerVisibility) => void;
  setLayerVisibility: (layerName: keyof LayerVisibility, visible: boolean) => void;
  setSelectedLayer: (layer: string) => void;
  showAllLayers: () => void;
  hideAllLayers: () => void;

  // Actions pour la sélection
  addToSelection: (feature: GeoJSONFeature) => void;
  removeFromSelection: (featureId: string) => void;
  clearSelection: () => void;
  setSelectionMode: (mode: 'single' | 'multiple') => void;
  selectAll: (layerType?: 'mt' | 'postes' | 'supports') => void;
  highlightFeature: (featureId: string) => void;
  unhighlightFeature: (featureId: string) => void;
  clearHighlights: () => void;

  // Actions pour les statistiques
  updateConversionStats: (stats: ConversionStats) => void;
  incrementValidCoordinates: () => void;
  incrementInvalidCoordinates: () => void;

  // Actions pour les filtres
  setFilter: (filterKey: keyof FilterCriteria, value: any) => void;
  clearFilters: () => void;
  clearFilter: (filterKey: keyof FilterCriteria) => void;
  applyFilters: (features: { mt: GeoJSONFeature[]; postes: GeoJSONFeature[]; supports: GeoJSONFeature[] }) => void;
  addActiveFilter: (filterName: string) => void;
  removeActiveFilter: (filterName: string) => void;

  // Actions pour l'exportation
  exportSelection: (options: ExportOptions) => void;
  exportFilteredData: (options: ExportOptions) => void;
  exportAll: (options: ExportOptions) => void;

  // Actions pour l'UI
  toggleLayerPanel: () => void;
  toggleInfoPanel: () => void;
  toggleStatsPanel: () => void;
  toggleFilterPanel: () => void;
  toggleSelectionPanel: () => void;
  toggleExportPanel: () => void;
  setShowLayerPanel: (show: boolean) => void;
  setShowInfoPanel: (show: boolean) => void;
  setShowStatsPanel: (show: boolean) => void;
  setShowFilterPanel: (show: boolean) => void;
  setShowSelectionPanel: (show: boolean) => void;
  setShowExportPanel: (show: boolean) => void;

  // Actions utilitaires
  resetStore: () => void;
  fitMapToBounds: (bounds: L.LatLngBounds) => void;
}

// État initial
const initialState: MapState = {
  mapInstance: null,
  isMapInitialized: false,
  mapType: 'street',
  layerVisibility: {
    mt: true,
    postes: true,
    supports: true,
  },
  selectedLayer: 'all',
  selection: {
    selectedFeatures: [],
    selectionMode: 'single',
    highlightedFeatures: [], // Array au lieu de Set
  },
  conversionStats: {
    totalFeatures: 0,
    validCoordinates: 0,
    invalidCoordinates: 0,
  },
  filters: {
    supportType: null,
    supportStatus: null,
    postType: null,
    postStatus: null,
    postVoltage: null,
    lineType: null,
    lineStatus: null,
    lineVoltage: null,
    searchTerm: '',
    dateRange: {
      start: null,
      end: null,
    },
  },
  activeFilters: [],
  filteredFeatures: {
    mt: [],
    postes: [],
    supports: [],
  },
  showLayerPanel: true,
  showInfoPanel: true,
  showStatsPanel: true,
  showFilterPanel: false,
  showSelectionPanel: false,
  showExportPanel: false,
};

// Création du store
export const useMapStore = create<MapState & MapActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Actions pour la carte
      setMapInstance: (map) => set({ mapInstance: map }),
      setMapInitialized: (initialized) => set({ isMapInitialized: initialized }),
      setMapType: (type) => set({ mapType: type }),

      // Correction: toggleMapType pour 3 types
      toggleMapType: () => set((state) => {
        const typeOrder: ('street' | 'satellite' | 'terrain')[] = ['street', 'satellite', 'terrain'];
        const currentIndex = typeOrder.indexOf(state.mapType);
        const nextIndex = (currentIndex + 1) % typeOrder.length;
        return { mapType: typeOrder[nextIndex] };
      }),

      // Actions pour les couches
      toggleLayer: (layerName) =>
        set((state) => ({
          layerVisibility: {
            ...state.layerVisibility,
            [layerName]: !state.layerVisibility[layerName],
          },
        })),

      setLayerVisibility: (layerName, visible) =>
        set((state) => ({
          layerVisibility: {
            ...state.layerVisibility,
            [layerName]: visible,
          },
        })),

      setSelectedLayer: (layer) => set({ selectedLayer: layer }),

      showAllLayers: () =>
        set({
          layerVisibility: {
            mt: true,
            postes: true,
            supports: true,
          },
        }),

      hideAllLayers: () =>
        set({
          layerVisibility: {
            mt: false,
            postes: false,
            supports: false,
          },
        }),

      // Actions pour la sélection
      addToSelection: (feature) =>
        set((state) => {
          const isAlreadySelected = state.selection.selectedFeatures.some(
            (f) => f.properties.id === feature.properties.id
          );

          if (isAlreadySelected) return state;

          if (state.selection.selectionMode === 'single') {
            return {
              ...state,
              selection: {
                ...state.selection,
                selectedFeatures: [feature],
              },
            };
          } else {
            return {
              ...state,
              selection: {
                ...state.selection,
                selectedFeatures: [...state.selection.selectedFeatures, feature],
              },
            };
          }
        }),

      removeFromSelection: (featureId) =>
        set((state) => ({
          ...state,
          selection: {
            ...state.selection,
            selectedFeatures: state.selection.selectedFeatures.filter(
              (f) => f.properties.id !== featureId
            ),
          },
        })),

      clearSelection: () =>
        set((state) => ({
          ...state,
          selection: {
            ...state.selection,
            selectedFeatures: [],
          },
        })),

      setSelectionMode: (mode) =>
        set((state) => ({
          ...state,
          selection: {
            ...state.selection,
            selectionMode: mode,
            selectedFeatures: mode === 'single' ? state.selection.selectedFeatures.slice(0, 1) : state.selection.selectedFeatures,
          },
        })),

      selectAll: (layerType) =>
        set((state) => {
          const { filteredFeatures } = state;
          let featuresToSelect: GeoJSONFeature[] = [];

          if (layerType) {
            featuresToSelect = filteredFeatures[layerType];
          } else {
            featuresToSelect = [
              ...filteredFeatures.mt,
              ...filteredFeatures.postes,
              ...filteredFeatures.supports,
            ];
          }

          return {
            ...state,
            selection: {
              ...state.selection,
              selectedFeatures: featuresToSelect,
            },
          };
        }),

      // Correction: highlightFeature avec array
      highlightFeature: (featureId) =>
        set((state) => {
          if (state.selection.highlightedFeatures.includes(featureId)) {
            return state;
          }
          return {
            ...state,
            selection: {
              ...state.selection,
              highlightedFeatures: [...state.selection.highlightedFeatures, featureId],
            },
          };
        }),

      unhighlightFeature: (featureId) =>
        set((state) => ({
          ...state,
          selection: {
            ...state.selection,
            highlightedFeatures: state.selection.highlightedFeatures.filter(id => id !== featureId),
          },
        })),

      clearHighlights: () =>
        set((state) => ({
          ...state,
          selection: {
            ...state.selection,
            highlightedFeatures: [],
          },
        })),

      // Actions pour les statistiques
      updateConversionStats: (stats) => set({ conversionStats: stats }),

      incrementValidCoordinates: () =>
        set((state) => ({
          conversionStats: {
            ...state.conversionStats,
            validCoordinates: state.conversionStats.validCoordinates + 1,
          },
        })),

      incrementInvalidCoordinates: () =>
        set((state) => ({
          conversionStats: {
            ...state.conversionStats,
            invalidCoordinates: state.conversionStats.invalidCoordinates + 1,
          },
        })),

      // Actions pour les filtres
      setFilter: (filterKey, value) =>
        set((state) => ({
          ...state,
          filters: {
            ...state.filters,
            [filterKey]: value,
          },
        })),

      clearFilters: () =>
        set((state) => ({
          ...state,
          filters: {
            ...initialState.filters,
          },
          activeFilters: [],
        })),

      clearFilter: (filterKey) =>
        set((state) => ({
          ...state,
          filters: {
            ...state.filters,
            [filterKey]: filterKey === 'dateRange' ? { start: null, end: null } :
              filterKey === 'searchTerm' ? '' : null,
          },
        })),

      applyFilters: (features) =>
        set((state) => {
          const { filters } = state;

          const filterFeatures = (featureArray: GeoJSONFeature[], type: 'mt' | 'postes' | 'supports') => {
            return featureArray.filter(feature => {
              const props = feature.properties;

              // Filtre de recherche général
              if (filters.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                const searchableText = Object.values(props).join(' ').toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
              }

              // Filtres spécifiques selon le type
              if (type === 'supports') {
                if (filters.supportType && props.type !== filters.supportType) return false;
                if (filters.supportStatus && props.status !== filters.supportStatus) return false;
              } else if (type === 'postes') {
                if (filters.postType && props.type !== filters.postType) return false;
                if (filters.postStatus && props.status !== filters.postStatus) return false;
                if (filters.postVoltage && props.voltage !== filters.postVoltage) return false;
              } else if (type === 'mt') {
                if (filters.lineType && props.type !== filters.lineType) return false;
                if (filters.lineStatus && props.status !== filters.lineStatus) return false;
                if (filters.lineVoltage && props.voltage !== filters.lineVoltage) return false;
              }

              // Filtre par date
              if (filters.dateRange.start && props.date) {
                const featureDate = new Date(props.date);
                if (featureDate < filters.dateRange.start) return false;
              }
              if (filters.dateRange.end && props.date) {
                const featureDate = new Date(props.date);
                if (featureDate > filters.dateRange.end) return false;
              }

              return true;
            });
          };

          return {
            ...state,
            filteredFeatures: {
              mt: filterFeatures(features.mt, 'mt'),
              postes: filterFeatures(features.postes, 'postes'),
              supports: filterFeatures(features.supports, 'supports'),
            },
          };
        }),

      addActiveFilter: (filterName) =>
        set((state) => {
          if (state.activeFilters.includes(filterName)) return state;
          return {
            ...state,
            activeFilters: [...state.activeFilters, filterName],
          };
        }),

      removeActiveFilter: (filterName) =>
        set((state) => ({
          ...state,
          activeFilters: state.activeFilters.filter(f => f !== filterName),
        })),

      // Actions pour l'exportation
      exportSelection: (options) => {
        const { selection } = get();
        exportData(selection.selectedFeatures, options);
      },

      exportFilteredData: (options) => {
        const { filteredFeatures } = get();
        let dataToExport: GeoJSONFeature[] = [];

        options.layerTypes.forEach(layerType => {
          dataToExport = [...dataToExport, ...filteredFeatures[layerType]];
        });

        exportData(dataToExport, options);
      },

      exportAll: (options) => {
        const allFeatures = [...mtData.features, ...posteData.features, ...supportsData.features];
        exportData(allFeatures, options);
      },

      // Actions pour l'UI
      toggleLayerPanel: () =>
        set((state) => ({ showLayerPanel: !state.showLayerPanel })),

      toggleInfoPanel: () =>
        set((state) => ({ showInfoPanel: !state.showInfoPanel })),

      toggleStatsPanel: () =>
        set((state) => ({ showStatsPanel: !state.showStatsPanel })),

      toggleFilterPanel: () =>
        set((state) => ({ showFilterPanel: !state.showFilterPanel })),

      toggleSelectionPanel: () =>
        set((state) => ({ showSelectionPanel: !state.showSelectionPanel })),

      toggleExportPanel: () =>
        set((state) => ({ showExportPanel: !state.showExportPanel })),

      setShowLayerPanel: (show) => set({ showLayerPanel: show }),
      setShowInfoPanel: (show) => set({ showInfoPanel: show }),
      setShowStatsPanel: (show) => set({ showStatsPanel: show }),
      setShowFilterPanel: (show) => set({ showFilterPanel: show }),
      setShowSelectionPanel: (show) => set({ showSelectionPanel: show }),
      setShowExportPanel: (show) => set({ showExportPanel: show }),

      // Actions utilitaires
      resetStore: () => set({ ...initialState }),

      fitMapToBounds: (bounds) => {
        const { mapInstance } = get();
        if (mapInstance) {
          mapInstance.fitBounds(bounds, { padding: [20, 20] });
        }
      },
    }),
    {
      name: 'map-store',
      // Simplification du partialize pour éviter les problèmes
      partialize: (state: { mapType: any; layerVisibility: any; selectedLayer: any; showLayerPanel: any; showInfoPanel: any; showStatsPanel: any; showFilterPanel: any; showSelectionPanel: any; showExportPanel: any; }) => ({
        mapType: state.mapType,
        layerVisibility: state.layerVisibility,
        selectedLayer: state.selectedLayer,
        showLayerPanel: state.showLayerPanel,
        showInfoPanel: state.showInfoPanel,
        showStatsPanel: state.showStatsPanel,
        showFilterPanel: state.showFilterPanel,
        showSelectionPanel: state.showSelectionPanel,
        showExportPanel: state.showExportPanel,
      }),
    }
  )
);

// Fonctions d'exportation (inchangées)
const exportData = (features: GeoJSONFeature[], options: ExportOptions) => {
  const { format, includeGeometry } = options;

  const processedFeatures = features.map(feature => {
    const processed: any = {
      ...feature.properties,
    };

    if (includeGeometry) {
      processed.geometry = feature.geometry;
    }

    return processed;
  });

  switch (format) {
    case 'json':
      downloadJSON(processedFeatures, 'export.json');
      break;
    case 'csv':
      downloadCSV(processedFeatures, 'export.csv');
      break;
    case 'kml':
      downloadKML(features, 'export.kml');
      break;
    case 'excel':
      downloadExcel(processedFeatures, 'export.xlsx');
      break;
  }
};

const downloadJSON = (data: unknown[], filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadCSV = (data: unknown[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0] as Record<string, unknown>);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${(row as Record<string, unknown>)[header] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadKML = (features: GeoJSONFeature[], filename: string) => {
  const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    ${features.map(feature => `
      <Placemark>
        <name>${feature.properties.name || feature.properties.id || 'Unnamed'}</name>
        <description>${Object.entries(feature.properties).map(([k, v]) => `${k}: ${v}`).join('\n')}</description>
        ${feature.geometry.type === 'Point' ? `
          <Point>
            <coordinates>${feature.geometry.coordinates.join(',')}</coordinates>
          </Point>
        ` : ''}
      </Placemark>
    `).join('')}
  </Document>
</kml>`;

  const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadExcel = (data: unknown[], filename: string) => {
  console.log('Export Excel nécessite la bibliothèque xlsx');
  downloadCSV(data, filename.replace('.xlsx', '.csv'));
};

// Sélecteurs personnalisés optimisés
export const useLayerVisibility = () => useMapStore((state) => state.layerVisibility);
export const useSelection = () => useMapStore((state) => state.selection);
export const useConversionStats = () => useMapStore((state) => state.conversionStats);
export const useMapInstance = () => useMapStore((state) => state.mapInstance);
export const useFilters = () => useMapStore((state) => state.filters);
export const useFilteredFeatures = () => useMapStore((state) => state.filteredFeatures);
export const useActiveFilters = () => useMapStore((state) => state.activeFilters);

// Sélecteurs calculés
export const useVisibleLayersCount = () =>
  useMapStore((state) => {
    const { layerVisibility } = state;
    return Object.values(layerVisibility).filter(Boolean).length;
  });

export const useHasActiveFilters = () =>
  useMapStore((state) => {
    const { filters } = state;
    return (
      filters.searchTerm.length > 0 ||
      filters.supportType !== null ||
      filters.supportStatus !== null ||
      filters.postType !== null ||
      filters.postStatus !== null ||
      filters.postVoltage !== null ||
      filters.lineType !== null ||
      filters.lineStatus !== null ||
      filters.lineVoltage !== null ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null
    );
  });

export const useSelectedCount = () =>
  useMapStore((state) => state.selection.selectedFeatures.length);

export const useFilteredCount = () =>
  useMapStore((state) => {
    const { filteredFeatures } = state;
    return filteredFeatures.mt.length + filteredFeatures.postes.length + filteredFeatures.supports.length;
  });

// Hooks personnalisés optimisés
export const useLayerActions = () => useMapStore((state) => ({
  toggleLayer: state.toggleLayer,
  setLayerVisibility: state.setLayerVisibility,
  showAllLayers: state.showAllLayers,
  hideAllLayers: state.hideAllLayers,
  setSelectedLayer: state.setSelectedLayer,
}));

export const useSelectionActions = () => useMapStore((state) => ({
  addToSelection: state.addToSelection,
  removeFromSelection: state.removeFromSelection,
  clearSelection: state.clearSelection,
  setSelectionMode: state.setSelectionMode,
  selectAll: state.selectAll,
  highlightFeature: state.highlightFeature,
  unhighlightFeature: state.unhighlightFeature,
  clearHighlights: state.clearHighlights,
}));

export const useFilterActions = () => useMapStore((state) => ({
  setFilter: state.setFilter,
  clearFilters: state.clearFilters,
  clearFilter: state.clearFilter,
  applyFilters: state.applyFilters,
  addActiveFilter: state.addActiveFilter,
  removeActiveFilter: state.removeActiveFilter,
}));

export const useExportActions = () => useMapStore((state) => ({
  exportSelection: state.exportSelection,
  exportFilteredData: state.exportFilteredData,
  exportAll: state.exportAll,
}));

// Hooks pour le type de carte
export const useMapType = () => useMapStore((state) => state.mapType);
export const useMapTypeActions = () => useMapStore((state) => ({
  setMapType: state.setMapType,
  toggleMapType: state.toggleMapType,
}));