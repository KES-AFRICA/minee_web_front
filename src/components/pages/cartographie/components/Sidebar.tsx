import React from 'react';
import {
  X,
  MapPin,
  Settings,
  Eye,
  Zap,
  Building,
  Activity,
  Info,
  BarChart3,
  TrendingUp,
  Clock
} from 'lucide-react';
import type {Actif} from "@/types";
import {useMapStore} from "@/store/mapStore.ts";



const Sidebar: React.FC = () => {
  const { selectedActifs, isSidebarOpen, setSidebarOpen, clearSelection } = useMapStore();

  if (!isSidebarOpen) return null;

  const handleClose = () => {
    setSidebarOpen(false);
    clearSelection();
  };

  const getActifIcon = (type: string) => {
    const iconMap = {
      'LIGNE_AERIENNE': <Zap className="w-4 h-4 text-blue-600" />,
      'LIGNE_SOUTERRAINE': <Zap className="w-4 h-4 text-purple-600" />,
      'TRANSFORMATEUR': <Settings className="w-4 h-4 text-red-600" />,
      'POSTE_DISTRIBUTION': <Building className="w-4 h-4 text-green-600" />,
      'SUPPORT': <Activity className="w-4 h-4 text-orange-600" />,
      'OCR': <Settings className="w-4 h-4 text-red-700" />,
      'TABLEAU_BT': <BarChart3 className="w-4 h-4 text-indigo-600" />,
      'CELLULE_DISTRIBUTION_SECONDAIRE': <Building className="w-4 h-4 text-pink-600" />,
      'CELLULE_DISTRIBUTION_PRIMAIRE': <Building className="w-4 h-4 text-pink-700" />,
      'POINT_LIVRAISON': <MapPin className="w-4 h-4 text-cyan-600" />,
      'EQUIPEMENT_STOCK': <Building className="w-4 h-4 text-gray-600" />
    };
    return iconMap[type as keyof typeof iconMap] || <MapPin className="w-4 h-4 text-gray-600" />;
  };

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'Bon':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'Moyen':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Passable':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Mauvais':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'LIGNE_AERIENNE': 'Ligne Aérienne',
      'LIGNE_SOUTERRAINE': 'Ligne Souterraine',
      'TRANSFORMATEUR': 'Transformateur',
      'POSTE_DISTRIBUTION': 'Poste Distribution',
      'SUPPORT': 'Support',
      'OCR': 'OCR',
      'TABLEAU_BT': 'Tableau BT',
      'CELLULE_DISTRIBUTION_SECONDAIRE': 'Cellule Distrib. Secondaire',
      'CELLULE_DISTRIBUTION_PRIMAIRE': 'Cellule Distrib. Primaire',
      'POINT_LIVRAISON': 'Point de Livraison',
      'EQUIPEMENT_STOCK': 'Équipement Stock'
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Calculate statistics
  const stats = {
    total: selectedActifs.length,
    byType: selectedActifs.reduce((acc, actif) => {
      acc[actif.type] = (acc[actif.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byState: selectedActifs.reduce((acc, actif) => {
      acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byRegion: selectedActifs.reduce((acc, actif) => {
      acc[actif.region] = (acc[actif.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    avgYear: selectedActifs.length > 0
        ? Math.round(selectedActifs.reduce((sum, actif) => sum + actif.anneeMiseEnService, 0) / selectedActifs.length)
        : 0
  };

  const renderActifDetails = (actif: Actif) => {
    const commonDetails = (
        <div className="space-y-4">
          {/* Location Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Localisation
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Région:</span>
                <p className="font-medium text-gray-900">{actif.region}</p>
              </div>
              <div>
                <span className="text-gray-500">Département:</span>
                <p className="font-medium text-gray-900">{actif.departement}</p>
              </div>
              <div>
                <span className="text-gray-500">Commune:</span>
                <p className="font-medium text-gray-900">{actif.commune}</p>
              </div>
              <div>
                <span className="text-gray-500">Quartier:</span>
                <p className="font-medium text-gray-900">{actif.quartier}</p>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              Informations techniques
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Position:</span>
                <p className="font-medium text-gray-900">{actif.positionMateriel}</p>
              </div>
              <div>
                <span className="text-gray-500">Année Service:</span>
                <p className="font-medium text-gray-900 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-blue-600" />
                  {actif.anneeMiseEnService}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">N° Immo:</span>
                <p className="font-mono text-xs text-gray-900 bg-white px-2 py-1 rounded border">
                  {actif.numeroImmo}
                </p>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Coordonnées GPS</h5>
            <div className="font-mono text-xs text-gray-900 bg-white px-2 py-1 rounded border">
              {actif.geolocalisation.latitude.toFixed(6)}, {actif.geolocalisation.longitude.toFixed(6)}
            </div>
          </div>
        </div>
    );

    // Add type-specific details
    switch (actif.type) {
      case 'TRANSFORMATEUR':
        { const transformateur = actif ;
        return (
            <div className="space-y-4">
              {commonDetails}
              <div className="bg-red-50 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <Settings className="w-3 h-3 mr-1 text-red-600" />
                  Spécifications Transformateur
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Fabricant:</span>
                    <p className="font-medium text-gray-900">{transformateur.fabricant}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Puissance:</span>
                    <p className="font-medium  text-red-700">{transformateur.puissance} kVA</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tension Primaire:</span>
                    <p className="font-medium text-gray-900">{transformateur.tensionPrimaire} V</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tension Secondaire:</span>
                    <p className="font-medium text-gray-900">{transformateur.tensionSecondaire} V</p>
                  </div>
                </div>
              </div>
            </div>
        ); }

      case 'SUPPORT':
        { const support = actif;
        return (
            <div className="space-y-4">
              {commonDetails}
              <div className="bg-orange-50 p-3 rounded-lg">
                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                  <Activity className="w-3 h-3 mr-1 text-orange-600" />
                  Détails Support
                </h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Classe:</span>
                    <p className="font-medium text-gray-900">{support.classeSupport}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Utilisation:</span>
                    <p className="font-medium text-gray-900">{support.utilisation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tension:</span>
                    <p className="font-medium  text-orange-700">{support.tension} V</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Nb Supports:</span>
                    <p className="font-medium text-gray-900">{support.nombreSupports}</p>
                  </div>
                </div>
              </div>
            </div>
        ); }

      default:
        return commonDetails;
    }
  };

  return (
      <div className="fixed right-10  h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Sélection Active
            </h2>
            <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Stats */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total</span>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Année Moy.</span>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.avgYear}</div>
            </div>
          </div>

          {selectedActifs.length > 1 && (
              <>
                {/* Type Distribution */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Répartition par type</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.byType).map(([type, count]) => (
                        <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {getTypeLabel(type)}: {count}
                  </span>
                    ))}
                  </div>
                </div>

                {/* State Distribution */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">État visuel</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.byState).map(([state, count]) => (
                        <span key={state} className={`px-2 py-1 text-xs rounded-full font-medium border ${getEtatColor(state)}`}>
                    {state}: {count}
                  </span>
                    ))}
                  </div>
                </div>

                {/* Region Distribution */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Régions</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(stats.byRegion).map(([region, count]) => (
                        <span key={region} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    {region}: {count}
                  </span>
                    ))}
                  </div>
                </div>
              </>
          )}
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedActifs.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune sélection</h3>
                <p className="text-sm">Sélectionnez des éléments sur la carte pour voir leurs détails ici.</p>
              </div>
          ) : (
              <div className="divide-y divide-gray-200">
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {selectedActifs.map((actif) => (
                    <div key={actif.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getActifIcon(actif.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                              {actif.designationGenerale}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {getTypeLabel(actif.type)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium border flex-shrink-0 ${getEtatColor(actif.etatVisuel)}`}>
                    {actif.etatVisuel}
                  </span>
                      </div>

                      {renderActifDetails(actif)}
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Enhanced Footer */}
        {selectedActifs.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                  onClick={clearSelection}
                  className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium text-sm shadow-md"
              >
                Effacer la sélection
              </button>
            </div>
        )}
      </div>
  );
};

export default Sidebar;