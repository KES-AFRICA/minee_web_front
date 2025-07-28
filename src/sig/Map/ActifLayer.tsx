/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Polyline, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { type Actif } from '../types';
import { types } from '@/types';

// Helper function to return SVG path based on icon name
const getIconSVG = (iconName: string): string => {
  const icons: Record<string, string> = {
    transformer: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/>',
    pole: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2 16 20-8-8 20-1-20"/>',
    cable: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>',
    zap: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 2-3 7h4l-3 7"/>',
    box: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/>',
    gauge: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m12 14 4-4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    default: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>'
  };

  return icons[iconName] || icons.default;
};

// Fonction pour obtenir l'icône appropriée selon le type d'actif
const getActifIconName = (type: string): string => {
  switch (type) {
    case 'TRANSFORMATEUR':
      return 'transformer';
    case 'SUPPORT':
      return 'pole';
    case 'LIGNE_AERIENNE':
    case 'LIGNE_SOUTERRAINE':
      return 'cable';
    case 'POSTE_DISTRIBUTION':
    case 'TABLEAU_BT':
    case 'CELLULE_DISTRIBUTION_PRIMAIRE':
    case 'CELLULE_DISTRIBUTION_SECONDAIRE':
      return 'zap';
    case 'POINT_LIVRAISON':
      return 'gauge';
    case 'OCR':
    case 'EQUIPEMENT_STOCK':
      return 'box';
    default:
      return 'default';
  }
};

// Fonction pour convertir les classes Tailwind en couleurs hexadécimales
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

interface ActifLayerProps {
  actif: Actif;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ActifLayer: React.FC<ActifLayerProps> = ({ actif, isSelected, onSelect }) => {
  // Trouve la configuration du type d'actif
  const typeConfig = types.find(t => t.value === actif.type) || {
    value: actif.type,
    label: actif.type,
    icon: '❓',
    color: 'text-gray-600'
  };

  const typeColor = getColorFromTailwind(typeConfig.color);

  // Détermine si c'est un actif linéaire (ligne)
  const isLinearAsset = ['LIGNE_AERIENNE', 'LIGNE_SOUTERRAINE'].includes(actif.type);

  // Pour les actifs linéaires, on peut créer une ligne basée sur les supports
  if (isLinearAsset) {
    const ligneActif = actif as any; // Cast pour accéder aux propriétés spécifiques des lignes

    // Si on a des supports avec des coordonnées, on peut tracer une ligne
    if (ligneActif.supports && ligneActif.supports.length > 1) {
      const positions = ligneActif.supports
        .filter((support: any) => support.geolocalisation)
        .map((support: any) => [
          support.geolocalisation.latitude,
          support.geolocalisation.longitude
        ] as [number, number]);

      if (positions.length > 1) {
        return (
          <>
            <Polyline
              positions={positions}
              pathOptions={{
                color: typeColor,
                weight: isSelected ? 6 : 4,
                opacity: isSelected ? 1 : 0.8,
                dashArray: actif.type === ('LIGNE_SOUTERRAINE' as any) ? '10, 5' : undefined
              }}
              eventHandlers={{
                click: () => onSelect(actif.id)
              }}
            />

            {/* Marqueur au point de départ */}
            <ActifMarker
              actif={actif}
              isSelected={isSelected}
              onSelect={onSelect}
              typeConfig={typeConfig}
            />
          </>
        );
      }
    }
  }

  // Pour tous les autres actifs ou les lignes sans supports multiples
  return (
    <ActifMarker
      actif={actif}
      isSelected={isSelected}
      onSelect={onSelect}
      typeConfig={typeConfig}
    />
  );
};

// Composant ActifMarker intégré
interface ActifMarkerProps {
  actif: Actif;
  isSelected: boolean;
  onSelect: (id: string) => void;
  typeConfig: {
    value: string;
    label: string;
    icon: string;
    color: string;
  };
}

const ActifMarker: React.FC<ActifMarkerProps> = ({ actif, isSelected, onSelect, typeConfig }) => {
  const iconName = getActifIconName(actif.type);
  const size = isSelected ? 28 : 24;
  const tailSize = isSelected ? 40 : 36;
  const typeColor = getColorFromTailwind(typeConfig.color);

  // Couleur de l'état fonctionnel
  const getStateColor = (state: string): string => {
    switch (state) {
      case 'En service':
        return '#16a34a'; // green-600
      case 'Hors service':
        return '#dc2626'; // red-600
      default:
        return '#4b5563'; // gray-600
    }
  };

  const stateColor = getStateColor(actif.etatFonctionnement || 'En service');

  const markerIcon = divIcon({
    html: `
      <div class="relative">
        <div class="marker-pin ${isSelected ? 'selected' : ''}" 
             style="background: ${typeColor}; border-color: ${stateColor}; width: ${size}px; height: ${size}px;">
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      <Marker
        position={[actif.geolocalisation.latitude, actif.geolocalisation.longitude]}
        icon={markerIcon}
        eventHandlers={{
          click: () => onSelect(actif.id)
        }}
      >
        <Popup maxWidth={300} className="custom-popup">
          <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {actif.designationGenerale}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {typeConfig.label}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-lg mr-1">{typeConfig.icon}</span>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-700">Région:</span>
                <div className="text-gray-600">{actif.region}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Commune:</span>
                <div className="text-gray-600">{actif.commune}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Année:</span>
                <div className="text-gray-600">{actif.anneeMiseEnService}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">État:</span>
                <div className="text-gray-600">{actif.etatVisuel}</div>
              </div>
            </div>

            {/* Valorisation */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(actif.valorisation)}
                </div>
                <div className="text-xs text-gray-500">Valorisation actuelle</div>
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
          transition: all 0.2s ease;
        }
        
        .marker-pin.selected {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0,0,0,0.3);
          transform: scale(1.1);
        }
        
        .marker-tail {
          position: absolute;
          top: calc(100% - 2px);
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
      `}</style>
    </>
  );
};

export default ActifLayer;