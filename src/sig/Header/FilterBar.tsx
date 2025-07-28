import React from 'react';
import { Download, Filter, RotateCcw } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { ACTIF_TYPES, ETAT_VISUAL_COLORS, REGIONS_CAMEROUN, type TypeActif, type EtatVisuel, type EtatFonctionnement } from '../types';
import Dropdown from '../UI/Dropdown';
import Button from '../UI/Button';

const FilterBar: React.FC = () => {
  const {
    filters,
    filteredActifs,
    updateFilters,
    resetFilters,
    loading,
    toggleExportModal,
    selectedActifs
  } = useAppStore();

  const typeOptions = Object.entries(ACTIF_TYPES).map(([key, config]) => ({
    value: key,
    label: config.label,
    color: config.color
  }));

  const regionOptions = [...REGIONS_CAMEROUN].map(region => ({
    value: region,
    label: region
  }));

  const etatVisuelOptions: Array<{ value: EtatVisuel; label: string; color: string }> = [
    { value: 'bon', label: 'Bon', color: ETAT_VISUAL_COLORS.bon },
    { value: 'moyen', label: 'Moyen', color: ETAT_VISUAL_COLORS.moyen },
    { value: 'passable', label: 'Passable', color: ETAT_VISUAL_COLORS.passable },
    { value: 'mauvais', label: 'Mauvais', color: ETAT_VISUAL_COLORS.mauvais }
  ];

  const etatFonctionnementOptions: Array<{ value: EtatFonctionnement; label: string }> = [
    { value: 'en_service', label: 'En service' },
    { value: 'hors_service', label: 'Hors service' },
    { value: 'maintenance', label: 'En maintenance' }
  ];

  const hasActiveFilters = () => {
    return filters.types.length > 0 ||
           filters.regions.length > 0 ||
           filters.etatsVisuels.length > 0 ||
           filters.etatsFonctionnement.length > 0 ||
           filters.searchTerm.length > 0 ||
           filters.anneeMin > 1990 ||
           filters.anneeMax < 2024 ||
           filters.selectedArea !== undefined;
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="mx-auto">
        {/* En-tête des filtres */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {filteredActifs.length} actifs
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={toggleExportModal}
            icon={Download}
          >
            Exporter ({selectedActifs.length})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            icon={RotateCcw}
            disabled={!hasActiveFilters() || loading}
          >
            Réinitialiser
          </Button>
        </div>

        {/* Grille des filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Recherche textuelle */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              placeholder="Nom, ville, adresse..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Types d'actifs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Types d'actifs
            </label>
            <Dropdown
              options={typeOptions}
              value={filters.types}
              onChange={(value) => updateFilters({ types: value as TypeActif[] })}
              placeholder="Tous les types"
              multiple
            />
          </div>

          {/* Régions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Régions
            </label>
            <Dropdown
              options={regionOptions}
              value={filters.regions}
              onChange={(value) => updateFilters({ regions: value as string[] })}
              placeholder="Toutes les régions"
              multiple
            />
          </div>

          {/* État visuel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              État visuel
            </label>
            <Dropdown
              options={etatVisuelOptions}
              value={filters.etatsVisuels}
              onChange={(value) => updateFilters({ etatsVisuels: value as EtatVisuel[] })}
              placeholder="Tous les états"
              multiple
            />
          </div>

          {/* État de fonctionnement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              État de fonctionnement
            </label>
            <Dropdown
              options={etatFonctionnementOptions}
              value={filters.etatsFonctionnement}
              onChange={(value) => updateFilters({ etatsFonctionnement: value as EtatFonctionnement[] })}
              placeholder="Tous les états"
              multiple
            />
          </div>
        </div>

        {/* Filtres d'année */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Année de mise en service: {filters.anneeMin} - {filters.anneeMax}
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="range"
                min="1990"
                max="2024"
                value={filters.anneeMin}
                onChange={(e) => updateFilters({ anneeMin: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="1990"
                max="2024"
                value={filters.anneeMax}
                onChange={(e) => updateFilters({ anneeMax: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1990</span>
            <span>2024</span>
          </div>
        </div>

        {/* Indicateurs de filtres actifs */}
        {hasActiveFilters() && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.types.map(type => (
              <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {ACTIF_TYPES[type].label}
                <button
                  onClick={() => updateFilters({ types: filters.types.filter(t => t !== type) })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            
            {filters.regions.map(region => (
              <span key={region} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {region}
                <button
                  onClick={() => updateFilters({ regions: filters.regions.filter(r => r !== region) })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}

            {filters.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                "{filters.searchTerm}"
                <button
                  onClick={() => updateFilters({ searchTerm: '' })}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;