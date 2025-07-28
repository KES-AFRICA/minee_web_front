/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { useAppStore } from '../stores/appStore';

const SelectionTools: React.FC = () => {
  const map = useMap();
  const { showSelectionTools, setSelectionArea } = useAppStore();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);


  useEffect(() => {
    if (!map) return;

    // Créer le groupe pour les éléments dessinés
    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup();
      map.addLayer(drawnItemsRef.current);
    }

    if (showSelectionTools && !drawControlRef.current) {
      // Configuration des outils de dessin
      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Erreur:</strong> Les lignes ne peuvent pas se croiser!'
            },
            shapeOptions: {
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.2,
              weight: 2
            }
          },
          rectangle: {
            shapeOptions: {
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.2,
              weight: 2
            }
          },
          circle: {
            shapeOptions: {
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.2,
              weight: 2
            }
          },
          polyline: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItemsRef.current,
          remove: true
        }
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      // Gestionnaire pour la création de formes
      map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        const type = event.layerType;

        // Effacer les sélections précédentes
        drawnItemsRef.current?.clearLayers();
        
        // Ajouter la nouvelle forme
        drawnItemsRef.current?.addLayer(layer);

        // Convertir en format de sélection
        let selectionArea;
        
        if (type === 'rectangle') {
          const bounds = layer.getBounds();
          selectionArea = {
            type: 'rectangle' as const,
            bounds: [
              [bounds.getSouth(),
              bounds.getWest(),],[
              bounds.getNorth(),
              bounds.getEast()]
            ] as [number[], number[]]
          };
        } else if (type === 'circle') {
          const center = layer.getLatLng();
          const radius = layer.getRadius() / 111000; // Conversion mètres vers degrés approximative
          selectionArea = {
            type: 'circle' as const,
            center: [center.lat, center.lng] as [number, number],
            radius: radius
          };
        } else if (type === 'polygon') {
          const latlngs = layer.getLatLngs()[0];
          selectionArea = {
            type: 'polygon' as const,
            points: latlngs.map((latlng: L.LatLng) => [latlng.lat, latlng.lng] as [number, number])
          };
        }

        if (selectionArea) {
          setSelectionArea(selectionArea);
        }
      });

      // Gestionnaire pour la suppression de formes
      map.on(L.Draw.Event.DELETED, () => {
        setSelectionArea(null);
      });

      // Gestionnaire pour l'édition de formes
      map.on(L.Draw.Event.EDITED, (event: any) => {
        const layers = event.layers;
        layers.eachLayer((layer: any) => {
          // Mettre à jour la sélection après édition
          const bounds = layer.getBounds ? layer.getBounds() : null;
          if (bounds) {
            const selectionArea = {
              type: 'rectangle' as const,
              bounds: [
                [bounds.getSouth(),
                bounds.getWest(),], [
                  bounds.getNorth(),
                  bounds.getEast()]
              ] as [number[], number[]]
            };
            setSelectionArea(selectionArea);
          }
        });
      });
    }

    // Nettoyer les contrôles quand les outils sont cachés
    if (!showSelectionTools && drawControlRef.current) {
      map.removeControl(drawControlRef.current);
      drawControlRef.current = null;
      drawnItemsRef.current?.clearLayers();
      setSelectionArea(null);
    }

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      if (drawnItemsRef.current) {
        map.removeLayer(drawnItemsRef.current);
        drawnItemsRef.current = null;
      }
    };
  }, [map, showSelectionTools, setSelectionArea]);

  return null;
};

export default SelectionTools;