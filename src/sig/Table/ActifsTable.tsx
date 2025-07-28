/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Download
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { type Actif, ACTIF_TYPES, ETAT_VISUAL_COLORS } from '../types';
import Button from '../UI/Button';
import ExportPanel from './ExportPanel';
import Pagination from './Pagination';

type SortField = keyof Actif | 'type_label' | 'region';
type SortDirection = 'asc' | 'desc';

const ActifsTable: React.FC = () => {
  const {
    filteredActifs,
    selectedActifs,
    toggleActifSelection,
    selectAllFilteredActifs,
    clearSelection,
    toggleExportModal,
    currentPage,
    itemsPerPage,
    loading
  } = useAppStore();

  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Tri des données
  const sortedActifs = useMemo(() => {
    const sorted = [...filteredActifs].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'type_label':
          aValue = ACTIF_TYPES[a.type].label;
          bValue = ACTIF_TYPES[b.type].label;
          break;
        case 'region':
          aValue = a.localisation.region;
          bValue = b.localisation.region;
          break;
        default:
          aValue = a[sortField as keyof Actif];
          bValue = b[sortField as keyof Actif];
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredActifs, sortField, sortDirection]);

  // Pagination
  const paginatedActifs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedActifs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedActifs, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getVisualStateColor = (etat: string) => {
    return ETAT_VISUAL_COLORS[etat as keyof typeof ETAT_VISUAL_COLORS] || '#6B7280';
  };

  const isAllSelected = selectedActifs.length === filteredActifs.length && filteredActifs.length > 0;
  const isPartiallySelected = selectedActifs.length > 0 && selectedActifs.length < filteredActifs.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllFilteredActifs();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      {/* En-tête du tableau avec actions */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Actifs électriques
            </h2>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
              {filteredActifs.length} résultats
            </span>
            {selectedActifs.length > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {selectedActifs.length} sélectionnés
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedActifs.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                >
                  Désélectionner ({selectedActifs.length})
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={toggleExportModal}
                  icon={Download}
                >
                  Exporter ({selectedActifs.length})
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center justify-center"
                  title="Sélectionner tout"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : isPartiallySelected ? (
                    <div className="w-5 h-5 bg-blue-600 rounded border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    </div>
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('nom')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  Nom
                  {getSortIcon('nom')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('type_label')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  Type
                  {getSortIcon('type_label')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('region')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  Localisation
                  {getSortIcon('region')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('etatVisuel')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  État
                  {getSortIcon('etatVisuel')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('anneeMiseEnService')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  Année
                  {getSortIcon('anneeMiseEnService')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('valorisation')}
                  className="flex items-center hover:text-gray-700 transition-colors"
                >
                  Valorisation
                  {getSortIcon('valorisation')}
                </button>
              </th>
              
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedActifs.map((actif) => (
              <tr
                key={actif.id}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedActifs.includes(actif.id) ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActifSelection(actif.id)}
                    className="flex items-center justify-center"
                  >
                    {selectedActifs.includes(actif.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {actif.nom}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: ACTIF_TYPES[actif.type].color }}
                    />
                    <span className="text-sm text-gray-900">
                      {ACTIF_TYPES[actif.type].label}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {actif.localisation.ville}
                  </div>
                  <div className="text-sm text-gray-500">
                    {actif.localisation.region}
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: getVisualStateColor(actif.etatVisuel) }}
                    />
                    <span className="text-sm text-gray-900 capitalize">
                      {actif.etatVisuel}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {actif.etatFonctionnement.replace('_', ' ')}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-900">
                  {actif.anneeMiseEnService}
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {formatCurrency(actif.valorisation)}
                </td>
                
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Voir détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="text-yellow-600 hover:text-yellow-900 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination />

      {/* Modal d'export */}
      <ExportPanel />
    </div>
  );
};

export default ActifsTable;