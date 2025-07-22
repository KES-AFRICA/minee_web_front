/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Import Leaflet Draw
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { mtData, posteData, supportsData } from '@/data/sup';
import { convertCoordinates } from './utils';
import { useMapStore } from '@/store/map_store';
import { addMTLines, addPostesToLayer, addSupportsToLayer } from './utilLayer';
import { FilterPanel } from './FilterPanel';
import { SelectionPanel } from './SelectionPanel';
import { ExportPanel } from './ExportPanel';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupsRef = useRef<{
    mt: L.LayerGroup;
    postes: L.LayerGroup;
    supports: L.LayerGroup;
  } | null>(null);
  const baseLayersRef = useRef<{ [key: string]: L.TileLayer } | null>(null);
  const layerControlRef = useRef<L.Control.Layers | null>(null);
  const drawLayerRef = useRef<L.LayerGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  // État local pour éviter les boucles
  const [isInitialized, setIsInitialized] = useState(false);
  const [dataLayersCreated, setDataLayersCreated] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'none' | 'circle' | 'rectangle' | 'polygon'>('none');
  const [selectedInArea, setSelectedInArea] = useState<any[]>([]);

  // Sélection directe des propriétés du store pour éviter les re-rendus
  const mapInstance = useMapStore((state) => state.mapInstance);
  const isMapInitialized = useMapStore((state) => state.isMapInitialized);
  const showLayerPanel = useMapStore((state) => state.showLayerPanel);
  const showStatsPanel = useMapStore((state) => state.showStatsPanel);
  const showFilterPanel = useMapStore((state) => state.showFilterPanel);
  const showSelectionPanel = useMapStore((state) => state.showSelectionPanel);
  const showExportPanel = useMapStore((state) => state.showExportPanel);
  const layerVisibility = useMapStore((state) => state.layerVisibility);
  const selection = useMapStore((state) => state.selection);
  const conversionStats = useMapStore((state) => state.conversionStats);
  const mapType = useMapStore((state) => state.mapType);

  // Actions du store
  const setMapInstance = useMapStore((state) => state.setMapInstance);
  const setMapInitialized = useMapStore((state) => state.setMapInitialized);
  const updateConversionStats = useMapStore((state) => state.updateConversionStats);
  const toggleLayerPanel = useMapStore((state) => state.toggleLayerPanel);
  const toggleFilterPanel = useMapStore((state) => state.toggleFilterPanel);
  const toggleSelectionPanel = useMapStore((state) => state.toggleSelectionPanel);
  const toggleExportPanel = useMapStore((state) => state.toggleExportPanel);
  const setMapType = useMapStore((state) => state.setMapType);
  const toggleLayer = useMapStore((state) => state.toggleLayer);
  const showAllLayers = useMapStore((state) => state.showAllLayers);
  const hideAllLayers = useMapStore((state) => state.hideAllLayers);
  const addToSelection = useMapStore((state) => state.addToSelection);
  const clearSelection = useMapStore((state) => state.clearSelection);

  // Fonction pour vérifier si un point est dans un cercle
  const isPointInCircle = useCallback((point: L.LatLng, center: L.LatLng, radius: number) => {
    const distance = center.distanceTo(point);
    return distance <= radius;
  }, []);

  // Fonction pour vérifier si un point est dans un polygone
  const isPointInPolygon = useCallback((point: L.LatLng, polygon: L.LatLng[]) => {
    let inside = false;
    const x = point.lat;
    const y = point.lng;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lng;
      const xj = polygon[j].lat;
      const yj = polygon[j].lng;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }, []);

  // Fonction pour vérifier si une ligne intersecte avec une zone
  const isLineIntersectingArea = useCallback((lineCoords: L.LatLng[], shape: any) => {
    // Vérifier si au moins un point de la ligne est dans la zone
    for (const coord of lineCoords) {
      if (shape.type === 'circle') {
        if (isPointInCircle(coord, shape.center, shape.radius)) {
          return true;
        }
      } else if (shape.type === 'polygon') {
        if (isPointInPolygon(coord, shape.polygon)) {
          return true;
        }
      }
    }
    return false;
  }, [isPointInCircle, isPointInPolygon]);

  // Fonction pour sélectionner les éléments dans une zone
  const selectElementsInArea = useCallback((layer: any) => {
    if (!layerGroupsRef.current) return;

    const { mt, postes, supports } = layerGroupsRef.current;
    const selectedFeatures: any[] = [];

    // Déterminer le type de forme et ses propriétés
    let shape: any = {};
    if (layer instanceof L.Circle) {
      shape = {
        type: 'circle',
        center: layer.getLatLng(),
        radius: layer.getRadius()
      };
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      shape = {
        type: 'polygon',
        polygon: layer.getLatLngs()[0] as L.LatLng[]
      };
    }

    // Fonction pour vérifier tous les layers
    const checkLayer = (layerGroup: L.LayerGroup, layerType: string) => {
      layerGroup.eachLayer((subLayer: any) => {
        if (subLayer.feature) {
          const feature = subLayer.feature;
          let isInArea = false;

          if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates;
            const latLng = convertCoordinates(coords[0], coords[1]);
            if (latLng) {
              if (shape.type === 'circle') {
                isInArea = isPointInCircle(latLng, shape.center, shape.radius);
              } else if (shape.type === 'polygon') {
                isInArea = isPointInPolygon(latLng, shape.polygon);
              }
            }
          } else if (feature.geometry.type === 'LineString') {
            const lineCoords: L.LatLng[] = [];
            feature.geometry.coordinates.forEach((coord: number[]) => {
              const latLng = convertCoordinates(coord[0], coord[1]);
              if (latLng) lineCoords.push(latLng);
            });
            isInArea = isLineIntersectingArea(lineCoords, shape);
          }

          if (isInArea) {
            selectedFeatures.push({
              ...feature,
              layerType,
              leafletLayer: subLayer
            });
          }
        }
      });
    };

    // Vérifier chaque type de couche si elle est visible
    if (layerVisibility.mt && mapInstance?.hasLayer(mt)) {
      checkLayer(mt, 'mt');
    }
    if (layerVisibility.postes && mapInstance?.hasLayer(postes)) {
      checkLayer(postes, 'postes');
    }
    if (layerVisibility.supports && mapInstance?.hasLayer(supports)) {
      checkLayer(supports, 'supports');
    }

    // Ajouter les éléments sélectionnés au store
    selectedFeatures.forEach(feature => {
      addToSelection(feature);
    });

    setSelectedInArea(selectedFeatures);
    console.log(`Sélectionné ${selectedFeatures.length} éléments dans la zone`);
  }, [layerVisibility, mapInstance, isPointInCircle, isPointInPolygon, isLineIntersectingArea, addToSelection]);

  // Fonction pour initialiser les outils de dessin
  const initializeDrawingTools = useCallback(() => {
    if (!mapInstance) return;

    // Créer une couche pour les dessins
    const drawLayer = new L.LayerGroup();
    mapInstance.addLayer(drawLayer);
    drawLayerRef.current = drawLayer;

    // Configurer les options de dessin
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        circle: {
          shapeOptions: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        },
        rectangle: {
          shapeOptions: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        },
        polygon: {
          shapeOptions: {
            color: '#ff7800',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        }
      },
      edit: {
        featureGroup: drawLayer,
        remove: true
      }
    });

    mapInstance.addControl(drawControl);
    drawControlRef.current = drawControl;

    // Événements de dessin
    mapInstance.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;
      drawLayer.addLayer(layer);

      // Sélectionner les éléments dans la zone dessinée
      selectElementsInArea(layer);

      // Ajouter un popup avec les informations
      const popupContent = `
        <div>
          <strong>Zone de sélection</strong><br>
          Type: ${e.layerType}<br>
          Éléments sélectionnés: ${selectedInArea.length}
        </div>
      `;
      layer.bindPopup(popupContent);
    });

    mapInstance.on(L.Draw.Event.DELETED, (e: any) => {
      console.log('Formes supprimées');
      // Optionnel: désélectionner les éléments
    });

  }, [mapInstance, selectElementsInArea, selectedInArea.length]);

  // Fonction pour changer le type de carte
  const changeMapType = useCallback((newType: 'street' | 'satellite' | 'terrain') => {
    if (!mapInstance || !baseLayersRef.current) return;

    // Supprimer toutes les couches de base
    Object.values(baseLayersRef.current).forEach(layer => {
      if (mapInstance.hasLayer(layer)) {
        mapInstance.removeLayer(layer);
      }
    });

    // Ajouter la nouvelle couche
    if (baseLayersRef.current[newType]) {
      baseLayersRef.current[newType].addTo(mapInstance);
      setMapType(newType);
    }
  }, [mapInstance, setMapType]);

  // Fonction pour ajuster la vue de la carte
  const fitMapToBounds = useCallback(() => {
    if (!mapInstance) return;

    const allFeatures = [...mtData.features, ...posteData.features, ...supportsData.features];
    const bounds = L.latLngBounds([]);
    let hasValidBounds = false;

    allFeatures.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertCoordinates(coordsArray[0], coordsArray[1]);
        if (coords) {
          bounds.extend(coords);
          hasValidBounds = true;
        }
      } else if (feature.geometry.type === 'LineString') {
        feature.geometry.coordinates.forEach(coord => {
          if (Array.isArray(coord) && coord.length >= 2) {
            const coords = convertCoordinates(coord[0], coord[1]);
            if (coords) {
              bounds.extend(coords);
              hasValidBounds = true;
            }
          }
        });
      }
    });

    if (hasValidBounds) {
      mapInstance.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [mapInstance]);

  // Fonction pour créer les couches de données
  const createDataLayers = useCallback(() => {
    if (!mapInstance || !mapInstance.getContainer() || dataLayersCreated) return;

    if (!mapInstance.getPanes() || !mapInstance.getPanes().overlayPane) {
      console.warn('Map not ready, retrying...');
      setTimeout(() => createDataLayers(), 100);
      return;
    }

    const stats = {
      totalFeatures: 0,
      validCoordinates: 0,
      invalidCoordinates: 0
    };

    const posteLayer = L.layerGroup();
    const supportsLayer = L.layerGroup();
    const mtLayer = L.layerGroup();

    // Ajouter les lignes MT
    addMTLines(mtData, mtLayer, stats, addToSelection);
    // Ajouter les postes
    addPostesToLayer(posteData, posteLayer, stats, addToSelection);
    // Ajouter les supports
    addSupportsToLayer(supportsData, supportsLayer, stats, addToSelection);

    layerGroupsRef.current = {
      mt: mtLayer,
      postes: posteLayer,
      supports: supportsLayer
    };

    updateConversionStats(stats);

    try {
      if (layerVisibility.mt && !mapInstance.hasLayer(mtLayer)) {
        mapInstance.addLayer(mtLayer);
      }
      if (layerVisibility.postes && !mapInstance.hasLayer(posteLayer)) {
        mapInstance.addLayer(posteLayer);
      }
      if (layerVisibility.supports && !mapInstance.hasLayer(supportsLayer)) {
        mapInstance.addLayer(supportsLayer);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des couches:', error);
    }

    // Ajouter les overlays au contrôle existant
    if (layerControlRef.current) {
      const overlayMaps = {
        "Lignes MT": mtLayer,
        "Postes": posteLayer,
        "Supports": supportsLayer
      };

      Object.entries(overlayMaps).forEach(([name, overlay]) => {
        try {
          layerControlRef.current?.addOverlay(overlay, name);
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'overlay:', error);
        }
      });
    }

    setDataLayersCreated(true);
    fitMapToBounds();

    // Initialiser les outils de dessin après la création des couches
    setTimeout(() => {
      initializeDrawingTools();
    }, 100);
  }, [mapInstance, addToSelection, updateConversionStats, fitMapToBounds, layerVisibility, dataLayersCreated, initializeDrawingTools]);

  // Fonction pour effacer toutes les formes dessinées
  const clearDrawnShapes = useCallback(() => {
    if (drawLayerRef.current) {
      drawLayerRef.current.clearLayers();
      setSelectedInArea([]);
    }
  }, []);

  // Fonction pour effacer la sélection et les formes
  const clearSelectionAndShapes = useCallback(() => {
    clearSelection();
    clearDrawnShapes();
  }, [clearSelection, clearDrawnShapes]);

  // Initialisation de la carte - UNE SEULE FOIS
  useEffect(() => {
    if (!mapContainerRef.current || isInitialized) return;

    console.log('Initializing map...');
    setIsInitialized(true);

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Nettoyer toute carte existante
      if (mapInstance) {
        mapInstance.remove();
      }

      const map = L.map(mapContainerRef.current, {
        center: [4.0511, 9.7679],
        zoom: 13,
        zoomControl: true,
        preferCanvas: false,
        renderer: L.svg()
      });

      // Créer les couches de base
      const baseLayers = {
        street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri',
          maxZoom: 18
        }),
        terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenTopoMap contributors',
          maxZoom: 17
        })
      };

      baseLayersRef.current = baseLayers;

      // Ajouter la couche par défaut
      baseLayers[mapType].addTo(map);

      // Créer le contrôle des couches
      const layerControl = L.control.layers({
        "Carte": baseLayers.street,
        "Satellite": baseLayers.satellite,
        "Terrain": baseLayers.terrain
      }, {}).addTo(map);

      layerControlRef.current = layerControl;

      // Écouter les changements de couche de base
      map.on('baselayerchange', (e: any) => {
        const layerName = Object.keys(baseLayers).find(
          key => baseLayers[key as keyof typeof baseLayers] === e.layer
        );
        if (layerName && (layerName === 'street' || layerName === 'satellite' || layerName === 'terrain')) {
          setMapType(layerName as 'street' | 'satellite' | 'terrain');
        }
      });

      map.whenReady(() => {
        console.log('Map ready');
        setMapInstance(map);
        setMapInitialized(true);
      });
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []); // Dépendances vides - ne s'exécute qu'une fois

  // Créer les couches de données - UNE SEULE FOIS
  useEffect(() => {
    if (mapInstance && isMapInitialized && !dataLayersCreated) {
      console.log('Creating data layers...');
      const timer = setTimeout(() => {
        createDataLayers();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [mapInstance, isMapInitialized, dataLayersCreated]); // Dépendances minimales

  // Gérer la visibilité des couches
  useEffect(() => {
    if (!mapInstance || !layerGroupsRef.current || !dataLayersCreated) return;

    const { mt, postes, supports } = layerGroupsRef.current;

    try {
      // Gérer la visibilité des lignes MT
      if (layerVisibility.mt && !mapInstance.hasLayer(mt)) {
        mapInstance.addLayer(mt);
      } else if (!layerVisibility.mt && mapInstance.hasLayer(mt)) {
        mapInstance.removeLayer(mt);
      }

      // Gérer la visibilité des postes
      if (layerVisibility.postes && !mapInstance.hasLayer(postes)) {
        mapInstance.addLayer(postes);
      } else if (!layerVisibility.postes && mapInstance.hasLayer(postes)) {
        mapInstance.removeLayer(postes);
      }

      // Gérer la visibilité des supports
      if (layerVisibility.supports && !mapInstance.hasLayer(supports)) {
        mapInstance.addLayer(supports);
      } else if (!layerVisibility.supports && mapInstance.hasLayer(supports)) {
        mapInstance.removeLayer(supports);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la visibilité des couches:', error);
    }
  }, [layerVisibility, mapInstance, dataLayersCreated]);

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
        setMapInitialized(false);
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', zIndex: 10 }}>
      {/* Panneau de filtres */}
      {showFilterPanel && <FilterPanel />}

      {/* Panneau de sélection */}
      {showSelectionPanel && <SelectionPanel />}

      {/* Panneau d'exportation */}
      {showExportPanel && <ExportPanel />}

      {/* Panneau de contrôle principal */}
      {showLayerPanel && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minWidth: '200px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', color: '#333' }}>
              Réseau Électrique
            </h3>
            <button
              onClick={toggleLayerPanel}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          </div>

          {/* Sélecteur de type de carte */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Type de carte:
            </label>
            <select
              value={mapType}
              onChange={(e) => changeMapType(e.target.value as 'street' | 'satellite' | 'terrain')}
              style={{
                width: '100%',
                padding: '4px 8px',
                fontSize: '11px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="street">Carte</option>
              <option value="satellite">Satellite</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>

          {/* Outils de sélection par zone */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Sélection par zone:
            </label>
            <div style={{ fontSize: '11px', marginBottom: '5px' }}>

              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                <button
                  onClick={clearSelectionAndShapes}
                  style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    border: '1px solid #dc3545',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa',
                    color: '#dc3545'
                  }}
                >
                  Effacer tout
                </button>
                <button
                  onClick={clearDrawnShapes}
                  style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    border: '1px solid #ffc107',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fa',
                    color: '#ffc107'
                  }}
                >
                  Effacer formes
                </button>
              </div>
              {selectedInArea.length > 0 && (
                <div style={{ color: '#28a745', fontSize: '10px', marginTop: '3px' }}>
                  {selectedInArea.length} éléments sélectionnés dans la zone
                </div>
              )}
            </div>
          </div>

          {/* Contrôles de visibilité des couches */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Couches visibles:
            </label>
            <div style={{ fontSize: '11px' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '3px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layerVisibility.mt}
                  onChange={() => toggleLayer('mt')}
                  style={{ marginRight: '5px' }}
                />
                <div style={{ width: '12px', height: '3px', backgroundColor: '#ff6b6b', marginRight: '5px' }}></div>
                Lignes MT
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '3px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layerVisibility.postes}
                  onChange={() => toggleLayer('postes')}
                  style={{ marginRight: '5px' }}
                />
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ff9f43', borderRadius: '50%', marginRight: '5px' }}></div>
                Postes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: '3px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layerVisibility.supports}
                  onChange={() => toggleLayer('supports')}
                  style={{ marginRight: '5px' }}
                />
                <div style={{ width: '6px', height: '6px', backgroundColor: '#8b4513', borderRadius: '1px', marginRight: '5px' }}></div>
                Supports
              </label>
            </div>
          </div>

          {/* Boutons de contrôle */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={showAllLayers}
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa'
              }}
            >
              Tout
            </button>
            <button
              onClick={hideAllLayers}
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa'
              }}
            >
              Aucun
            </button>
            <button
              onClick={fitMapToBounds}
              style={{
                padding: '2px 6px',
                fontSize: '10px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa'
              }}
            >
              Ajuster
            </button>
          </div>

          {/* Boutons pour les panneaux */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={toggleFilterPanel}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                border: '1px solid #007bff',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: showFilterPanel ? '#007bff' : '#f8f9fa',
                color: showFilterPanel ? 'white' : '#007bff'
              }}
            >
              Filtres
            </button>
            <button
              onClick={toggleSelectionPanel}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                border: '1px solid #28a745',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: showSelectionPanel ? '#28a745' : '#f8f9fa',
                color: showSelectionPanel ? 'white' : '#28a745'
              }}
            >
              Sélection ({selection.selectedFeatures.length})
            </button>
            <button
              onClick={toggleExportPanel}
              style={{
                padding: '4px 8px',
                fontSize: '10px',
                border: '1px solid #ffc107',
                borderRadius: '3px',
                cursor: 'pointer',
                backgroundColor: showExportPanel ? '#ffc107' : '#f8f9fa',
                color: showExportPanel ? 'black' : '#ffc107'
              }}
            >
              Export
            </button>
          </div>

          {/* Légende */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              Légende:
            </label>
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '3px', backgroundColor: '#ff6b6b', marginRight: '5px' }}></div>
                Lignes aériennes
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '12px', height: '3px', backgroundColor: '#4ecdc4', marginRight: '5px', borderTop: '1px dashed #4ecdc4' }}></div>
                Lignes souterraines
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ff9f43', borderRadius: '50%', marginRight: '5px' }}></div>
                Postes H59
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#0fbcf9', borderRadius: '50%', marginRight: '5px' }}></div>
                Postes H61
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#8b4513', borderRadius: '1px', marginRight: '5px' }}></div>
                Supports bois
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: '#708090', borderRadius: '1px', marginRight: '5px' }}></div>
                Supports métalliques
              </div>
            </div>
          </div>

          {/* Statistiques */}
          {showStatsPanel && (
            <div style={{ fontSize: '10px', color: '#999', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
              <div>Total: {conversionStats.totalFeatures} éléments</div>
              <div style={{ color: '#28a745' }}>Affichés: {conversionStats.validCoordinates}</div>
              <div style={{ color: '#dc3545' }}>Non affichés: {conversionStats.invalidCoordinates}</div>
            </div>
          )}
        </div>
      )}

      {/* Bouton pour afficher/masquer le panneau de contrôle */}
      {!showLayerPanel && (
        <button
          onClick={toggleLayerPanel}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: '12px',
          }}
        >
          Couches
        </button>
      )}

      {/* Barre d'outils flottante */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        {/* Bouton pour basculer le type de carte */}
        <button
          onClick={() => changeMapType(mapType === 'street' ? 'satellite' : 'street')}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            backgroundColor: '#f8f9fa',
            color: '#333'
          }}
        >
          🗺️ {mapType === 'street' ? 'Satellite' : 'Carte'}
        </button>

        {/* Bouton pour effacer les sélections */}
        <button
          onClick={clearSelectionAndShapes}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            backgroundColor: '#dc3545',
            color: 'white'
          }}
        >
          🗑️ Effacer
        </button>

        <button
          onClick={toggleFilterPanel}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            backgroundColor: showFilterPanel ? '#007bff' : '#f8f9fa',
            color: showFilterPanel ? 'white' : '#007bff'
          }}
        >
          🔍 Filtres
        </button>
        <button
          onClick={toggleSelectionPanel}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            backgroundColor: showSelectionPanel ? '#28a745' : '#f8f9fa',
            color: showSelectionPanel ? 'white' : '#28a745'
          }}
        >
          ✓ Sélection ({selection.selectedFeatures.length})
        </button>
        <button
          onClick={toggleExportPanel}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            backgroundColor: showExportPanel ? '#ffc107' : '#f8f9fa',
            color: showExportPanel ? 'black' : '#ffc107'
          }}
        >
          📤 Export
        </button>
      </div>

      {/* Conteneur de la carte */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%',  }} />
    </div>
  );
};

export default MapView;