/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useMapStore.ts
import { useCallback, useMemo } from 'react';
import { useMapStore as useBaseMapStore } from '@/store/map_store';

// Sélecteurs stables - définis une seule fois
const selectFilters = (state: any) => state.filters;
const selectHasActiveFilters = (state: any) => state.hasActiveFilters;
const selectFilteredCount = (state: any) => state.filteredCount;
const selectShowFilterPanel = (state: any) => state.showFilterPanel;

// Sélecteurs pour les actions - memoizés pour éviter les recréations
const selectSetFilter = (state: any) => state.setFilter;
const selectClearFilters = (state: any) => state.clearFilters;
const selectApplyFilters = (state: any) => state.applyFilters;
const selectToggleFilterPanel = (state: any) => state.toggleFilterPanel;

// Hook personnalisé pour les filtres
export const useFiltersState = () => {
    const filters = useBaseMapStore(selectFilters);
    const hasActiveFilters = useBaseMapStore(selectHasActiveFilters);
    const filteredCount = useBaseMapStore(selectFilteredCount);
    const showFilterPanel = useBaseMapStore(selectShowFilterPanel);

    return useMemo(() => ({
        filters: filters || {},
        hasActiveFilters: hasActiveFilters || false,
        filteredCount: filteredCount || 0,
        showFilterPanel: showFilterPanel ?? true,
    }), [filters, hasActiveFilters, filteredCount, showFilterPanel]);
};

// Hook personnalisé pour les actions
export const useFiltersActions = () => {
    const setFilter = useBaseMapStore(selectSetFilter);
    const clearFilters = useBaseMapStore(selectClearFilters);
    const applyFilters = useBaseMapStore(selectApplyFilters);
    const toggleFilterPanel = useBaseMapStore(selectToggleFilterPanel);

    // Wrapper pour setFilter avec gestion d'erreur
    const safeSetFilter = useCallback((key: string, value: any) => {
        try {
            if (!setFilter) {
                console.warn('setFilter n\'est pas disponible');
                return;
            }
            setFilter(key, value || null);
        } catch (error) {
            console.error('Erreur lors de la modification du filtre:', error);
        }
    }, [setFilter]);

    // Wrapper pour clearFilters avec gestion d'erreur
    const safeClearFilters = useCallback(() => {
        try {
            if (!clearFilters) {
                console.warn('clearFilters n\'est pas disponible');
                return;
            }
            clearFilters();
        } catch (error) {
            console.error('Erreur lors de l\'effacement des filtres:', error);
        }
    }, [clearFilters]);

    // Wrapper pour applyFilters avec gestion d'erreur
    const safeApplyFilters = useCallback((data: any) => {
        try {
            if (!applyFilters) {
                console.warn('applyFilters n\'est pas disponible');
                return;
            }
            applyFilters(data);
        } catch (error) {
            console.error('Erreur lors de l\'application des filtres:', error);
        }
    }, [applyFilters]);

    // Wrapper pour toggleFilterPanel avec gestion d'erreur
    const safeToggleFilterPanel = useCallback(() => {
        try {
            if (!toggleFilterPanel) {
                console.warn('toggleFilterPanel n\'est pas disponible');
                return;
            }
            toggleFilterPanel();
        } catch (error) {
            console.error('Erreur lors du toggle du panneau:', error);
        }
    }, [toggleFilterPanel]);

    return useMemo(() => ({
        setFilter: safeSetFilter,
        clearFilters: safeClearFilters,
        applyFilters: safeApplyFilters,
        toggleFilterPanel: safeToggleFilterPanel,
    }), [safeSetFilter, safeClearFilters, safeApplyFilters, safeToggleFilterPanel]);
};

// Hook utilitaire pour vérifier si le store est prêt
export const useStoreReady = () => {
    const store = useBaseMapStore();

    return useMemo(() => {
        return !!(
            store &&
            typeof store.setFilter === 'function' &&
            typeof store.clearFilters === 'function' &&
            typeof store.applyFilters === 'function' &&
            typeof store.toggleFilterPanel === 'function'
        );
    }, [store]);
};

// Hook pour la gestion des erreurs du store
export const useStoreErrorHandler = () => {
    const isReady = useStoreReady();

    const withErrorHandling = useCallback(<T extends any[], R>(
        fn: (...args: T) => R,
        errorMessage: string
    ) => {
        return (...args: T): R | undefined => {
            if (!isReady) {
                console.warn('Store not ready:', errorMessage);
                return undefined;
            }

            try {
                return fn(...args);
            } catch (error) {
                console.error(errorMessage, error);
                return undefined;
            }
        };
    }, [isReady]);

    return { withErrorHandling, isReady };
};

// Hook pour les données mises en cache avec invalidation
export const useCachedData = <T>(
    data: T | undefined,
    fallback: T,
    key: string
) => {
    return useMemo(() => {
        if (!data) {
            console.warn(`Données manquantes pour ${key}, utilisation du fallback`);
            return fallback;
        }
        return data;
    }, [data, fallback, key]);
};

// Types pour une meilleure sécurité
export interface FilterState {
    searchTerm?: string;
    supportType?: string;
    supportStatus?: string;
    postType?: string;
    postVoltage?: string;
    lineType?: string;
    lineStatus?: string;
}

export interface FiltersData {
    mt: any[];
    postes: any[];
    supports: any[];
}

// Hook combiné pour le FilterPanel
export const useFilterPanel = () => {
    const state = useFiltersState();
    const actions = useFiltersActions();
    const isReady = useStoreReady();

    return useMemo(() => ({
        ...state,
        ...actions,
        isReady,
    }), [state, actions, isReady]);
};