import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Asset, AssetType } from '../types';
import { AlertTriangle, Clock, Zap, Thermometer, Activity } from 'lucide-react';

// Custom icon creation
const createIcon = (color: string, icon: string, status: string) => {
  const isAlert = status === 'En alerte';
  const pulseClass = isAlert ? 'animate-pulse' : '';
  
  return new L.DivIcon({
    html: `
      <div class="relative ${pulseClass}">
        <div class="w-10 h-10 rounded-full shadow-lg border-3 border-white" style="background-color: ${color}">
          <div class="w-full h-full flex items-center justify-center text-white text-sm font-bold">
            ${icon}
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 border-r-2 border-b-2 border-white" style="background-color: ${color}"></div>
        ${isAlert ? '<div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>' : ''}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

const assetIcons: Record<AssetType, (status: string) => L.DivIcon> = {
  Transformateur: (status) => createIcon('#0d9488', 'T', status),
  Ligne: (status) => createIcon('#0369a1', 'L', status),
  Poste: (status) => createIcon('#b45309', 'P', status),
  Compteur: (status) => createIcon('#7e22ce', 'C', status),
  Générateur: (status) => createIcon('#d97706', 'G', status),
};

interface AssetMarkersProps {
  assets: Asset[];
  onAssetSelect?: (asset: Asset) => void;
  selectedAssets?: string[];
}

export const AssetMarkers: React.FC<AssetMarkersProps> = ({
  assets,
  onAssetSelect,
  //selectedAssets = [],
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'En maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hors service':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'En alerte':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Faible':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <>
      {assets.map((asset) => (
        <Marker
          key={asset.id}
          position={asset.position}
          icon={assetIcons[asset.type](asset.status)}
          eventHandlers={{
            click: () => onAssetSelect?.(asset),
          }}
        >
          <Popup className="custom-popup" maxWidth={350}>
            <div className="p-5 min-w-[320px]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-800 leading-tight mb-1">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-slate-600 font-mono">{asset.id}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      asset.status
                    )}`}
                  >
                    {asset.status}
                  </span>
                  {asset.alerts && asset.alerts.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{asset.alerts.length}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Type:</span>
                  <span className="text-sm text-slate-800 font-medium">{asset.type}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Région:</span>
                  <span className="text-sm text-slate-800">{asset.region}</span>
                </div>

                <div className="flex items-center justify-between col-span-2">
                  <span className="text-sm font-medium text-slate-600">Criticité:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getCriticalityColor(
                      asset.criticality
                    )}`}
                  >
                    {asset.criticality}
                  </span>
                </div>
              </div>

              {/* Technical Details */}
              {(asset.capacity || asset.length) && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Spécifications</h4>
                  <div className="space-y-1">
                    {asset.capacity && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Capacité:</span>
                        <span className="text-sm text-slate-800 font-medium">{asset.capacity}</span>
                      </div>
                    )}
                    {asset.length && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Longueur:</span>
                        <span className="text-sm text-slate-800 font-medium">{asset.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Real-time Metrics */}
              {(asset.temperature || asset.load || asset.voltage) && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span>Mesures en Temps Réel</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {asset.temperature && (
                      <div>
                        <div className="flex items-center justify-center space-x-1 text-xs text-slate-600">
                          <Thermometer className="h-3 w-3" />
                          <span>Temp</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800">{asset.temperature}°C</div>
                      </div>
                    )}
                    {asset.load && (
                      <div>
                        <div className="flex items-center justify-center space-x-1 text-xs text-slate-600">
                          <Zap className="h-3 w-3" />
                          <span>Charge</span>
                        </div>
                        <div className="text-sm font-bold text-slate-800">{asset.load}%</div>
                      </div>
                    )}
                    {asset.voltage && (
                      <div>
                        <div className="text-xs text-slate-600">Tension</div>
                        <div className="text-sm font-bold text-slate-800">{asset.voltage}kV</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Maintenance Schedule */}
              <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Planning de Maintenance</span>
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Dernière inspection:</span>
                    <span className="text-xs text-slate-800">{formatDate(asset.lastInspection)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Prochaine maintenance:</span>
                    <span className="text-xs text-slate-800 font-medium">{formatDate(asset.nextMaintenance)}</span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {asset.alerts && asset.alerts.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Alertes Actives ({asset.alerts.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {asset.alerts.slice(0, 2).map((alert) => (
                      <div key={alert.id} className="text-xs text-red-800 p-2 bg-red-100 rounded">
                        {alert.message}
                      </div>
                    ))}
                    {asset.alerts.length > 2 && (
                      <div className="text-xs text-red-600 text-center">
                        +{asset.alerts.length - 2} autres alertes
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={() => onAssetSelect?.(asset)}
                  className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Voir les Détails
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};
