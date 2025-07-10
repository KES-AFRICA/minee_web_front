// src/store/utils/connectionUtils.ts
import L, { LatLng } from "leaflet";
import type { Actif, Depart } from "@/types";
import { calculateDistance } from "./calculationUtils";
import { getDepartColor } from "./colorUtils";
import { DepartConnection } from "../types";

/**
 * Calcule les connexions pour un départ spécifique
 */
export const calculateConnectionsForDepart = (
  depart: Depart,
  actifs: Actif[]
): {
  connections: LatLng[][];
  bounds: L.LatLngBounds | null;
  centerPoint: LatLng | null;
  totalLength: number;
  connectionType: "radial" | "linear" | "mesh";
} => {
  const departActifs = depart.actifs
    .map((actifId) => actifs.find((a) => a.id === actifId))
    .filter(Boolean) as Actif[];

  if (departActifs.length <= 1) {
    return {
      connections: [],
      bounds: null,
      centerPoint: null,
      totalLength: 0,
      connectionType: "radial",
    };
  }

  const connections: LatLng[][] = [];
  let totalLength = 0;

  // Créer les points LatLng pour tous les actifs
  const actifPoints = departActifs.map((actif) => ({
    actif,
    point: new LatLng(
      actif.geolocalisation.latitude,
      actif.geolocalisation.longitude
    ),
  }));

  // Trouver le poste d'origine (priorité: POSTE_DISTRIBUTION, puis par ID)
  let posteOrigine = actifPoints.find(
    (ap) =>
      ap.actif.type === "POSTE_DISTRIBUTION" ||
      ap.actif.id === depart.posteOrigine
  );

  if (!posteOrigine) {
    // Si pas de poste d'origine identifié, prendre le transformateur le plus central
    const transformateurs = actifPoints.filter(
      (ap) => ap.actif.type === "TRANSFORMATEUR"
    );
    if (transformateurs.length > 0) {
      // Calculer le point le plus central
      const avgLat =
        actifPoints.reduce((sum, ap) => sum + ap.point.lat, 0) /
        actifPoints.length;
      const avgLng =
        actifPoints.reduce((sum, ap) => sum + ap.point.lng, 0) /
        actifPoints.length;

      posteOrigine = transformateurs.reduce((closest, current) => {
        const closestDist =
          Math.abs(closest.point.lat - avgLat) +
          Math.abs(closest.point.lng - avgLng);
        const currentDist =
          Math.abs(current.point.lat - avgLat) +
          Math.abs(current.point.lng - avgLng);
        return currentDist < closestDist ? current : closest;
      });
    } else {
      posteOrigine = actifPoints[0];
    }
  }

  // Déterminer le type de connexion basé sur la géographie et le type de départ
  let connectionType: "radial" | "linear" | "mesh" = "radial";

  if (depart.typeDepart === "Principal" || depart.typeDepart === "Secondaire") {
    // Pour les départs principaux et secondaires, utiliser une structure linéaire
    connectionType = "linear";
  } else if (departActifs.length > 10) {
    // Pour les gros départs, utiliser une structure en maillage
    connectionType = "mesh";
  }

  // Créer les connexions selon le type
  switch (connectionType) {
    case "linear": // Connecter en chaîne (ligne droite approximative)
    {
      const sortedPoints = actifPoints
        .filter((ap) => ap.actif.id !== posteOrigine.actif.id)
        .sort((a, b) => {
          // Trier par distance au poste d'origine
          const distA = calculateDistance(
            { latitude: a.point.lat, longitude: a.point.lng },
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            }
          );
          const distB = calculateDistance(
            { latitude: b.point.lat, longitude: b.point.lng },
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            }
          );
          return distA - distB;
        });

      // Connecter le poste d'origine au premier point
      if (sortedPoints.length > 0) {
        connections.push([posteOrigine.point, sortedPoints[0].point]);
        totalLength += calculateDistance(
          {
            latitude: posteOrigine.point.lat,
            longitude: posteOrigine.point.lng,
          },
          {
            latitude: sortedPoints[0].point.lat,
            longitude: sortedPoints[0].point.lng,
          }
        );
      }

      // Connecter les points en chaîne
      for (let i = 0; i < sortedPoints.length - 1; i++) {
        connections.push([sortedPoints[i].point, sortedPoints[i + 1].point]);
        totalLength += calculateDistance(
          {
            latitude: sortedPoints[i].point.lat,
            longitude: sortedPoints[i].point.lng,
          },
          {
            latitude: sortedPoints[i + 1].point.lat,
            longitude: sortedPoints[i + 1].point.lng,
          }
        );
      }
      break;
    }

    case "mesh":
      // Connecter chaque actif à ses 2-3 voisins les plus proches
      actifPoints.forEach((sourcePoint) => {
        const otherPoints = actifPoints.filter(
          (ap) => ap.actif.id !== sourcePoint.actif.id
        );
        const nearestNeighbors = otherPoints
          .map((ap) => ({
            point: ap,
            distance: calculateDistance(
              {
                latitude: sourcePoint.point.lat,
                longitude: sourcePoint.point.lng,
              },
              { latitude: ap.point.lat, longitude: ap.point.lng }
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, Math.min(3, otherPoints.length));

        nearestNeighbors.forEach((neighbor) => {
          // Éviter les doublons
          const connectionExists = connections.some(
            (conn) =>
              (conn[0].equals(sourcePoint.point) &&
                conn[1].equals(neighbor.point.point)) ||
              (conn[1].equals(sourcePoint.point) &&
                conn[0].equals(neighbor.point.point))
          );

          if (!connectionExists) {
            connections.push([sourcePoint.point, neighbor.point.point]);
            totalLength += neighbor.distance;
          }
        });
      });
      break;

    default: // radial
      // Connecter tous les actifs au poste d'origine (structure radiale)
      actifPoints.forEach((ap) => {
        if (ap.actif.id !== posteOrigine!.actif.id) {
          connections.push([posteOrigine!.point, ap.point]);
          totalLength += calculateDistance(
            {
              latitude: posteOrigine!.point.lat,
              longitude: posteOrigine!.point.lng,
            },
            { latitude: ap.point.lat, longitude: ap.point.lng }
          );
        }
      });
      break;
  }

  // Calculer les bounds et le centre
  const lats = actifPoints.map((ap) => ap.point.lat);
  const lngs = actifPoints.map((ap) => ap.point.lng);

  const bounds = new L.LatLngBounds([
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)],
  ]);

  const centerPoint = bounds.getCenter();

  return {
    connections,
    bounds,
    centerPoint,
    totalLength,
    connectionType,
  };
};

/**
 * Calcule les connexions pour tous les départs
 */
export const calculateAllDepartConnections = (
  departs: Depart[],
  actifs: Actif[]
): DepartConnection[] => {
  return departs.map((depart) => {
    const connectionData = calculateConnectionsForDepart(depart, actifs);

    return {
      depart,
      actifs: depart.actifs
        .map((actifId) => actifs.find((a) => a.id === actifId))
        .filter(Boolean) as Actif[],
      connections: connectionData.connections,
      color: getDepartColor(depart.typeDepart, depart.id),
      isVisible: true,
      bounds: connectionData.bounds,
      centerPoint: connectionData.centerPoint,
      totalLength: connectionData.totalLength,
      connectionType: connectionData.connectionType,
    };
  });
};
