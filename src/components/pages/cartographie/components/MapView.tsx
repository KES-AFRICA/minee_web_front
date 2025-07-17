import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mtData, posteData, supportsData } from '@/data/sup';
import { convertCoordinates } from './utils';
import { 
  useMapStore, 
  useLayerActions, 
  useSelectionActions, 
  useLayerVisibility,
  useSelection,
  useConversionStats,
} from '@/store/map_store';
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

  // Store state
  const { 
    mapInstance, 
    isMapInitialized, 
    showLayerPanel, 
    showStatsPanel,
    showFilterPanel,
    showSelectionPanel,
    showExportPanel,
    setMapInstance,
    setMapInitialized,
    updateConversionStats,
    toggleLayerPanel,
    toggleFilterPanel,
    toggleSelectionPanel,
    toggleExportPanel
  } = useMapStore();

  const layerVisibility = useLayerVisibility();
  const selection = useSelection();
  const conversionStats = useConversionStats();
  
  const { toggleLayer, showAllLayers, hideAllLayers } = useLayerActions();
  const { addToSelection } = useSelectionActions();


  // Fonction pour créer les couches de données
  const createDataLayers = () => {
    if (!mapInstance || !mapInstance.getContainer()) return;

    if (!mapInstance.getPanes() || !mapInstance.getPanes().overlayPane) {
      console.warn('Map not ready, retrying...');
      setTimeout(() => createDataLayers(), 100);
      return;
    }

    let stats = {
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

    const overlayMaps = {
      "Lignes MT": mtLayer,
      "Postes": posteLayer,
      "Supports": supportsLayer
    };

    try {
      L.control.layers(undefined, overlayMaps).addTo(mapInstance);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contrôle des couches:', error);
    }

    fitMapToBounds();
  };

  // Fonction pour ajuster la vue de la carte
  const fitMapToBounds = () => {
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
  };

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainerRef.current || isMapInitialized) return;

    if (mapInstance) {
      mapInstance.remove();
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [4.0511, 9.7679],
        zoom: 13,
        zoomControl: true,
        preferCanvas: false,
        renderer: L.svg()
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      map.whenReady(() => {
        setMapInstance(map);
        setMapInitialized(true);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
        setMapInitialized(false);
      }
    };
  }, []);

  // Créer les couches de données
  useEffect(() => {
    if (mapInstance && isMapInitialized) {
      const timer = setTimeout(() => {
        createDataLayers();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [mapInstance, isMapInitialized]);

  // Gérer la visibilité des couches
  useEffect(() => {
    if (!mapInstance || !layerGroupsRef.current) return;

    if (!mapInstance.getPanes()) return;

    const { mt, postes, supports } = layerGroupsRef.current;

    try {
      // Gérer la visibilité des lignes MT
      if (layerVisibility.mt) {
        if (!mapInstance.hasLayer(mt)) {
          mapInstance.addLayer(mt);
        }
      } else {
        if (mapInstance.hasLayer(mt)) {
          mapInstance.removeLayer(mt);
        }
      }

      // Gérer la visibilité des postes
      if (layerVisibility.postes) {
        if (!mapInstance.hasLayer(postes)) {
          mapInstance.addLayer(postes);
        }
      } else {
        if (mapInstance.hasLayer(postes)) {
          mapInstance.removeLayer(postes);
        }
      }

      // Gérer la visibilité des supports
      if (layerVisibility.supports) {
        if (!mapInstance.hasLayer(supports)) {
          mapInstance.addLayer(supports);
        }
      } else {
        if (mapInstance.hasLayer(supports)) {
          mapInstance.removeLayer(supports);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la visibilité des couches:', error);
    }
  }, [layerVisibility, mapInstance]);

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
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: '12px'
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
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapView;