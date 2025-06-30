import React from 'react';
import { Search, Filter, Calendar, RotateCcw, TrendingUp } from 'lucide-react';
import type { FilterState } from '../types';
import { regions, assetTypes, criticalityLevels, statusOptions } from '../data';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
  resultCount: number;
  totalCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filtres Avancés</span>
        </h2>
        <button
          onClick={onReset}
          className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Réinitialiser les filtres"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Results Summary */}
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-200 dark:border-teal-700 p-4 rounded-xl">
        <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-300">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">
            {resultCount} sur {totalCount} actifs
          </span>
        </div>
        <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">
          {((resultCount / totalCount) * 100).toFixed(1)}% des actifs affichés
        </div>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recherche Rapide
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Nom, ID, ou spécifications..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Période d'Inspection</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Du</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
              className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Au</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
              className="w-full px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Selects */}
      <div className="space-y-4">
        {/* Asset Type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Type d'Actif
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Région
          </label>
          <select
            value={filters.region}
            onChange={(e) => onFilterChange('region', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
          >
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Criticality */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Criticité
          </label>
          <select
            value={filters.criticality}
            onChange={(e) => onFilterChange('criticality', e.target.value)}
            className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
          >
            {criticalityLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Filtres Rapides
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onFilterChange('status', 'En alerte')}
            className="px-3 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
          >
            Alertes
          </button>
          <button
            onClick={() => onFilterChange('criticality', 'Haute')}
            className="px-3 py-2 bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-lg text-sm font-medium transition-colors"
          >
            Critique
          </button>
          <button
            onClick={() => onFilterChange('status', 'En maintenance')}
            className="px-3 py-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors"
          >
            Maintenance
          </button>
          <button
            onClick={() => onFilterChange('status', 'Actif')}
            className="px-3 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors"
          >
            Actifs
          </button>
        </div>
      </div>
    </div>
  );
};
