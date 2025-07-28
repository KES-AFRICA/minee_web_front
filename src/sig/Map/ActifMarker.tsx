import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Zap, MapPin, Calendar, DollarSign, PenTool as Tool } from 'lucide-react';
import { types, type Actif } from '@/types';

interface ActifMarkerProps {
  actif: Actif;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const getActifIcon = (type: string) => {
  switch (type) {
    case 'POSTE_DISTRIBUTION':
      return 'zap';
    case 'LIGNE_AERIENNE':
    case 'LIGNE_SOUTERRAINE':
      return 'minus';
    case 'TRANSFORMATEUR':
      return 'box';
    case 'POINT_LIVRAISON':
      return 'gauge';
    case 'SUPPORT':
      return 'radio';
    case 'OCR':
      return 'cable';
    case 'TABLEAU_BT':
    case 'CELLULE_DISTRIBUTION_PRIMAIRE':
    case 'CELLULE_DISTRIBUTION_SECONDAIRE':
    case 'EQUIPEMENT_STOCK':
      return 'box';
    default:
      return 'zap';
  }
};

// Helper function to get the state color
const getStateColor = (state: string): string => {
  switch (state) {
    case 'En service':
      return '#16a34a'; // green-600
    case 'Hors service':
      return '#dc2626'; // red-600
    case 'Maintenance':
      return '#ea580c'; // orange-600
    default:
      return '#4b5563'; // gray-600
  }
};

// Fonction helper pour obtenir le SVG des icônes
const getIconSVG = (iconName: string): string => {
  const icons: Record<string, string> = {
    zap: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 2-3 7h4l-3 7"/>',
    minus: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>',
    box: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3.3 7 8.7 5 8.7-5"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22V12"/>',
    gauge: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 14 4-4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    radio: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2 16 20-8-8 20-1-20"/>',
    cable: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5V3"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 5V3"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9"/>'
  };

  return icons[iconName] || icons.zap;
};

const ActifMarker: React.FC<ActifMarkerProps> = ({ actif, isSelected = false, onSelect }) => {
  const markerIcon = useMemo(() => {
    const iconName = getActifIcon(actif.type);
    const size = isSelected ? 28 : 24;
    const tailSize = isSelected ? 40 : 36;

    // Trouve la configuration du type d'actif
    const typeConfig = types.find(t => t.value === actif.type) || {
      color: 'text-gray-600',
      label: actif.type
    };

    // Convertit les classes Tailwind en couleurs hexadécimales
    const getColorFromTailwind = (tailwindClass: string): string => {
      const colorMap: Record<string, string> = {
        'text-blue-600': '#2563eb',
        'text-purple-600': '#9333ea',
        'text-red-600': '#dc2626',
        'text-green-600': '#16a34a',
        'text-orange-600': '#ea580c',
        'text-red-700': '#b91c1c',
        'text-indigo-600': '#4f46e5',
        'text-teal-600': '#0d9488',
        'text-cyan-600': '#0891b2',
        'text-pink-600': '#db2777',
        'text-amber-600': '#d97706',
        'text-gray-600': '#4b5563'
      };
      return colorMap[tailwindClass] || '#4b5563';
    };

    const typeColor = getColorFromTailwind(typeConfig.color);
    const stateColor = getStateColor(actif.etatFonctionnement || 'En service');

    return divIcon({
      html: `
        <div class="relative">
          <div class="marker-pin ${isSelected ? 'selected' : ''}" style="background: ${typeColor}; border-color: ${stateColor}; width: ${size}px; height: ${size}px;">
            <div class="marker-icon">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${getIconSVG(iconName)}
              </svg>
            </div>
          </div>
          <div class="marker-tail" style="border-top-color: ${typeColor};"></div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [size, tailSize],
      iconAnchor: [size / 2, tailSize],
      popupAnchor: [0, -tailSize],
    });
  }, [actif.type, actif.etatFonctionnement, isSelected]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStateIcon = () => {
    switch (actif.etatFonctionnement) {
      case 'En service':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'Hors service':
        return <Zap className="w-4 h-4 text-red-600" />;
      case 'Maintenance':
        return <Tool className="w-4 h-4 text-orange-600" />;
      default:
        return <Zap className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStateLabel = () => {
    switch (actif.etatFonctionnement) {
      case 'En service':
        return 'En service';
      case 'Hors service':
        return 'Hors service';
      case 'Maintenance':
        return 'En maintenance';
      default:
        return 'État inconnu';
    }
  };

  const getVisualStateColor = () => {
    switch (actif.etatVisuel) {
      case 'Bon':
        return 'text-green-600';
      case 'Moyen':
        return 'text-yellow-600';
      case 'Passable':
        return 'text-orange-600';
      case 'Mauvais':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Trouve la configuration du type pour l'affichage
  const typeConfig = types.find(t => t.value === actif.type) || {
    color: 'text-gray-600',
    label: actif.type,
    icon: '❓'
  };

  return (
    <>
      <Marker
        position={[actif.geolocalisation.latitude, actif.geolocalisation.longitude]}
        icon={markerIcon}
        eventHandlers={{
          click: () => onSelect?.(actif.id)
        }}
      >
        <Popup maxWidth={300} className="custom-popup">
          <div className="p-2">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {actif.designationGenerale}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {typeConfig.label}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-1">{typeConfig.icon}</span>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: types.find(t => t.value === actif.type)?.color.replace('text-', '#').replace('-600', '') || '#4b5563' }}
                />
              </div>
            </div>

            {/* Informations principales */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">
                  {actif.commune}, {actif.region}
                </span>
              </div>

              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">
                  Installé en {actif.anneeMiseEnService}
                </span>
              </div>

              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700">
                  {formatCurrency(actif.valorisation)}
                </span>
              </div>
            </div>

            {/* États */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getStateIcon()}
                  <span className="ml-2 text-sm font-medium">
                    {getStateLabel()}
                  </span>
                </div>
                <div className={`text-sm font-medium capitalize ${getVisualStateColor()}`}>
                  État: {actif.etatVisuel}
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Région:</span> {actif.region}
                </div>
                <div>
                  <span className="font-medium">Département:</span> {actif.departement}
                </div>
                <div>
                  <span className="font-medium">N° Immo:</span> {actif.numeroImmo}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {actif.positionMateriel}
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>

      <style>{`
        .marker-pin {
          border-radius: 50%;
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .marker-pin.selected {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0,0,0,0.3);
          transform: scale(1.1);
        }
        
        .marker-tail {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid;
        }
        
        .marker-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        
        .custom-popup .leaflet-popup-tip {
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
};

export default ActifMarker;