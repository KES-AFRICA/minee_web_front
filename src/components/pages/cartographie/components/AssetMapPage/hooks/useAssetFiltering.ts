import { useState, useMemo } from 'react';
import type { FilterState } from '../types';
import { fakeAssets } from '../data';

export const useAssetFiltering = () => {
  const [filters, setFilters] = useState<FilterState>({
    type: 'Tous',
    region: 'Tous',
    criticality: 'Tous',
    status: 'Tous',
    dateRange: {
      start: '',
      end: '',
    },
    search: '',
  });

  const filteredAssets = useMemo(() => {
    return fakeAssets.filter((asset) => {
      const typeMatch = filters.type === 'Tous' || asset.type === filters.type;
      const regionMatch = filters.region === 'Tous' || asset.region === filters.region;
      const criticalityMatch = filters.criticality === 'Tous' || asset.criticality === filters.criticality;
      const statusMatch = filters.status === 'Tous' || asset.status === filters.status;
      
      const searchMatch = filters.search === '' || 
        asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        asset.id.toLowerCase().includes(filters.search.toLowerCase());

      let dateMatch = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        const assetDate = new Date(asset.lastInspection);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        dateMatch = assetDate >= startDate && assetDate <= endDate;
      }

      return typeMatch && regionMatch && criticalityMatch && statusMatch && searchMatch && dateMatch;
    });
  }, [filters]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'Tous',
      region: 'Tous',
      criticality: 'Tous',
      status: 'Tous',
      dateRange: { start: '', end: '' },
      search: '',
    });
  };

  const getFilteredCount = () => filteredAssets.length;
  const getTotalCount = () => fakeAssets.length;

  return {
    filters,
    filteredAssets,
    updateFilter,
    resetFilters,
    getFilteredCount,
    getTotalCount,
  };
};
