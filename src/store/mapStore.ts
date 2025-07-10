import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Actif,
  Depart,
  Filters,
  SelectionArea,
  DrawingMode,
  DepartConnection,
  StatistiquesDepart,
} from "@/types";
import { actifs, departs } from "@/data/exp";

interface MapState {
  // Data
  actifs: Actif[];
  departs: Depart[];
  filteredActifs: Actif[];

  // Selection
  selectedActifs: Actif[];
  selectionArea: SelectionArea;

  // Filters
  filters: Filters;
  searchTerm: string;

  // UI State
  isSidebarOpen: boolean;
  isDrawingMode: DrawingMode;

  // Map state
  mapBounds: L.LatLngBounds | null;

  // Depart management
  selectedDepart: string | null;
  departConnections: DepartConnection[];
  showDepartConnections: boolean;
  showDepartLabels: boolean;
  showAllActifs: boolean;

  // Actions
  setActifs: (actifs: Actif[]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  applyFilters: () => void;
  setSearchTerm: (term: string) => void;

  // Selection actions
  setSelectedActifs: (actifs: Actif[]) => void;
  addSelectedActif: (actif: Actif) => void;
  removeSelectedActif: (id: string) => void;
  clearSelection: () => void;

  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setDrawingMode: (mode: DrawingMode) => void;

  // Map actions
  setMapBounds: (bounds: L.LatLngBounds) => void;

  // Depart actions
  setSelectedDepart: (departId: string | null) => void;
  setShowDepartConnections: (show: boolean) => void;
  setShowDepartLabels: (show: boolean) => void;
  setShowAllActifs: (show: boolean) => void;
  toggleDepartVisibility: (departId: string) => void;
  centerOnDepart: (departId: string) => void;
  getDepartStatistics: (departId: string) => StatistiquesDepart | null;

  // Export actions
  exportSelection: (format: "csv" | "json" | "excel") => void;
}

// Helper function to generate depart connections
const generateDepartConnections = (
  departs: Depart[],
  actifs: Actif[]
): DepartConnection[] => {
  const colors = [
    "#e74c3c",
    "#3498db",
    "#f39c12",
    "#9b59b6",
    "#27ae60",
    "#e67e22",
    "#34495e",
    "#16a085",
    "#c0392b",
    "#8e44ad",
  ];

  return departs.map((depart, index) => {
    const departActifs = actifs.filter(
      (actif) =>
        depart.actifs.includes(actif.id) ||
        (depart.zonesGeographiques.quartiers.includes(actif.quartier) &&
          depart.zonesGeographiques.communes.includes(actif.commune))
    );

    // Generate connections between actifs
    const connections: [number, number][][] = [];
    for (let i = 0; i < departActifs.length - 1; i++) {
      const current = departActifs[i];
      const next = departActifs[i + 1];
      connections.push([
        [current.geolocalisation.latitude, current.geolocalisation.longitude],
        [next.geolocalisation.latitude, next.geolocalisation.longitude],
      ]);
    }

    return {
      depart,
      actifs: departActifs,
      connections,
      color: colors[index % colors.length],
      isVisible: true,
    };
  });
};


export const useMapStore = create<MapState>()(
  devtools(
    (set, get) => ({
      // Initial state
      actifs: actifs,
      departs: departs,
      filteredActifs: actifs,
      selectedActifs: [],
      selectionArea: {
        bounds: null,
        shape: null,
        coordinates: null,
      },
      filters: {
        types: [],
        regions: [],
        etatVisuel: [],
        etatFonctionnement: [],
        typeDeBien: [],
        natureDuBien: [],
        anneeMiseEnService: { min: 2000, max: 2024 },
      },
      searchTerm: "",
      isSidebarOpen: false,
      isDrawingMode: "pan",
      mapBounds: null,
      selectedDepart: null,
      departConnections: generateDepartConnections(departs, actifs),
      showDepartConnections: true,
      showDepartLabels: false,
      showAllActifs: true,

      // Data actions
      setActifs: (actifs) => set({ actifs, filteredActifs: actifs }),

      // Filter actions
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      applyFilters: () => {
        const { actifs, filters, searchTerm } = get();

        const filtered = actifs.filter((actif) => {
          // Type filter
          if (filters.types.length > 0 && !filters.types.includes(actif.type)) {
            return false;
          }

          // Region filter
          if (
            filters.regions.length > 0 &&
            !filters.regions.includes(actif.region)
          ) {
            return false;
          }

          // type de bien filter
          if (
            filters.typeDeBien.length > 0 &&
            !filters.typeDeBien.includes(actif.TypeDeBien)
          ) {
            return false;
          }

          // nature du bien filter
          if (
            filters.natureDuBien.length > 0 &&
            !filters.natureDuBien.includes(actif.natureDuBien)
          ) {
            return false;
          }

          // État visuel filter
          if (
            filters.etatVisuel.length > 0 &&
            !filters.etatVisuel.includes(actif.etatVisuel)
          ) {
            return false;
          }

          // État fonctionnement filter (for applicable types)
          if (filters.etatFonctionnement.length > 0) {
            const hasEtatFonctionnement = "etatFonctionnement" in actif;
            if (
              hasEtatFonctionnement &&
              !filters.etatFonctionnement.includes(actif.etatFonctionnement)
            ) {
              return false;
            }
          }

          // Year filter
          if (
            actif.anneeMiseEnService < filters.anneeMiseEnService.min ||
            actif.anneeMiseEnService > filters.anneeMiseEnService.max
          ) {
            return false;
          }

          // Search term filter
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
              actif.designationGenerale.toLowerCase().includes(searchLower) ||
              actif.region.toLowerCase().includes(searchLower) ||
              actif.commune.toLowerCase().includes(searchLower) ||
              actif.TypeDeBien.toLowerCase().includes(searchLower) ||
              actif.natureDuBien.toLowerCase().includes(searchLower) ||
              actif.quartier.toLowerCase().includes(searchLower) ||
              actif.numeroImmo.toLowerCase().includes(searchLower)
            );
          }

          return true;
        });

        set({ filteredActifs: filtered });
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term });
        get().applyFilters();
      },

      // Selection actions
      setSelectedActifs: (actifs) => {
        set({
          selectedActifs: actifs,
          isSidebarOpen: actifs.length > 0,
        });
      },

      addSelectedActif: (actif) => {
        const { selectedActifs } = get();
        if (!selectedActifs.find((a) => a.id === actif.id)) {
          set({
            selectedActifs: [...selectedActifs, actif],
            isSidebarOpen: true,
          });
        }
      },

      removeSelectedActif: (id) => {
        const { selectedActifs } = get();
        const newSelection = selectedActifs.filter((a) => a.id !== id);
        set({
          selectedActifs: newSelection,
          isSidebarOpen: newSelection.length > 0,
        });
      },

      clearSelection: () => {
        set({ selectedActifs: [] });
      },

      // UI actions
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setDrawingMode: (mode) => set({ isDrawingMode: mode }),

      // Map actions
      setMapBounds: (bounds) => set({ mapBounds: bounds }),

      // Depart actions
      setSelectedDepart: (departId) => {
        set({ selectedDepart: departId });
        if (departId) {
          get().applyFilters();
        }
      },

      setShowDepartConnections: (show) => set({ showDepartConnections: show }),
      setShowDepartLabels: (show) => set({ showDepartLabels: show }),
      setShowAllActifs: (show) => set({ showAllActifs: show }),

      toggleDepartVisibility: (departId) => {
        const { departConnections } = get();
        const updated = departConnections.map((conn) =>
          conn.depart.id === departId
            ? { ...conn, isVisible: !conn.isVisible }
            : conn
        );
        set({ departConnections: updated });
      },

      centerOnDepart: (departId) => {
        const { departConnections } = get();
        const connection = departConnections.find(
          (conn) => conn.depart.id === departId
        );
        if (connection && connection.actifs.length > 0) {
          // Calculate center of actifs for this depart
          const lats = connection.actifs.map((a) => a.geolocalisation.latitude);
          const lngs = connection.actifs.map(
            (a) => a.geolocalisation.longitude
          );
          const centerLat =
            lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
          const centerLng =
            lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

          // This would trigger map centering in the component
          console.log(`Center map on: ${centerLat}, ${centerLng}`);
        }
      },

      getDepartStatistics: (departId) => {
        const { departConnections } = get();
        const connection = departConnections.find(
          (conn) => conn.depart.id === departId
        );

        if (!connection) return null;

        const { depart, actifs } = connection;

        return {
          nombreActifs: actifs.length,
          typesActifs: actifs.reduce((acc, actif) => {
            acc[actif.type] = (acc[actif.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          zonesGeographiques: depart.zonesGeographiques,
          etatsService: actifs.reduce((acc, actif) => {
            const etat =
              "etatFonctionnement" in actif ? actif.etatFonctionnement : "N/A";
            acc[etat] = (acc[etat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          tensionsUtilisees: [
            ...new Set(
              actifs
                .map((actif) => ("tension" in actif ? actif.tension : 0))
                .filter((t) => t > 0)
            ),
          ],
          repartitionParType: actifs.reduce((acc, actif) => {
            acc[actif.type] = (acc[actif.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          longueurTotale: depart.longueurTotale,
          densiteActifs: actifs.length / depart.longueurTotale,
          couverture: {
            nombreRegions: depart.zonesGeographiques.regions.length,
            nombreDepartements: depart.zonesGeographiques.departements.length,
            nombreCommunes: depart.zonesGeographiques.communes.length,
            nombreQuartiers: depart.zonesGeographiques.quartiers.length,
          },
          valorisationTotale: actifs.reduce(
            (sum, actif) => sum + actif.valorisation,
            0
          ),
        };
      },

      // Export actions
      exportSelection: (format) => {
        const { selectedActifs } = get();

        if (selectedActifs.length === 0) {
          alert("Aucun élément sélectionné pour l'export");
          return;
        }

        const data = selectedActifs.map((actif) => ({
          id: actif.id,
          type: actif.type,
          designation: actif.designationGenerale,
          region: actif.region,
          commune: actif.commune,
          quartier: actif.quartier,
          etatVisuel: actif.etatVisuel,
          anneeMiseEnService: actif.anneeMiseEnService,
          valorisation: actif.valorisation,
          latitude: actif.geolocalisation.latitude,
          longitude: actif.geolocalisation.longitude,
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        switch (format) {
          case "csv": {
            const headers = Object.keys(data[0]).join(",");
            const rows = data.map((row) => Object.values(row).join(","));
            content = [headers, ...rows].join("\n");
            filename = `actifs_selection_${
              new Date().toISOString().split("T")[0]
            }.csv`;
            mimeType = "text/csv";
            break;
          }

          case "json":
            content = JSON.stringify(data, null, 2);
            filename = `actifs_selection_${
              new Date().toISOString().split("T")[0]
            }.json`;
            mimeType = "application/json";
            break;

          case "excel": // For Excel, we'll use CSV format with Excel-friendly encoding
          {
            const excelHeaders = Object.keys(data[0]).join("\t");
            const excelRows = data.map((row) => Object.values(row).join("\t"));
            content = [excelHeaders, ...excelRows].join("\n");
            filename = `actifs_selection_${
              new Date().toISOString().split("T")[0]
            }.xls`;
            mimeType = "application/vnd.ms-excel";
            break;
          }

          default:
            return;
        }

        // Create and download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: "map-store",
    }
  )
);
