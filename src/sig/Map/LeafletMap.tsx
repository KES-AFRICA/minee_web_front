import React, { useState, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Circle } from 'react-leaflet';
import { LatLng, Map  } from 'leaflet';
import { useAppStore } from '../stores/appStore';
import ActifLayer from './ActifLayer';
import MapControls from './MapControls';
import SelectionTools from './SelectionTools';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Configuration des icônes Leaflet
import L from 'leaflet';

// Configuration centralisée
const MAP_CONFIG = {
  CENTER: [4.0511, 9.7679] as [number, number], // Douala
  DEFAULT_ZOOM: 8,
  MIN_ZOOM: 6,
  MAX_ZOOM: 18,
  CIRCLE_RADIUS_KM: 11, // Rayon par défaut en km
  DEGREE_TO_METERS: 111000, // Conversion approximative
} as const;

// Tile layers configuration
const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
} as const;

// Icône personnalisée optimisée
const createCustomIcon = () => L.divIcon({
  html: `<div class="marker-pin" aria-label="Location marker"></div>`,
  className: 'custom-div-icon',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [1, -34],
});

// Définir l'icône par défaut une seule fois
L.Marker.prototype.options.icon = createCustomIcon();

// Types pour une meilleure sécurité
interface DrawingState {
  isDrawing: boolean;
  mode: 'rectangle' | 'circle' | 'polygon';
  startPoint?: LatLng;
}

// Composant pour gérer les événements de la carte
const MapEventHandler: React.FC = React.memo(() => {
  const { setSelectionArea, showSelectionTools } = useAppStore();
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    mode: 'rectangle',
  });

  const handleMouseDown = useCallback((e: L.LeafletMouseEvent) => {
    if (!showSelectionTools || drawingState.mode !== 'rectangle') return;

    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      startPoint: e.latlng,
    }));

    console.log('Rectangle drawing started at:', e.latlng);
  }, [showSelectionTools, drawingState.mode]);

  const handleMouseUp = useCallback((e: L.LeafletMouseEvent) => {
    if (!drawingState.isDrawing || drawingState.mode !== 'rectangle' || !drawingState.startPoint) return;

    const endPoint = e.latlng;
    const bounds = L.latLngBounds(drawingState.startPoint, endPoint);

    setSelectionArea({
      type: 'rectangle',
      bounds: [
        [bounds.getSouth(), bounds.getWest()],
        [bounds.getNorth(), bounds.getEast()]
      ]
    });

    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      startPoint: undefined,
    }));

    console.log('Rectangle completed:', bounds.toBBoxString());
  }, [drawingState.isDrawing, drawingState.mode, drawingState.startPoint, setSelectionArea]);

  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    if (!showSelectionTools) return;

    if (drawingState.mode === 'circle') {
      setSelectionArea({
        type: 'circle',
        center: [e.latlng.lat, e.latlng.lng],
        radius: MAP_CONFIG.CIRCLE_RADIUS_KM / 111 // Conversion km vers degrés
      });
    }
  }, [showSelectionTools, drawingState.mode, setSelectionArea]);

  useMapEvents({
    mousedown: handleMouseDown,
    mouseup: handleMouseUp,
    click: handleClick,
    contextmenu: (e) => {
      // Annuler le dessin en cours sur clic droit
      console.log('Drawing cancelled at:', e.latlng);
      if (drawingState.isDrawing) {
        setDrawingState(prev => ({
          ...prev,
          isDrawing: false,
          startPoint: undefined,
        }));
      }
    }
  });

  return null;
});

MapEventHandler.displayName = 'MapEventHandler';

// Composant pour la gestion des couches de tuiles
const TileLayerManager: React.FC<{ mapView: string }> = React.memo(({ mapView }) => {
  const layerConfig = TILE_LAYERS[mapView as keyof typeof TILE_LAYERS] || TILE_LAYERS.street;

  return (
    <TileLayer
      url={layerConfig.url}
      attribution={layerConfig.attribution}
      maxZoom={layerConfig.maxZoom}
      keepBuffer={4}
      updateWhenZooming={false}
      updateWhenIdle={true}
    />
  );
});

TileLayerManager.displayName = 'TileLayerManager';

// Composant pour les zones de sélection
const SelectionAreaRenderer: React.FC = React.memo(() => {
  const { selectionArea } = useAppStore();

  if (!selectionArea) return null;

  if (selectionArea.type === 'circle' && selectionArea.center && selectionArea.radius) {
    return (
      <Circle
        center={new LatLng(selectionArea.center[0], selectionArea.center[1])}
        radius={selectionArea.radius * MAP_CONFIG.DEGREE_TO_METERS}
        pathOptions={{
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '5, 5',
        }}
      />
    );
  }

  // TODO: Ajouter le rendu pour les rectangles et polygones
  return null;
});

SelectionAreaRenderer.displayName = 'SelectionAreaRenderer';

// Composant pour les marqueurs d'actifs optimisés
const ActifLayersRenderer: React.FC = React.memo(() => {
  const { filteredActifs, selectedActifs, toggleActifSelection } = useAppStore();

  const renderedActifs = useMemo(() =>
    filteredActifs.map((actif) => (
      <ActifLayer
        key={actif.id}
        actif={actif}
        isSelected={selectedActifs.includes(actif.id)}
        onSelect={toggleActifSelection}
      />
    )),
    [filteredActifs, selectedActifs, toggleActifSelection]
  );

  return <>{renderedActifs}</>;
});

ActifLayersRenderer.displayName = 'ActifLayersRenderer';

// Composant principal optimisé
const LeafletMap: React.FC = () => {
  const mapRef = useRef<Map | null>(null);
  const { mapView } = useAppStore();

  // Mémoriser la configuration de la carte
  const mapOptions = useMemo(() => ({
    center: MAP_CONFIG.CENTER,
    zoom: MAP_CONFIG.DEFAULT_ZOOM,
    minZoom: MAP_CONFIG.MIN_ZOOM,
    maxZoom: MAP_CONFIG.MAX_ZOOM,
    zoomControl: false, // On utilisera des contrôles personnalisés
    attributionControl: true,
    preferCanvas: true, // Améliore les performances pour de nombreux marqueurs
  }), []);

  // Styles CSS optimisés et centralisés
  const mapStyles = useMemo(() => `
    .custom-div-icon {
      background: transparent;
      border: none;
    }
    
    .marker-pin {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #3B82F6;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .marker-pin:hover {
      background: #2563EB;
      transform: scale(1.1);
    }
    
    .marker-pin::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid #3B82F6;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
    }
    
    .marker-pin:hover::after {
      border-top-color: #2563EB;
    }
    
    .leaflet-cluster-anim .leaflet-marker-icon, 
    .leaflet-cluster-anim .leaflet-marker-shadow {
      transition: transform 0.3s ease-out, opacity 0.3s ease-in;
    }
    
    .marker-cluster {
      background: rgba(59, 130, 246, 0.9);
      border: 2px solid white;
      border-radius: 50%;
      color: white;
      font-weight: 600;
      text-align: center;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    }
    
    .marker-cluster:hover {
      background: rgba(37, 99, 235, 0.9);
      transform: scale(1.05);
    }
    
    .marker-cluster div {
      background: inherit;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Styles pour les outils de sélection */
    .leaflet-draw-toolbar {
      margin-top: 10px !important;
    }
    
    /* Amélioration de l'accessibilité */
    .leaflet-container {
      font-family: inherit;
    }
    
    .leaflet-popup-content {
      margin: 8px 12px;
      line-height: 1.4;
    }

    /* Optimisations pour mobile */
    @media (max-width: 768px) {
      .marker-pin {
        width: 20px;
        height: 20px;
      }
      
      .marker-pin::after {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #3B82F6;
        bottom: -6px;
      }
      
      .marker-cluster {
        font-size: 10px;
      }
    } 
  `, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        {...mapOptions}
        ref={mapRef}
        style={{ height: '100%', width: '100%' }}
        className="z-0 focus:outline-none"
        whenReady={() => {
          console.log('Map initialized successfully');
        }}
      >
        <TileLayerManager mapView={mapView} />
        <MapEventHandler />
        <SelectionTools />
        <ActifLayersRenderer />
        <SelectionAreaRenderer />
      </MapContainer>

      {/* Contrôles de la carte */}
      <MapControls />

      {/* Styles optimisés */}
      <style>{mapStyles}</style>
    </div>
  );
};

export default React.memo(LeafletMap);