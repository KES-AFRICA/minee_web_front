import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mtData, posteData, supportsData, type GeoJSONFeature, type LineProperties, type PostProperties, type SupportProperties } from '@/data/sup';

const MapView: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [conversionStats, setConversionStats] = useState({
    totalFeatures: 0,
    validCoordinates: 0,
    invalidCoordinates: 0
  });

  // Fonction améliorée pour convertir les coordonnées UTM en LatLng
  const convertUTMToLatLng = (x: number, y: number): [number, number] | null => {
    // Vérifier si les coordonnées sont dans une plage valide pour l'UTM Zone 32N (Cameroun)
    if (x < 300000 || x > 800000 || y < 300000 || y > 800000) {
      console.warn(`Coordonnées UTM hors plage valide: x=${x}, y=${y}`);
      return null;
    }

    try {
      // Conversion améliorée pour UTM Zone 32N
      // Paramètres pour la zone UTM 32N (Cameroun)
      const zone = 32;
      const hemisphere = 'N';
      
      // Constantes pour la conversion UTM vers géographique
      const a = 6378137.0; // Semi-major axis (WGS84)
      const e = 0.0818191908426; // Eccentricity
      const e1sq = 0.00673949674228; // e'^2
      const k0 = 0.9996; // Scale factor
      
      // Correction pour le fuseau et l'origine
      const x0 = x - 500000; // Remove false easting
      const y0 = y; // For Northern hemisphere
      
      // Calcul approximatif - pour une conversion précise, utilisez proj4
      const M = y0 / k0;
      const mu = M / (a * (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256));
      
      // Latitude approximative
      const lat = mu + (3 * e1sq / 2 - 27 * Math.pow(e1sq, 3) / 32) * Math.sin(2 * mu)
                    + (21 * Math.pow(e1sq, 2) / 16 - 55 * Math.pow(e1sq, 4) / 32) * Math.sin(4 * mu)
                    + (151 * Math.pow(e1sq, 3) / 96) * Math.sin(6 * mu);
      
      // Longitude approximative
      const centralMeridian = (zone - 1) * 6 - 180 + 3; // Central meridian for zone 32 = 9°E
      const lng = centralMeridian + (x0 / (k0 * a * Math.cos(lat))) * (180 / Math.PI);
      
      const latDeg = lat * (180 / Math.PI);
      
      // Vérifier si les coordonnées résultantes sont plausibles pour le Cameroun
      if (latDeg < 1.5 || latDeg > 13.5 || lng < 8.0 || lng > 17.0) {
        console.warn(`Coordonnées converties hors du Cameroun: lat=${latDeg}, lng=${lng}`);
        return null;
      }
      
      return [latDeg, lng];
    } catch (error) {
      console.error(`Erreur lors de la conversion UTM: x=${x}, y=${y}`, error);
      return null;
    }
  };

  // Fonction alternative simple pour les coordonnées problématiques
  const convertUTMToLatLngSimple = (x: number, y: number): [number, number] | null => {
    try {
      // Conversion simple basée sur les coordonnées observées dans vos données
      // Zone UTM 32N pour le Cameroun (région de Douala/Yaoundé)
      
      // Point de référence approximatif pour Douala/Yaoundé
      const refX = 584000; // Coordonnée X de référence
      const refY = 451000; // Coordonnée Y de référence
      const refLat = 4.0511; // Latitude de référence (Douala)
      const refLng = 9.7679; // Longitude de référence (Douala)
      
      // Facteurs d'échelle approximatifs
      const scaleX = 0.00001; // Facteur pour X vers longitude
      const scaleY = 0.000009; // Facteur pour Y vers latitude
      
      const lat = refLat + (y - refY) * scaleY;
      const lng = refLng + (x - refX) * scaleX;
      
      // Vérifier si les coordonnées sont plausibles pour le Cameroun
      if (lat < 1.5 || lat > 13.5 || lng < 8.0 || lng > 17.0) {
        return null;
      }
      
      return [lat, lng];
    } catch (error) {
      console.error(`Erreur lors de la conversion simple: x=${x}, y=${y}`, error);
      return null;
    }
  };

  // Fonction principale de conversion avec fallback
  const convertCoordinates = (x: number, y: number): [number, number] | null => {
    // Essayer d'abord la conversion améliorée
    let result = convertUTMToLatLng(x, y);
    
    // Si ça échoue, essayer la conversion simple
    if (!result) {
      result = convertUTMToLatLngSimple(x, y);
    }
    
    return result;
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

    let stats = {
      totalFeatures: 0,
      validCoordinates: 0,
      invalidCoordinates: 0
    };

    // Initialiser la carte
    mapRef.current = L.map(mapContainerRef.current, {
      center: [4.0511, 9.7679], // Centre sur Douala
      zoom: 11,
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
            .on('click', () => setSelectedFeature(feature));
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
            .on('click', () => setSelectedFeature(feature));
          
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
            .on('click', () => setSelectedFeature(feature));

          supportsLayer.addLayer(marker);
        } else {
          stats.invalidCoordinates++;
          console.warn(`Impossible de convertir les coordonnées du support: ${feature.properties.ID_Support}`, coordsArray);
        }
      }
    });

    // Mettre à jour les statistiques
    setConversionStats(stats);

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

    // Ajuster la vue pour montrer tous les éléments valides
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

    if (hasValidBounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

    console.log('Statistiques de conversion:', stats);

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

        <div style={{ fontSize: '10px', color: '#999', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '5px' }}>
          <div>Total: {conversionStats.totalFeatures} éléments</div>
          <div style={{ color: '#28a745' }}>Affichés: {conversionStats.validCoordinates}</div>
          <div style={{ color: '#dc3545' }}>Non affichés: {conversionStats.invalidCoordinates}</div>
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