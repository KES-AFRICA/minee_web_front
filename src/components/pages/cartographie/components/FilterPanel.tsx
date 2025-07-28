import React, { useMemo, useCallback, useState } from 'react';
import { Filter, X, Search, RotateCcw, Eye, Settings } from 'lucide-react';
import { mtData, posteData, supportsData } from "@/data/sup";
import { useFilterPanel,useCachedData } from '@/hooks/hooks/useMapStore';

// Interface pour les props du composant
interface FilterPanelProps {
  className?: string;
  onClose?: () => void;
}

// Type pour les options de filtre
interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// Composant pour le panneau de filtres
export const FilterPanel: React.FC<FilterPanelProps> = ({ className, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Hook centralisé avec gestion d'erreur intégrée
  const {
    filters,
    hasActiveFilters,
    filteredCount,
    showFilterPanel,
    setFilter,
    clearFilters,
    applyFilters,
    toggleFilterPanel,
    isReady
  } = useFilterPanel();

  // Données mises en cache avec fallback sécurisé
  const cachedSupportsData = useCachedData(supportsData?.features, [], 'supports');
  const cachedPostesData = useCachedData(posteData?.features, [], 'postes');
  const cachedMtData = useCachedData(mtData?.features, [], 'mt');

  // Si le panneau ne doit pas être affiché, on retourne null
  if (!showFilterPanel) {
    return null;
  }

  // Options des filtres avec comptage - memoizées pour la performance
  const supportTypeOptions = useMemo((): FilterOption[] => {
    try {
      const types = cachedSupportsData.map(f => f.properties?.type).filter(Boolean);
      const counts = types.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return [
        { value: '', label: 'Tous les types', count: types.length },
        { value: 'bois', label: 'Bois', count: counts.bois || 0 },
        { value: 'metallique', label: 'Métallique', count: counts.metallique || 0 },
        { value: 'beton', label: 'Béton', count: counts.beton || 0 },
      ];
    } catch (error) {
      console.warn('Erreur lors du calcul des options de support:', error);
      return [{ value: '', label: 'Tous les types', count: 0 }];
    }
  }, [cachedSupportsData]);

  const postTypeOptions = useMemo((): FilterOption[] => {
    try {
      const types = cachedPostesData.map(f => f.properties?.type).filter(Boolean);
      const counts = types.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return [
        { value: '', label: 'Tous les types', count: types.length },
        { value: 'H59', label: 'H59', count: counts.H59 || 0 },
        { value: 'H61', label: 'H61', count: counts.H61 || 0 },
        { value: 'H63', label: 'H63', count: counts.H63 || 0 },
      ];
    } catch (error) {
      console.warn('Erreur lors du calcul des options de poste:', error);
      return [{ value: '', label: 'Tous les types', count: 0 }];
    }
  }, [cachedPostesData]);

  const lineTypeOptions = useMemo((): FilterOption[] => {
    try {
      const types = cachedMtData.map(f => f.properties?.type).filter(Boolean);
      const counts = types.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return [
        { value: '', label: 'Tous les types', count: types.length },
        { value: 'aerienne', label: 'Aérienne', count: counts.aerienne || 0 },
        { value: 'souterraine', label: 'Souterraine', count: counts.souterraine || 0 },
      ];
    } catch (error) {
      console.warn('Erreur lors du calcul des options de ligne:', error);
      return [{ value: '', label: 'Tous les types', count: 0 }];
    }
  }, [cachedMtData]);

  // Gestionnaires d'événements simplifiés (la gestion d'erreur est dans les hooks)
  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilter(key, value);
  }, [setFilter]);

  const handleApplyFilters = useCallback(() => {
    applyFilters({
      mt: cachedMtData,
      postes: cachedPostesData,
      supports: cachedSupportsData,
    });
  }, [applyFilters, cachedMtData, cachedPostesData, cachedSupportsData]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      toggleFilterPanel();
    }
  }, [onClose, toggleFilterPanel]);

  const toggleSection = useCallback((sectionName: string) => {
    setActiveSection(current => current === sectionName ? null : sectionName);
  }, []);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(current => !current);
  }, []);

  // Composant SelectField pour éviter la duplication
  const SelectField = React.memo<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[] | { value: string; label: string }[];
  }>(({ label, value, onChange, options }) => (
    <div className="filter-group">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value || null)}
        className="filter-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label} {'count' in option && option.count !== undefined && `(${option.count})`}
          </option>
        ))}
      </select>
    </div>
  ));

  // Options statiques pour éviter la recréation
  const statusOptions = useMemo(() => [
    { value: '', label: 'Tous' },
    { value: 'bon', label: 'Bon' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'mauvais', label: 'Mauvais' },
  ], []);

  const voltageOptions = useMemo(() => [
    { value: '', label: 'Toutes' },
    { value: '5.5kV', label: '5.5kV' },
    { value: '15kV', label: '15kV' },
    { value: '30kV', label: '30kV' },
  ], []);

  const lineStatusOptions = useMemo(() => [
    { value: '', label: 'Tous' },
    { value: 'actif', label: 'Actif' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'maintenance', label: 'Maintenance' },
  ], []);

  return (
    <div className={`filter-panel ${className || ''}`}>
      {/* En-tête */}
      <div className="filter-header">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-blue-600" />
          <h3 className="title">Filtres</h3>
          {hasActiveFilters && (
            <span className="active-indicator">
              {filteredCount}
            </span>
          )}
        </div>
        <div className="header-actions">
          <button
            onClick={handleToggleExpanded}
            className="toggle-btn"
            title={isExpanded ? 'Réduire' : 'Développer'}
          >
            <Eye size={14} />
          </button>
          <button
            onClick={handleClose}
            className="close-btn"
            title="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Recherche générale */}
          <div className="filter-section">
            <div className="section-header">
              <Search size={14} />
              <label>Recherche générale</label>
            </div>
            <input
              type="text"
              value={filters.searchTerm || ''}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Rechercher..."
              className="search-input"
            />
          </div>

          {/* Filtres pour les supports */}
          <div className="filter-section">
            <div
              className="section-header clickable"
              onClick={() => toggleSection('supports')}
            >
              <Settings size={14} />
              <span>Supports</span>
              <span className="section-toggle">
                {activeSection === 'supports' ? '−' : '+'}
              </span>
            </div>

            {(activeSection === 'supports' || activeSection === null) && (
              <div className="section-content">
                <div className="filter-grid">
                  <SelectField
                    label="Type"
                    value={filters.supportType || ''}
                    onChange={(value) => handleFilterChange('supportType', value)}
                    options={supportTypeOptions}
                  />

                  <SelectField
                    label="Statut"
                    value={filters.supportStatus || ''}
                    onChange={(value) => handleFilterChange('supportStatus', value)}
                    options={statusOptions}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filtres pour les postes */}
          <div className="filter-section">
            <div
              className="section-header clickable"
              onClick={() => toggleSection('postes')}
            >
              <Settings size={14} />
              <span>Postes</span>
              <span className="section-toggle">
                {activeSection === 'postes' ? '−' : '+'}
              </span>
            </div>

            {(activeSection === 'postes' || activeSection === null) && (
              <div className="section-content">
                <div className="filter-grid">
                  <SelectField
                    label="Type"
                    value={filters.postType || ''}
                    onChange={(value) => handleFilterChange('postType', value)}
                    options={postTypeOptions}
                  />

                  <SelectField
                    label="Tension"
                    value={filters.postVoltage || ''}
                    onChange={(value) => handleFilterChange('postVoltage', value)}
                    options={voltageOptions}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filtres pour les lignes */}
          <div className="filter-section">
            <div
              className="section-header clickable"
              onClick={() => toggleSection('lignes')}
            >
              <Settings size={14} />
              <span>Lignes MT</span>
              <span className="section-toggle">
                {activeSection === 'lignes' ? '−' : '+'}
              </span>
            </div>

            {(activeSection === 'lignes' || activeSection === null) && (
              <div className="section-content">
                <div className="filter-grid">
                  <SelectField
                    label="Type"
                    value={filters.lineType || ''}
                    onChange={(value) => handleFilterChange('lineType', value)}
                    options={lineTypeOptions}
                  />

                  <SelectField
                    label="Statut"
                    value={filters.lineStatus || ''}
                    onChange={(value) => handleFilterChange('lineStatus', value)}
                    options={lineStatusOptions}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="action-buttons">
            <button
              onClick={handleApplyFilters}
              className="apply-btn"
              disabled={!isReady}
            >
              Appliquer ({filteredCount})
            </button>
            <button
              onClick={handleClearFilters}
              className="clear-btn"
              disabled={!isReady}
            >
              <RotateCcw size={14} />
              Effacer
            </button>
          </div>

          {/* Indicateur de filtres actifs */}
          {hasActiveFilters && (
            <div className="active-filters-indicator">
              <div className="indicator-dot"></div>
              <span>Filtres actifs - {filteredCount} résultats</span>
            </div>
          )}

          {/* Informations de debug et état du store */}
          {process.env.NODE_ENV === 'development' && (
            <div className="debug-info">
              <details>
                <summary>Debug Info</summary>
                <div className="debug-content">
                  <div className="debug-item">
                    <strong>Store Ready:</strong> {isReady ? '✅' : '❌'}
                  </div>
                  <div className="debug-item">
                    <strong>Filters Count:</strong> {Object.keys(filters).length}
                  </div>
                  <div className="debug-item">
                    <strong>Has Active Filters:</strong> {hasActiveFilters ? 'Yes' : 'No'}
                  </div>
                  <div className="debug-item">
                    <strong>Filtered Count:</strong> {filteredCount}
                  </div>
                  <div className="debug-item">
                    <strong>Data Loaded:</strong>
                    <ul>
                      <li>Supports: {cachedSupportsData.length}</li>
                      <li>Postes: {cachedPostesData.length}</li>
                      <li>MT: {cachedMtData.length}</li>
                    </ul>
                  </div>
                  <div className="debug-item">
                    <strong>Active Filters:</strong>
                    <pre>{JSON.stringify(filters, null, 2)}</pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      )}

      <style>{`
        .filter-panel {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 1000;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          min-width: 320px;
          max-width: 400px;
          max-height: 600px;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          border: 1px solid #e5e7eb;
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .filter-header .flex {
          display: flex;
        }

        .filter-header .items-center {
          align-items: center;
        }

        .filter-header .space-x-2 > * + * {
          margin-left: 8px;
        }

        .title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .active-indicator {
          background: #3b82f6;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .toggle-btn, .close-btn {
          background: none;
          border: none;
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .toggle-btn:hover, .close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .filter-content {
          padding: 20px;
          max-height: 520px;
          overflow-y: auto;
        }

        .filter-section {
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .section-header.clickable {
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          justify-content: space-between;
        }

        .section-header.clickable:hover {
          background: #f9fafb;
        }

        .section-toggle {
          margin-left: auto;
          font-weight: 400;
          color: #9ca3af;
        }

        .section-content {
          padding-left: 16px;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 500;
          color: #4b5563;
        }

        .filter-select {
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          transition: border-color 0.2s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f3f4f6;
        }

        .apply-btn {
          flex: 1;
          padding: 12px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .apply-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .apply-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .clear-btn {
          flex: 1;
          padding: 12px 16px;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background-color 0.2s ease;
        }

        .clear-btn:hover:not(:disabled) {
          background: #4b5563;
        }

        .clear-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .active-filters-indicator {
          margin-top: 16px;
          padding: 12px;
          background: #ecfdf5;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #065f46;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .debug-info {
          margin-top: 16px;
          padding: 8px;
          background: #fef3c7;
          border-radius: 4px;
          font-size: 11px;
        }

        .debug-content {
          margin-top: 8px;
        }

        .debug-item {
          margin-bottom: 8px;
          padding: 4px;
          background: #fff;
          border-radius: 2px;
        }

        .debug-item strong {
          color: #059669;
        }

        .debug-item ul {
          margin: 4px 0 0 16px;
          padding: 0;
        }

        .debug-item pre {
          margin: 4px 0;
          font-size: 10px;
          max-height: 100px;
          overflow: auto;
          background: #f9fafb;
          padding: 4px;
          border-radius: 2px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Scrollbar personnalisée */
        .filter-content::-webkit-scrollbar {
          width: 6px;
        }

        .filter-content::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 3px;
        }

        .filter-content::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .filter-content::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .filter-panel {
            min-width: 280px;
            left: 5px;
            right: 5px;
            max-width: none;
          }

          .filter-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};