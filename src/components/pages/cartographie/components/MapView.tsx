/* eslint-disable @typescript-eslint/no-explicit-any */
/* AFFICHAGE AMÉLIORÉ DES ACTIFS AVEC ICÔNES PERSONNALISÉES */
import React, { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useMapStore } from "@/store/mapStore.ts";
import type { Actif } from "@/types";

// ==================== CONSTANTES ====================
const DEPART_COLORS = [
  "#e74c3c", "#3498db", "#f39c12", "#9b59b6", "#27ae60",
  "#e67e22", "#34495e", "#16a085", "#c0392b", "#8e44ad",
  "#2ecc71", "#f1c40f", "#e91e63", "#9c27b0", "#673ab7",
  "#3f51b5", "#2196f3", "#00bcd4", "#009688", "#4caf50"
];

// Types d'actifs avec leurs icônes et couleurs
const ACTIF_TYPES = [
  {
    value: "LIGNE_AERIENNE",
    label: "Ligne Aérienne",
    icon: "⚡",
    color: "blue",
  },
  {
    value: "LIGNE_SOUTERRAINE",
    label: "Ligne Souterraine",
    icon: "🔌",
    color: "purple",
  },
  {
    value: "TRANSFORMATEUR",
    label: "Transformateur",
    icon: "⚙️",
    color: "red",
  },
  {
    value: "POSTE_DISTRIBUTION",
    label: "Poste Distribution",
    icon: "🏢",
    color: "green",
  },
  {
    value: "SUPPORT",
    label: "Support",
    icon: "📡",
    color: "orange",
  },
  {
    value: "OCR",
    label: "OCR",
    icon: "🔄",
    color: "darkred",
  },
  {
    value: "TABLEAU_BT",
    label: "Tableau BT",
    icon: "📋",
    color: "indigo",
  },
  {
    value: "CELLULE_DISTRIBUTION_SECONDAIRE",
    label: "Cellule Distribution Secondaire",
    icon: "🔗",
    color: "teal",
  },
  {
    value: "CELLULE_DISTRIBUTION_PRIMAIRE",
    label: "Cellule Distribution Primaire",
    icon: "🔗",
    color: "cyan",
  },
  {
    value: "POINT_LIVRAISON",
    label: "Point Livraison",
    icon: "📍",
    color: "pink",
  },
  {
    value: "EQUIPEMENT_STOCK",
    label: "Équipement Stock",
    icon: "📦",
    color: "amber",
  },
];

// ==================== UTILITAIRES ====================
const createActifIcon = (actif: Actif, color: string): L.DivIcon => {
  // Trouver le type d'actif correspondant
  const actifType = ACTIF_TYPES.find(type => type.value === actif.type) || ACTIF_TYPES[0];
  
  return L.divIcon({
    html: `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: white;
        position: relative;
      ">
        <span style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        ">${actifType.icon}</span>
      </div>
    `,
    className: 'actif-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// ==================== COMPOSANT GESTIONNAIRE ====================
const ActifsManager: React.FC = () => {
  const map = useMap();
  const { 
    filteredActifs, 
    departs,
    setSelectedActifs,
  } = useMapStore();

  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const linesRef = useRef<L.LayerGroup>(new L.LayerGroup());

  // Créer un mapping départ -> couleur
  const departColorMap = useRef<Map<string, string>>(new Map());

  // Initialiser les couleurs des départs
  useEffect(() => {
    departs.forEach((depart, index) => {
      if (!departColorMap.current.has(depart.id)) {
        departColorMap.current.set(depart.id, DEPART_COLORS[index % DEPART_COLORS.length]);
      }
    });
  }, [departs]);

  // Fonction pour trouver le départ d'un actif
  const findActifDepart = useCallback((actif: Actif) => {
    return departs.find(depart => {
      // Vérifier si l'actif est directement dans la liste des actifs du départ
      if (depart.actifs.includes(actif.id)) {
        return true;
      }
      
      // Vérifier si l'actif est dans les zones géographiques du départ
      const isInZone = depart.zonesGeographiques.quartiers.includes(actif.quartier) &&
                      depart.zonesGeographiques.communes.includes(actif.commune);
      
      return isInZone;
    });
  }, [departs]);

  // Grouper les actifs par départ
  const groupActifsByDepart = useCallback(() => {
    const groupedActifs = new Map<string, Actif[]>();
    
    filteredActifs.forEach(actif => {
      const depart = findActifDepart(actif);
      if (depart) {
        if (!groupedActifs.has(depart.id)) {
          groupedActifs.set(depart.id, []);
        }
        groupedActifs.get(depart.id)!.push(actif);
      }
    });
    
    return groupedActifs;
  }, [filteredActifs, findActifDepart]);

  // Rendu des marqueurs et lignes
  const renderActifsAndLines = useCallback(() => {
    // Nettoyer les layers existants
    markersRef.current.clearLayers();
    linesRef.current.clearLayers();

    const groupedActifs = groupActifsByDepart();

    groupedActifs.forEach((actifs, departId) => {
      const color = departColorMap.current.get(departId) || DEPART_COLORS[0];
      const depart = departs.find(d => d.id === departId);

      // Créer les marqueurs pour chaque actif
      actifs.forEach(actif => {
        const marker = L.marker(
          [actif.geolocalisation.latitude, actif.geolocalisation.longitude],
          {
            icon: createActifIcon(actif, color),
          }
        );

        // Trouver le type d'actif pour l'affichage
        const actifType = ACTIF_TYPES.find(type => type.value === actif.type) || 
                          { label: actif.type, icon: "❓", color: "gray" };

        // Popup avec informations de l'actif
        const popupContent = `
          <div class="actif-popup">
            <h3>${actifType.icon} ${actifType.label}</h3>
            <p><strong>Désignation:</strong> ${actif.designationGenerale}</p>
            <p><strong>Départ:</strong> ${depart?.id || 'Non assigné'}</p>
            <p><strong>Région:</strong> ${actif.region}</p>
            <p><strong>Commune:</strong> ${actif.commune}</p>
            <p><strong>Quartier:</strong> ${actif.quartier}</p>
            <p><strong>État:</strong> ${actif.etatVisuel}</p>
            <p><strong>Année:</strong> ${actif.anneeMiseEnService}</p>
            <p><strong>Valorisation:</strong> ${actif.valorisation.toLocaleString()} €</p>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Gestionnaire de clic
        marker.on('click', (e) => {
          e.originalEvent.stopPropagation();
          setSelectedActifs([actif]);
        });

        markersRef.current.addLayer(marker);
      });

      // Créer les lignes entre les actifs du même départ
      if (actifs.length > 1) {
        // Trier les actifs par distance pour créer un chemin optimisé
        const sortedActifs = [...actifs];
        const path: Actif[] = [sortedActifs[0]];
        sortedActifs.splice(0, 1);

        // Algorithme du plus proche voisin pour optimiser le tracé
        while (sortedActifs.length > 0) {
          const lastActif = path[path.length - 1];
          let closestIndex = 0;
          let minDistance = Infinity;

          sortedActifs.forEach((actif, index) => {
            const distance = Math.sqrt(
              Math.pow(actif.geolocalisation.latitude - lastActif.geolocalisation.latitude, 2) +
              Math.pow(actif.geolocalisation.longitude - lastActif.geolocalisation.longitude, 2)
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });

          path.push(sortedActifs[closestIndex]);
          sortedActifs.splice(closestIndex, 1);
        }

        // Créer les lignes entre les actifs consécutifs
        for (let i = 0; i < path.length - 1; i++) {
          const currentActif = path[i];
          const nextActif = path[i + 1];

          // Récupérer les types d'actifs pour l'affichage
          const currentType = ACTIF_TYPES.find(type => type.value === currentActif.type) || 
                             { label: currentActif.type, icon: "❓" };
          const nextType = ACTIF_TYPES.find(type => type.value === nextActif.type) || 
                          { label: nextActif.type, icon: "❓" };

          const polyline = L.polyline(
            [
              [currentActif.geolocalisation.latitude, currentActif.geolocalisation.longitude],
              [nextActif.geolocalisation.latitude, nextActif.geolocalisation.longitude],
            ],
            {
              color: color,
              weight: 3,
              opacity: 0.8,
              dashArray: '10, 10', // Ligne pointillée pour mieux distinguer
            }
          );

          // Popup pour la ligne
          polyline.bindPopup(`
            <div class="line-popup">
              <h3>Connexion Départ</h3>
              <p><strong>Départ:</strong> ${depart?.id || 'Non assigné'}</p>
              <p><strong>De:</strong> ${currentType.icon} ${currentActif.designationGenerale}</p>
              <p><strong>Vers:</strong> ${nextType.icon} ${nextActif.designationGenerale}</p>
            </div>
          `);

          linesRef.current.addLayer(polyline);
        }
      }
    });

    // Ajouter les layers à la carte
    if (!map.hasLayer(linesRef.current)) {
      map.addLayer(linesRef.current);
    }
    if (!map.hasLayer(markersRef.current)) {
      map.addLayer(markersRef.current);
    }
  }, [groupActifsByDepart, departs, map, setSelectedActifs]);

  // Effet pour re-rendre quand les données changent
  useEffect(() => {
    renderActifsAndLines();
  }, [renderActifsAndLines]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (map.hasLayer(markersRef.current)) {
        map.removeLayer(markersRef.current);
      }
      if (map.hasLayer(linesRef.current)) {
        map.removeLayer(linesRef.current);
      }
    };
  }, [map]);

  return null;
};

// ==================== LÉGENDE DE LA CARTE ====================
const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-5 right-5 bg-white p-3 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
      <h3 className="font-bold mb-2 text-sm">Types d'Actifs</h3>
      <div className="grid grid-cols-1 gap-1">
        {ACTIF_TYPES.map((type) => (
          <div key={type.value} className="flex items-center text-xs">
            <span className="mr-2">{type.icon}</span>
            <span style={{ color: type.color }}>{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL ====================
const MapView: React.FC = () => {
  const { setMapBounds } = useMapStore();

  const handleMapReady = useCallback((mapInstance: L.Map) => {
    // Configuration initiale de la carte
    mapInstance.on('moveend', () => {
      setMapBounds(mapInstance.getBounds());
    });
  }, [setMapBounds]);

  return (
    <div className="flex-1 z-1 relative">
      <MapContainer
        center={[7.3697, 12.3547]}
        zoom={7}
        className="w-full h-full z-1"
        zoomControl={false}
        preferCanvas={true}
        //whenCreated={handleMapReady} // Remplace whenReady qui est déprécié
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenZooming={false}
          updateWhenIdle={true}
          zIndex={5}
        />
        <ActifsManager />
      </MapContainer>
      <MapLegend />
    </div>
  );
};

export default MapView;