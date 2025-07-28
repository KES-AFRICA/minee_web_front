import { type GeoJSONFeature, type LineProperties, type PostProperties, type SupportProperties } from '@/data/sup';
import L from 'leaflet';


// Fonction améliorée pour convertir les coordonnées UTM en LatLng
  export const convertUTMToLatLng = (x: number, y: number): [number, number] | null => {
    // Vérifier si les coordonnées sont dans une plage valide pour l'UTM Zone 32N (Cameroun)
    if (x < 300000 || x > 800000 || y < 300000 || y > 800000) {
      console.warn(`Coordonnées UTM hors plage valide: x=${x}, y=${y}`);
      return null;
    }

    try {
      // Conversion améliorée pour UTM Zone 32N
      // Paramètres pour la zone UTM 32N (Cameroun)
      const zone = 32;
      
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
export const convertUTMToLatLngSimple = (x: number, y: number): [number, number] | null => {
  try {
    // Validation des entrées
    if (!isFinite(x) || !isFinite(y)) {
      console.warn(`Coordonnées invalides: x=${x}, y=${y}`);
      return null;
    }

    // Conversion simple basée sur les coordonnées observées dans vos données
    // Zone UTM 32N pour le Cameroun (région de Douala/Yaoundé)

    // Point de référence pour Douala
    const refX = 584000; // Coordonnée X de référence (easting)
    const refY = 451000; // Coordonnée Y de référence (northing)
    const refLat = 4.0511; // Latitude de référence (Douala)
    const refLng = 9.7679; // Longitude de référence (Douala)

    // Facteurs d'échelle approximatifs pour la zone UTM 32N
    // Ces valeurs peuvent nécessiter un ajustement selon vos données réelles
    const scaleX = 0.00000899; // Facteur pour X vers longitude (~111 km par degré)
    const scaleY = 0.00000899; // Facteur pour Y vers latitude (~111 km par degré)

    // Calcul des coordonnées géographiques
    const lat = refLat + (y - refY) * scaleY;
    const lng = refLng + (x - refX) * scaleX;

    // Vérification des limites géographiques du Cameroun
    // Cameroun: Lat 1.65° à 13.08°N, Lng 8.49° à 16.19°E
    if (lat < 1.0 || lat > 13.5 || lng < 8.0 || lng > 17.0) {
      console.warn(`Coordonnées hors limites Cameroun: lat=${lat.toFixed(6)}, lng=${lng.toFixed(6)}`);
      return null;
    }

    // Arrondir à 6 décimales pour la précision GPS
    return [
      Math.round(lat * 1000000) / 1000000,
      Math.round(lng * 1000000) / 1000000
    ];

  } catch (error) {
    console.error(`Erreur lors de la conversion UTM: x=${x}, y=${y}`, error);
    return null;
  }
};

// Fonction utilitaire pour tester la conversion
export const testUTMConversion = () => {
  const testPoints = [
    { x: 584000, y: 451000, expected: "Douala" },
    { x: 590000, y: 430000, expected: "Sud de Douala" },
    { x: 578000, y: 460000, expected: "Nord-Ouest de Douala" }
  ];

  console.log("Test de conversion UTM vers Lat/Lng:");
  testPoints.forEach(point => {
    const result = convertUTMToLatLngSimple(point.x, point.y);
    if (result) {
      console.log(`${point.expected}: UTM(${point.x}, ${point.y}) → Lat/Lng(${result[0]}, ${result[1]})`);
    } else {
      console.log(`${point.expected}: Conversion échouée pour UTM(${point.x}, ${point.y})`);
    }
  });
};


  // Fonction principale de conversion avec fallback
 export const convertCoordinates = (x: number, y: number): [number, number] | null => {
    // Essayer d'abord la conversion améliorée
   const result = convertUTMToLatLngSimple(x, y);
    
    // Si ça échoue, essayer la conversion simple
    //if (!result) {
    //  result = convertUTMToLatLngSimple(x, y);
    //}
    
    return result;
  };

  // Styles pour les différents types d'éléments
 export const getLineStyle = (feature: GeoJSONFeature<LineProperties>) => {
    const type = feature.properties.TYPE;
    return {
      color: type === 'Aerien' ? '#ff6b6b' : '#4ecdc4',
      weight: 3,
      opacity: 0.8,
      dashArray: type === 'Souterrain' ? '5, 5' : undefined
    };
  };

 export const getPostIcon = (feature: GeoJSONFeature<PostProperties>) => {
    const typePost = feature.properties.Type_Post;
    const color = typePost === 'H59' ? '#ff9f43' : '#0fbcf9';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-post-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

 export const getSupportIcon = (feature: GeoJSONFeature<SupportProperties>) => {
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
  export const createPopup = (feature: GeoJSONFeature, type: string) => {
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