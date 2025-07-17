import type { GeoJSONData, GeoJSONFeature, SupportProperties } from "@/data/sup";
import { convertCoordinates, createPopup, getLineStyle, getPostIcon, getSupportIcon } from "./utils";
import L from "leaflet";
import { useSelectionActions } from "@/store/map_store";



// Fonction pour ajouter les lignes MT
export function addMTLines(mtData: any, mtLayer: L.LayerGroup, stats: any, addToSelection: (arg0: GeoJSONFeature<any>) => void) {

  mtData.features.forEach((feature: GeoJSONFeature<any>) => {
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
  
  return mtLayer;
}

// Function to add posts to a layer
    export const addPostesToLayer = (
      postData: { features: GeoJSONFeature[] }, 
      layer: L.LayerGroup, 
      stats: { totalFeatures: number, validCoordinates: number, invalidCoordinates: number }
    , addToSelection: (feature: GeoJSONFeature<any>) => void
    ) => {

      postData.features.forEach(feature => {
      stats.totalFeatures++;
      
      if (feature.geometry.type === 'Point') {
        const coordsArray = feature.geometry.coordinates as number[];
        const coords = convertCoordinates(coordsArray[0], coordsArray[1]);
        
        if (coords) {
        stats.validCoordinates++;
        const marker = L.marker(coords, { icon: getPostIcon(feature) })
          .bindPopup(createPopup(feature, 'Poste'))
          .on('click', () => addToSelection(feature));
        
        layer.addLayer(marker);
        } else {
        stats.invalidCoordinates++;
        console.warn(`Impossible de convertir les coordonnées du poste: ${feature.properties.NOM}`, coordsArray);
        }
      }
      });
    };

    // Fonction pour ajouter les supports à une couche
    export const addSupportsToLayer = (data: GeoJSONData, layer: L.LayerGroup, stats: any, addToSelection: (feature: GeoJSONFeature<any>) => void) => {
      data.features.forEach(feature => {
        stats.totalFeatures++;
        
        if (feature.geometry.type === 'Point') {
          const coordsArray = feature.geometry.coordinates as number[];
          const coords = convertCoordinates(coordsArray[0], coordsArray[1]);
    
          if (coords) {
            stats.validCoordinates++;
            const marker = L.marker(coords, { icon: getSupportIcon(feature) })
              .bindPopup(createPopup(feature, 'Support'))
              .on('click', () => addToSelection(feature));
    
            layer.addLayer(marker);
          } else {
            stats.invalidCoordinates++;
            console.warn(`Impossible de convertir les coordonnées du support: ${feature.properties.ID_Support}`, coordsArray);
          }
        }
      });
    };