import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mtData, posteData, supportsData, type GeoJSONFeature } from '@/data/sup';
import { convertCoordinates, getLineStyle, getPostIcon, getSupportIcon } from './utils';
import { 
  useMapStore, 
  useLayerActions, 
  useSelectionActions, 
  useFilterActions,
  useExportActions,
  useLayerVisibility,
  useSelection,
  useConversionStats,
  useFilters,
  useFilteredFeatures,
  useHasActiveFilters,
  useSelectedCount,
  useFilteredCount,
  type ExportOptions
} from '@/store/map_store';

// Composant pour le panneau de filtres
const FilterPanel: React.FC = () => {
  const filters = useFilters();
  const { setFilter, clearFilters, clearFilter, applyFilters } = useFilterActions();
  const { toggleFilterPanel } = useMapStore();
  const hasActiveFilters = useHasActiveFilters();
  const filteredCount = useFilteredCount();

  const handleApplyFilters = () => {
    applyFilters({
      mt: mtData.features,
      postes: posteData.features,
      supports: supportsData.features,
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '300px',
      maxHeight: '500px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Filtres</h3>
        <button onClick={toggleFilterPanel} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Recherche générale */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Recherche générale
        </label>
        <input
          type="text"
          value={filters.searchTerm}
          onChange={(e) => setFilter('searchTerm', e.target.value)}
          placeholder="Rechercher..."
          style={{
            width: '100%',
            padding: '6px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        />
      </div>

      {/* Filtres pour les supports */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Supports</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.supportType || ''}
              onChange={(e) => setFilter('supportType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="bois">Bois</option>
              <option value="metallique">Métallique</option>
              <option value="beton">Béton</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Statut</label>
            <select
              value={filters.supportStatus || ''}
              onChange={(e) => setFilter('supportStatus', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="bon">Bon</option>
              <option value="moyen">Moyen</option>
              <option value="mauvais">Mauvais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres pour les postes */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Postes</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.postType || ''}
              onChange={(e) => setFilter('postType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="H59">H59</option>
              <option value="H61">H61</option>
              <option value="H63">H63</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Tension</label>
            <select
              value={filters.postVoltage || ''}
              onChange={(e) => setFilter('postVoltage', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Toutes</option>
              <option value="5.5kV">5.5kV</option>
              <option value="15kV">15kV</option>
              <option value="30kV">30kV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres pour les lignes */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#555' }}>Lignes MT</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Type</label>
            <select
              value={filters.lineType || ''}
              onChange={(e) => setFilter('lineType', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="aerienne">Aérienne</option>
              <option value="souterraine">Souterraine</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '3px' }}>Statut</label>
            <select
              value={filters.lineStatus || ''}
              onChange={(e) => setFilter('lineStatus', e.target.value || null)}
              style={{ width: '100%', padding: '4px', fontSize: '11px' }}
            >
              <option value="">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button
          onClick={handleApplyFilters}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Appliquer ({filteredCount})
        </button>
        <button
          onClick={clearFilters}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Effacer
        </button>
      </div>

      {hasActiveFilters && (
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#28a745' }}>
          ✓ Filtres actifs - {filteredCount} résultats
        </div>
      )}
    </div>
  );
};

// Composant pour le panneau de sélection
const SelectionPanel: React.FC = () => {
  const selection = useSelection();
  const { clearSelection, setSelectionMode, selectAll } = useSelectionActions();
  const { toggleSelectionPanel } = useMapStore();
  const selectedCount = useSelectedCount();

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      minWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>
          Sélection ({selectedCount})
        </h3>
        <button onClick={toggleSelectionPanel} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Mode de sélection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Mode de sélection
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="selectionMode"
              checked={selection.selectionMode === 'single'}
              onChange={() => setSelectionMode('single')}
              style={{ marginRight: '5px' }}
            />
            Simple
          </label>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="selectionMode"
              checked={selection.selectionMode === 'multiple'}
              onChange={() => setSelectionMode('multiple')}
              style={{ marginRight: '5px' }}
            />
            Multiple
          </label>
        </div>
      </div>

      {/* Actions de sélection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
          Actions
        </label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <button
            onClick={() => selectAll()}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Tout sélectionner
          </button>
          <button
            onClick={() => selectAll('mt')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Lignes MT
          </button>
          <button
            onClick={() => selectAll('postes')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Postes
          </button>
          <button
            onClick={() => selectAll('supports')}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa'
            }}
          >
            Supports
          </button>
          <button
            onClick={clearSelection}
            style={{
              padding: '4px 8px',
              fontSize: '10px',
              border: '1px solid #dc3545',
              borderRadius: '3px',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              color: '#dc3545'
            }}
          >
            Effacer
          </button>
        </div>
      </div>

      {/* Liste des éléments sélectionnés */}
      {selection.selectedFeatures.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
            Éléments sélectionnés
          </label>
          <div style={{ maxHeight: '150px', overflow: 'auto' }}>
            {selection.selectedFeatures.map((feature, index) => (
              <div key={index} style={{
                padding: '5px',
                border: '1px solid #eee',
                borderRadius: '3px',
                marginBottom: '3px',
                fontSize: '10px'
              }}>
                <strong>{feature.properties.name || feature.properties.id || `Item ${index + 1}`}</strong>
                <br />
                <span style={{ color: '#666' }}>
                  {feature.geometry.type} - {Object.keys(feature.properties).length} propriétés
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour le panneau d'exportation
const ExportPanel: React.FC = () => {
  const { toggleExportPanel } = useMapStore();
  const { exportSelection, exportFilteredData, exportAll } = useExportActions();
  const selectedCount = useSelectedCount();
  const filteredCount = useFilteredCount();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeGeometry: true,
    selectedOnly: false,
    layerTypes: ['mt', 'postes', 'supports']
  });

  const handleExport = (type: 'selection' | 'filtered' | 'all') => {
    switch (type) {
      case 'selection':
        exportSelection(exportOptions);
        break;
      case 'filtered':
        exportFilteredData(exportOptions);
        break;
      case 'all':
        exportAll(exportOptions);
        break;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      minWidth: '400px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Exportation</h3>
        <button onClick={toggleExportPanel} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {/* Options d'exportation */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
          Format d'exportation
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['json', 'csv', 'kml', 'excel'] as const).map(format => (
            <label key={format} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="format"
                value={format}
                checked={exportOptions.format === format}
                onChange={(e) => setExportOptions({...exportOptions, format: e.target.value as any})}
                style={{ marginRight: '5px' }}
              />
              {format.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Couches à exporter */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>
          Couches à exporter
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['mt', 'postes', 'supports'] as const).map(layer => (
            <label key={layer} style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={exportOptions.layerTypes.includes(layer)}
                onChange={(e) => {
                  const newLayerTypes = e.target.checked
                    ? [...exportOptions.layerTypes, layer]
                    : exportOptions.layerTypes.filter(l => l !== layer);
                  setExportOptions({...exportOptions, layerTypes: newLayerTypes});
                }}
                style={{ marginRight: '5px' }}
              />
              {layer === 'mt' ? 'Lignes MT' : layer === 'postes' ? 'Postes' : 'Supports'}
            </label>
          ))}
        </div>
      </div>

      {/* Options supplémentaires */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '11px', cursor: 'pointer', marginBottom: '5px' }}>
          <input
            type="checkbox"
            checked={exportOptions.includeGeometry}
            onChange={(e) => setExportOptions({...exportOptions, includeGeometry: e.target.checked})}
            style={{ marginRight: '5px' }}
          />
          Inclure la géométrie
        </label>
      </div>

      {/* Boutons d'exportation */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => handleExport('selection')}
          disabled={selectedCount === 0}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: selectedCount > 0 ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Sélection ({selectedCount})
        </button>
        <button
          onClick={() => handleExport('filtered')}
          disabled={filteredCount === 0}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: filteredCount > 0 ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: filteredCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '12px'
          }}
        >
          Filtrés ({filteredCount})
        </button>
        <button
          onClick={() => handleExport('all')}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Tout
        </button>
      </div>
    </div>
  );
};

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
    showInfoPanel, 
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

  // Fonction pour créer le popup
  const createPopup = (feature: GeoJSONFeature, type: string) => {
    let content = `<div style="max-width: 300px; font-family: Arial, sans-serif;">`;
    content += `<h3 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">${type}</h3>`;
    
    Object.entries(feature.properties).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        content += `<p style="margin: 2px 0; font-size: 12px;"><strong>${key}:</strong> ${value}</p>`;
      }
    });
    
    content += `</div>`;
    return content;
  };

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

    const mtLayer = L.layerGroup();
    const posteLayer = L.layerGroup();
    const supportsLayer = L.layerGroup();

    // Ajouter les lignes MT
    mtData.features.forEach(feature => {
      stats.totalFeatures++;
      
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates
          .map(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const converted = convertCoordinates(coord[0], coord[1]);
              if (converted) {
                stats.validCoordinates++;
                return converted;
              } else {
                stats.invalidCoordinates++;
                return null;
              }
            }
            stats.invalidCoordinates++;
            return null;
          })
          .filter((c): c is [number, number] => c !== null);

        if (coords.length >= 2) {
          const line = L.polyline(coords, getLineStyle(feature))
            .bindPopup(createPopup(feature, 'Ligne MT'))
            .on('click', () => addToSelection(feature));
          mtLayer.addLayer(line);
        }
      }
    });

    // Ajouter les postes
    posteData.features.forEach(feature => {
      stats.totalFeatures++;
      
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertCoordinates(coordsArray[0], coordsArray[1]);
        
        if (coords) {
          stats.validCoordinates++;
          const marker = L.marker(coords, { icon: getPostIcon(feature) })
            .bindPopup(createPopup(feature, 'Poste'))
            .on('click', () => addToSelection(feature));
          
          posteLayer.addLayer(marker);
        } else {
          stats.invalidCoordinates++;
          console.warn(`Impossible de convertir les coordonnées du poste: ${feature.properties.NOM}`, coordsArray);
        }
      }
    });

    // Ajouter les supports
    supportsData.features.forEach(feature => {
      stats.totalFeatures++;
      
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertCoordinates(coordsArray[0], coordsArray[1]);

        if (coords) {
          stats.validCoordinates++;
          const marker = L.marker(coords, { icon: getSupportIcon(feature) })
            .bindPopup(createPopup(feature, 'Support'))
            .on('click', () => addToSelection(feature));

          supportsLayer.addLayer(marker);
        } else {
          stats.invalidCoordinates++;
          console.warn(`Impossible de convertir les coordonnées du support: ${feature.properties.ID_Support}`, coordsArray);
        }
      }
    });

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
    console.log('Statistiques de conversion:', stats);
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
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
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

      {/* Panneau d'informations sur l'élément sélectionné */}
      {selection.selectedFeatures.length > 0 && showInfoPanel && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '320px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '300px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '12px', color: '#333' }}>
              Dernier élément sélectionné
            </h4>
            <button
              onClick={() => {/* Implémenter la fermeture si nécessaire */}}
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
          <div style={{ fontSize: '11px' }}>
            {selection.selectedFeatures.length > 0 && Object.entries(selection.selectedFeatures[selection.selectedFeatures.length - 1].properties).map(([key, value]) => (
              value !== null && value !== undefined && value !== '' && (
                <div key={key} style={{ marginBottom: '2px' }}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Conteneur de la carte */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapView;