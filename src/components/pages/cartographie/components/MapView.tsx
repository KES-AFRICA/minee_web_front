import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {useMapStore} from "@/store/mapStore.ts";
import type {Actif} from "@/types/MapTypes.ts";

// Fix for default markers

const DefaultIcon = L.divIcon({
  html: `<div class="custom-marker"></div>`,
  className: 'custom-div-icon',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons for different types
const getMarkerIcon = (type: string, isSelected: boolean = false) => {
  const colors = {
    restaurant: '#ef4444',
    hotel: '#3b82f6',
    attraction: '#22c55e',
    shop: '#a855f7'
  };

  const icons = {
    restaurant: '🍽️',
    hotel: '🏨',
    attraction: '🎯',
    shop: '🛍️'
  };

  const color = colors[type as keyof typeof colors] || '#6b7280';
  const icon = icons[type as keyof typeof icons] || '📍';
  const size = isSelected ? 40 : 30;
  const scale = isSelected ? 1.2 : 1;

  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, ${color}dd);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg) scale(${scale});
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        ${isSelected ? 'animation: pulse 2s infinite;' : ''}
      ">
        <div style="
          font-size: 16px;
          transform: rotate(45deg);
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        ">
          ${icon}
        </div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size]
  });
};

const MapEvents: React.FC = () => {
  const map = useMap();
  const { drawingMode } = useMapStore();

  useEffect(() => {
    if (drawingMode) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }
  }, [drawingMode, map]);

  return null;
};

const MapView: React.FC = () => {
  const {
    filteredElements,
    selectedElements,
    drawingMode,
    setSelectedElements,
    setSelectionArea
  } = useMapStore();

  const featureGroupRef = useRef<L.FeatureGroup>(null);

  const handleMarkerClick = (element: Actif) => {
    if (!drawingMode) {
      const isSelected = selectedElements.some(el => el.id === element.id);
      if (isSelected) {
        setSelectedElements(selectedElements.filter(el => el.id !== element.id));
      } else {
        setSelectedElements([...selectedElements, element]);
      }
    }
  };

  const onCreated = (e: any) => {
    const { layer } = e;
    const bounds = layer.getBounds();
    
    // Find elements within the drawn area
    const elementsInArea = filteredElements.filter(element => {
      const point = L.latLng(element.geolocalisation.latitude, element.geolocalisation.longitude);
      return bounds.contains(point);
    });

    setSelectedElements(elementsInArea);
    setSelectionArea({
      bounds: [[bounds.getSouth(), bounds.getWest()], [bounds.getNorth(), bounds.getEast()]],
      shape: 'rectangle',
      coordinates: null
    });

    // Remove the drawn layer after selection
    if (featureGroupRef.current) {
      featureGroupRef.current.removeLayer(layer);
    }
  };

  const onDeleted = () => {
    setSelectedElements([]);
    setSelectionArea({
      bounds: null,
      shape: null,
      coordinates: null
    });
  };

  return (
    <div className="relative h-[90vh] border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg animate-slide-in-bottom">
      <MapContainer
        center={[4.0511, 9.7679]}
        zoom={13}
        className="h-full w-full z-0"
        style={{ height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents />
        
        {drawingMode && (
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topright"
              onCreated={onCreated}
              onDeleted={onDeleted}
              draw={{
                rectangle: {
                  shapeOptions: {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                    weight: 3
                  }
                },
                polygon: {
                  shapeOptions: {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                    weight: 3
                  }
                },
                circle: {
                  shapeOptions: {
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                    weight: 3
                  }
                },
                polyline: false,
                marker: false,
                circlemarker: false
              }}
              edit={{
                edit: false,
                remove: true
              }}
            />
          </FeatureGroup>
        )}

        {filteredElements.map(element => {
          const isSelected = selectedElements.some(el => el.id === element.id);
          return (
            <Marker
              key={element.id}
              position={[element.geolocalisation.latitude, element.geolocalisation.longitude]}
              icon={getMarkerIcon(element.type, isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(element)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-4 min-w-[280px] max-w-[320px]">
                  <div className="relative mb-3">
                    <img 
                      alt={element.designationGenerale}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="text-xs font-bold text-green-600">{element.date}€</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{element.designationGenerale}</h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{element.designationGenerale}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm font-bold text-gray-900">{element.anneeMiseEnService}</span>
                      <span className="text-xs text-gray-500">({Math.floor(Math.random() * 200 + 50)} avis)</span>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                      {element.type}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleMarkerClick(element)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isSelected 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isSelected ? 'Désélectionner' : 'Sélectionner'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {drawingMode && (
        <div className="absolute top-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-2xl shadow-2xl z-10 border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <p className="text-sm font-bold">Mode sélection actif</p>
              <p className="text-xs opacity-90">Dessinez une forme pour sélectionner des éléments</p>
            </div>
          </div>
        </div>
      )}

      {selectedElements.length > 0 && (
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-lg px-6 py-4 rounded-2xl shadow-2xl z-10 border border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-gray-900">
                {selectedElements.length} élément{selectedElements.length > 1 ? 's' : ''} sélectionné{selectedElements.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-sm font-bold text-green-600">
              {selectedElements.reduce((sum, el) => sum + el.anneeMiseEnService, 0)}€
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;