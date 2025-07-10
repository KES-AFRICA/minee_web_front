import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mtData, posteData, supportsData, type GeoJSONFeature, type LineProperties, type PostProperties, type SupportProperties } from '@/data/sup';



const MapView: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  


  // Fonction pour convertir les coordonnées UTM en LatLng
  const convertUTMToLatLng = (x: number, y: number): [number, number] => {
    // Approximation pour la zone UTM 32N (Cameroun)
    // Pour une conversion précise, utilisez une bibliothèque comme proj4
    const lat = (y - 500000) / 111320;
    const lng = (x - 500000) / (111320 * Math.cos(lat * Math.PI / 180));
    return [3.8667 + lat * 0.00001, 11.5167 + lng * 0.00001];
  };

  // Styles pour les différents types d'éléments
  const getLineStyle = (feature: GeoJSONFeature<LineProperties>) => {
    const type = feature.properties.TYPE;
    return {
      color: type === 'Aerien' ? '#ff6b6b' : '#4ecdc4',
      weight: 3,
      opacity: 0.8,
      dashArray: type === 'Souterrain' ? '5, 5' : undefined
    };
  };

  const getPostIcon = (feature: GeoJSONFeature<PostProperties>) => {
    const typePost = feature.properties.Type_Post;
    const color = typePost === 'H59' ? '#ff9f43' : '#0fbcf9';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-post-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  const getSupportIcon = (feature: GeoJSONFeature<SupportProperties>) => {
    const nature = feature.properties.Nature;
    const color = nature === 'Bois' ? '#8b4513' : nature === 'Metallique' ? '#708090' : '#696969';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 8px; height: 8px; border-radius: 2px; border: 1px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-support-icon',
      iconSize: [8, 8],
      iconAnchor: [4, 4]
    });
  };

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

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialiser la carte
    mapRef.current = L.map(mapContainerRef.current, {
      center: [3.8667, 11.5167], // Centre approximatif du Cameroun
      zoom: 12,
      zoomControl: true
    });

    // Ajouter la couche de base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(mapRef.current);

    // Groupe de couches
    const mtLayer = L.layerGroup();
    const posteLayer = L.layerGroup();
    const supportsLayer = L.layerGroup();

    // Ajouter les lignes MT
    mtData.features.forEach(feature => {
      console.log(feature.geometry.type);
      if (feature.geometry.type === 'LineString') {
        const coords = feature.geometry.coordinates
          .map(coord =>
            Array.isArray(coord) && coord.length >= 2
              ? convertUTMToLatLng(coord[0], coord[1]) as [number, number]
              : null
          )
          .filter((c): c is [number, number] => Array.isArray(c) && c.length === 2);

        if (coords.length >= 2) {
          const line = L.polyline(coords, getLineStyle(feature))
            .bindPopup(createPopup(feature, 'Ligne MT'))
            .on('click', () => setSelectedFeature(feature));
          mtLayer.addLayer(line);
        }
      }
    });

    // Ajouter les postes
    posteData.features.forEach(feature => {

      console.log(feature.geometry.type);
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertUTMToLatLng(
          coordsArray[0], 
          coordsArray[1]
        );
        
        const marker = L.marker(coords, { icon: getPostIcon(feature) })
          .bindPopup(createPopup(feature, 'Poste'))
          .on('click', () => setSelectedFeature(feature));
        
        posteLayer.addLayer(marker);
      }
    });

    // Ajouter les supports
    supportsData.features.forEach(feature => {
      console.log(feature.geometry.coordinates);
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertUTMToLatLng(
          coordsArray[0],
          coordsArray[1]
        );

        const marker = L.marker(coords, { icon: getSupportIcon(feature) })
          .bindPopup(createPopup(feature, 'Support'))
          .on('click', () => setSelectedFeature(feature));

        supportsLayer.addLayer(marker);
      }
    });

    // Ajouter toutes les couches par défaut
    mtLayer.addTo(mapRef.current);
    posteLayer.addTo(mapRef.current);
    supportsLayer.addTo(mapRef.current);

    // Contrôle des couches
    const overlayMaps = {
      "Lignes MT": mtLayer,
      "Postes": posteLayer,
      "Supports": supportsLayer
    };

    L.control.layers(undefined, overlayMaps).addTo(mapRef.current);

    // Ajuster la vue pour montrer tous les éléments
    const allFeatures = [...mtData.features, ...posteData.features, ...supportsData.features];
    if (allFeatures.length > 0) {
      const bounds = L.latLngBounds([]);
      allFeatures.forEach(feature => {
        if (feature.geometry.type === 'Point') {
          const coordsArray = feature.geometry.coordinates as number[];
          const coords = convertUTMToLatLng(
            coordsArray[0], 
            coordsArray[1]
          );
          bounds.extend(coords);
        } else if (feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach(coord => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const coords = convertUTMToLatLng(coord[0], coord[1]);
              bounds.extend(coords);
            }
          });
        }
      });
      mapRef.current.fitBounds(bounds, { padding: [10, 10] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Panneau de contrôle */}
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
        <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
          Réseau Électrique
        </h3>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Couches:
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

        <div style={{ fontSize: '10px', color: '#999', marginTop: '10px' }}>
          Total: {mtData.features.length + posteData.features.length + supportsData.features.length} éléments
        </div>
      </div>

      {/* Panneau d'informations sur l'élément sélectionné */}
      {selectedFeature && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
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
            <h4 style={{ margin: 0, fontSize: '12px', color: '#333' }}>Élément sélectionné</h4>
            <button
              onClick={() => setSelectedFeature(null)}
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
            {Object.entries(selectedFeature.properties).map(([key, value]) => (
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