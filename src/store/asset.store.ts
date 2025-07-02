import { create } from 'zustand';
import type {Asset, FilterState, MapViewState, DashboardStats} from "@/types/AssetType.ts";
import {assetService} from "@/services/asset.service.ts";

interface AssetStore {
    assets: Asset[];
    selectedAsset: Asset | null;
    filters: FilterState;
    mapView: MapViewState;
    dashboardStats: DashboardStats;
    isLoading: boolean;
    error: string | null;

    // Actions
    loadAssets: () => Promise<void>;
    selectAsset: (asset: Asset | null) => void;
    updateFilters: (filters: Partial<FilterState>) => void;
    updateMapView: (mapView: Partial<MapViewState>) => void;
    createAsset: (asset: Omit<Asset, 'id'>) => Promise<void>;
    updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
    deleteAsset: (id: string) => Promise<void>;
    searchAssets: (query: string) => Promise<void>;
    calculateStats: () => void;
}

const initialFilters: FilterState = {
    type: '',
    region: '',
    criticality: '',
    status: '',
    dateRange: {
        start: '',
        end: ''
    },
    search: ''
};

const initialMapView: MapViewState = {
    showHeatmap: false,
    showClusters: true,
    showMeasurements: false,
    selectedAssets: [],
    compareMode: false,
    center: [46.2276, 2.2137], // France center
    zoom: 6,
    layerFilters: {
        showActive: false,
        showMaintenance: false,
        showAlerts: false,
        showOffline: false
    }
};

const initialStats: DashboardStats = {
    totalAssets: 0,
    activeAssets: 0,
    criticalAlerts: 0,
    maintenanceDue: 0,
    regions: 0,
    uptime: 0,
    efficiency: 0,
    costSavings: 0
};

export const useAssetStore = create<AssetStore>((set, get) => ({
    assets: [],
    selectedAsset: null,
    filters: initialFilters,
    mapView: initialMapView,
    dashboardStats: initialStats,
    isLoading: false,
    error: null,

    loadAssets: async () => {
        set({ isLoading: true, error: null });
        try {
            const assets = await assetService.getAssets();
            set({ assets, isLoading: false });
            get().calculateStats();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erreur lors du chargement des actifs',
                isLoading: false
            });
        }
    },

    selectAsset: (asset) => {
        set({ selectedAsset: asset });
    },

    updateFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
    },

    updateMapView: (newMapView) => {
        set({ mapView: { ...get().mapView, ...newMapView } });
    },

    createAsset: async (assetData) => {
        set({ isLoading: true, error: null });
        try {
            const newAsset = await assetService.createAsset(assetData);
            const assets = [...get().assets, newAsset];
            set({ assets, isLoading: false });
            get().calculateStats();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'actif',
                isLoading: false
            });
        }
    },

    updateAsset: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const updatedAsset = await assetService.updateAsset(id, updates);
            const assets = get().assets.map(asset =>
                asset.id === id ? updatedAsset : asset
            );
            set({ assets, isLoading: false });
            get().calculateStats();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'actif',
                isLoading: false
            });
        }
    },

    deleteAsset: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await assetService.deleteAsset(id);
            const assets = get().assets.filter(asset => asset.id !== id);
            set({ assets, isLoading: false });
            get().calculateStats();
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'actif',
                isLoading: false
            });
        }
    },

    searchAssets: async (query) => {
        if (!query.trim()) {
            get().loadAssets();
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const assets = await assetService.searchAssets(query);
            set({ assets, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Erreur lors de la recherche',
                isLoading: false
            });
        }
    },

    calculateStats: () => {
        const { assets } = get();
        const totalAssets = assets.length;
        const activeAssets = assets.filter(a => a.status === 'Actif').length;
        const criticalAlerts = assets.filter(a => a.status === 'En alerte').length;
        const maintenanceDue = assets.filter(a =>
            new Date(a.nextMaintenance) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ).length;
        const regions = new Set(assets.map(a => a.region)).size;
        const uptime = totalAssets > 0 ? Math.round((activeAssets / totalAssets) * 100) : 0;

        set({
            dashboardStats: {
                totalAssets,
                activeAssets,
                criticalAlerts,
                maintenanceDue,
                regions,
                uptime,
                efficiency: 0,
                costSavings: 0
            }
        });
    }
}));