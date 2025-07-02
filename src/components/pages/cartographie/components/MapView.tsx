/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { useMapStore } from "@/store/mapStore.ts";
import type { Actif } from "@/types";
import L from "leaflet";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Enhanced custom icons for different asset types
const createCustomIcon = (
  type: string,
  color: string,
  isSelected: boolean = false
) => {
  const size = isSelected ? 32 : 26;
  const borderWidth = isSelected ? 4 : 2;
  const shadowSize = isSelected ? 8 : 4;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${adjustBrightness(
      color,
      -20
    )} 100%);
        width: ${size - 4}px;
        height: ${size - 4}px;
        border-radius: ${
          type === "SUPPORT" ? "15%" : type.includes("LIGNE") ? "0%" : "50%"
        };
        border: ${borderWidth}px solid ${isSelected ? "#F59E0B" : "white"};
        box-shadow: 0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,${
      isSelected ? "0.5" : "0.3"
    }), 
                    inset 0 1px 0 rgba(255,255,255,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? "14px" : "11px"};
        font-weight: bold;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        transform: ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      ">
        ${getTypeSymbol(type)}
        ${
          isSelected
            ? `<div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #F59E0B;
          border-radius: 50%;
          border: 1px solid white;
        "></div>`
            : ""
        }
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Helper function to adjust color brightness
const adjustBrightness = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const getTypeSymbol = (type: string): string => {
  const symbols = {
    LIGNE_AERIENNE: "⚡",
    LIGNE_SOUTERRAINE: "🔌",
    TRANSFORMATEUR: "⚙️",
    POSTE_DISTRIBUTION: "🏢",
    SUPPORT: "📡",
    OCR: "🔄",
    TABLEAU_BT: "📊",
    CELLULE_DISTRIBUTION_SECONDAIRE: "🔲",
    CELLULE_DISTRIBUTION_PRIMAIRE: "🔳",
    POINT_LIVRAISON: "📍",
    EQUIPEMENT_STOCK: "📦",
  };
  return symbols[type as keyof typeof symbols] || "❓";
};

const getTypeColor = (type: string): string => {
  const colors = {
    LIGNE_AERIENNE: "#3B82F6",
    LIGNE_SOUTERRAINE: "#8B5CF6",
    TRANSFORMATEUR: "#EF4444",
    POSTE_DISTRIBUTION: "#10B981",
    SUPPORT: "#F97316",
    OCR: "#DC2626",
    TABLEAU_BT: "#6366F1",
    CELLULE_DISTRIBUTION_SECONDAIRE: "#EC4899",
    CELLULE_DISTRIBUTION_PRIMAIRE: "#BE185D",
    POINT_LIVRAISON: "#0891B2",
    EQUIPEMENT_STOCK: "#6B7280",
  };
  return colors[type as keyof typeof colors] || "#6B7280";
};

// Map events handler component
const MapEventsHandler: React.FC = () => {
  const map = useMap();
  const { setMapBounds, mapBounds } = useMapStore();

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const newBounds = map.getBounds();
      if (!mapBounds || !newBounds.equals(mapBounds)) {
        setMapBounds(newBounds);
      }
    };

    map.on("moveend", handleMoveEnd);
    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, setMapBounds, mapBounds]);

  return null;
};

// Enhanced drawing control component
const DrawingControls: React.FC = () => {
  const map = useMap();
  const { isDrawingMode, setSelectedActifs, filteredActifs, setDrawingMode } =
    useMapStore();
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const currentDrawingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!map) return;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: "#e1e100",
            message:
              "<strong>Erreur:</strong> Les lignes ne peuvent pas se croiser!",
          },
          shapeOptions: {
            color: "#3B82F6",
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2,
            dashArray: "5, 5",
          },
        },
        rectangle: {
          showArea: true,
          shapeOptions: {
            color: "#10B981",
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2,
          },
        },
        circle: {
          showRadius: true,
          shapeOptions: {
            color: "#F59E0B",
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.2,
          },
        },
        marker: false,
        circlemarker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
        edit: {},
      },
    });

    if (isDrawingMode && isDrawingMode !== "pan") {
      if (!drawControlRef.current) {
        map.addControl(drawControl);
        drawControlRef.current = drawControl;
      }

      if (currentDrawingRef.current !== isDrawingMode) {
        currentDrawingRef.current = isDrawingMode;
        map.fire(L.Draw.Event.DRAWSTOP);

        setTimeout(() => {
          switch (isDrawingMode) {
            case "rectangle":
              new L.Draw.Rectangle(
                map as any,
                drawControl.options.draw.rectangle
              ).enable();
              break;
            case "circle":
              new L.Draw.Circle(
                map as any,
                drawControl.options.draw.circle
              ).enable();
              break;
            case "polygon":
              new L.Draw.Polygon(
                map as any,
                drawControl.options.draw.polygon
              ).enable();
              break;
          }
        }, 100);
      }
    } else {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      currentDrawingRef.current = null;
    }

    const handleCreated = (event: any) => {
      const layer = event.layer;
      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const selectedActifs: Actif[] = [];

      filteredActifs.forEach((actif) => {
        const point = L.latLng(
          actif.geolocalisation.latitude,
          actif.geolocalisation.longitude
        );
        let isInside = false;

        if (layer instanceof L.Circle) {
          isInside = layer.getLatLng().distanceTo(point) <= layer.getRadius();
        } else if (layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs()[0] as L.LatLng[];
          isInside = isPointInPolygon(point, latlngs);
        } else if (layer instanceof L.Rectangle) {
          isInside = layer.getBounds().contains(point);
        }

        if (isInside) {
          selectedActifs.push(actif);
        }
      });

      setSelectedActifs(selectedActifs);

      if (selectedActifs.length > 0) {
        showSelectionNotification(selectedActifs.length);
      }

      setDrawingMode("pan");
    };

    const handleDeleted = () => {
      setSelectedActifs([]);
    };

    const handleEdited = (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        handleCreated({ layer });
      });
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.DELETED, handleDeleted);
    map.on(L.Draw.Event.EDITED, handleEdited);

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
      }
      map.removeLayer(drawnItems);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.off(L.Draw.Event.EDITED, handleEdited);
    };
  }, [map, isDrawingMode, filteredActifs, setSelectedActifs, setDrawingMode]);

  return null;
};

// Helper function for point-in-polygon test
const isPointInPolygon = (point: L.LatLng, polygon: L.LatLng[]): boolean => {
  const x = point.lat;
  const y = point.lng;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
};

// Helper function to show selection notification
const showSelectionNotification = (count: number) => {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-20 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 transition-all transform translate-x-full opacity-0";
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      <span class="font-medium">${count} actif${
    count > 1 ? "s" : ""
  } sélectionné${count > 1 ? "s" : ""}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
  }, 100);

  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Enhanced Depart Connections Component
const DepartConnections: React.FC = () => {
  const {
    showDepartConnections,
    departConnections,
    selectedDepart,
    showDepartLabels,
  } = useMapStore();

  if (!showDepartConnections) return null;

  return (
    <>
      {departConnections
        .filter((conn) => conn.isVisible)
        .map(({ depart, connections, color, actifs }) => {
          const isSelected = selectedDepart === depart.id;
          const opacity = isSelected ? 1 : selectedDepart ? 0.3 : 0.7;

          return (
            <LayerGroup key={depart.id}>
              {/* Connexions entre actifs */}
              {connections.map((connection, index) => (
                <Polyline
                  key={`${depart.id}-${index}`}
                  positions={connection}
                  pathOptions={{
                    color: color,
                    weight: isSelected ? 4 : 3,
                    opacity: opacity,
                    dashArray:
                      depart.typeDepart === "Secondaire" ? "5, 5" : undefined,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center mb-2">
                        <div
                          className="w-4 h-4 rounded mr-2"
                          style={{ backgroundColor: color }}
                        ></div>
                        <h3 className="font-semibold text-sm">{depart.nom}</h3>
                      </div>
                      <div className="space-y-1 text-xs">
                        <p>
                          <span className="font-medium">Type:</span>{" "}
                          {depart.typeDepart}
                        </p>
                        <p>
                          <span className="font-medium">Tension:</span>{" "}
                          {depart.tension.toLocaleString()}V
                        </p>
                        <p>
                          <span className="font-medium">Longueur:</span>{" "}
                          {depart.longueurTotale}km
                        </p>
                        <p>
                          <span className="font-medium">État:</span>{" "}
                          {depart.etatGeneral}
                        </p>
                        <p>
                          <span className="font-medium">Actifs:</span>{" "}
                          {actifs.length}
                        </p>
                        <p>
                          <span className="font-medium">Zones:</span>{" "}
                          {depart.zonesGeographiques.communes.join(", ")}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              ))}

              {/* Labels des départs */}
              {showDepartLabels && actifs.length > 0 && (
                <Marker
                  position={[
                    actifs.reduce(
                      (sum, a) => sum + a.geolocalisation.latitude,
                      0
                    ) / actifs.length,
                    actifs.reduce(
                      (sum, a) => sum + a.geolocalisation.longitude,
                      0
                    ) / actifs.length,
                  ]}
                  icon={L.divIcon({
                    className: "depart-label",
                    html: `
                      <div style="
                        background: ${color};
                        color: white;
                        padding: 4px 8px;
                        border-radius: 12px;
                        font-size: 10px;
                        font-weight: bold;
                        text-align: center;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        opacity: ${opacity};
                        transform: ${isSelected ? "scale(1.1)" : "scale(1)"};
                        transition: all 0.3s ease;
                      ">
                        ${depart.nom}
                      </div>
                    `,
                    iconSize: [80, 20],
                    iconAnchor: [40, 10],
                  })}
                />
              )}
            </LayerGroup>
          );
        })}
    </>
  );
};

// Enhanced electrical lines component
const ElectricalLines: React.FC = () => {
  const { filteredActifs, showDepartConnections } = useMapStore();

  // Don't show electrical lines if depart connections are enabled
  if (showDepartConnections) return null;

  // Generate lines between related electrical assets
  const generateLines = () => {
    const lines: Array<{
      positions: [number, number][];
      type: string;
      color: string;
      weight: number;
      dashArray?: string;
    }> = [];

    // Group assets by region and type to create logical connections
    const postes = filteredActifs.filter(
      (a) => a.type === "POSTE_DISTRIBUTION"
    );
    const transformateurs = filteredActifs.filter(
      (a) => a.type === "TRANSFORMATEUR"
    );
    const supports = filteredActifs.filter((a) => a.type === "SUPPORT");
    const lignesSouterraines = filteredActifs.filter(
      (a) => a.type === "LIGNE_SOUTERRAINE"
    );

    // Connect postes to nearby transformateurs (MT lines)
    postes.forEach((poste) => {
      const nearbyTransformateurs = transformateurs.filter(
        (t) =>
          getDistance(poste.geolocalisation, t.geolocalisation) < 0.05 && // ~5km radius
          t.region === poste.region
      );

      nearbyTransformateurs.forEach((transformateur) => {
        lines.push({
          positions: [
            [poste.geolocalisation.latitude, poste.geolocalisation.longitude],
            [
              transformateur.geolocalisation.latitude,
              transformateur.geolocalisation.longitude,
            ],
          ],
          type: "MT",
          color: "#DC2626",
          weight: 4,
        });
      });
    });

    // Connect transformateurs to nearby supports (BT lines)
    transformateurs.forEach((transformateur) => {
      const nearbySupports = supports
        .filter(
          (s) =>
            getDistance(transformateur.geolocalisation, s.geolocalisation) <
              0.02 && // ~2km radius
            s.region === transformateur.region
        )
        .slice(0, 3); // Limit to 3 connections per transformer

      nearbySupports.forEach((support) => {
        lines.push({
          positions: [
            [
              transformateur.geolocalisation.latitude,
              transformateur.geolocalisation.longitude,
            ],
            [
              support.geolocalisation.latitude,
              support.geolocalisation.longitude,
            ],
          ],
          type: "BT",
          color: "#3B82F6",
          weight: 2,
        });
      });
    });

    // Create aerial lines between supports
    supports.forEach((support) => {
      const nearbySupports = supports
        .filter(
          (s) =>
            s.id !== support.id &&
            getDistance(support.geolocalisation, s.geolocalisation) < 0.01 && // ~1km radius
            s.region === support.region
        )
        .slice(0, 2); // Limit connections

      nearbySupports.forEach((nearbySupport) => {
        lines.push({
          positions: [
            [
              support.geolocalisation.latitude,
              support.geolocalisation.longitude,
            ],
            [
              nearbySupport.geolocalisation.latitude,
              nearbySupport.geolocalisation.longitude,
            ],
          ],
          type: "AERIENNE",
          color: "#10B981",
          weight: 2,
        });
      });
    });

    // Create underground lines (dashed)
    lignesSouterraines.forEach((ligne) => {
      const nearbyAssets = [...transformateurs, ...supports]
        .filter(
          (a) =>
            getDistance(ligne.geolocalisation, a.geolocalisation) < 0.015 &&
            a.region === ligne.region
        )
        .slice(0, 2);

      nearbyAssets.forEach((asset) => {
        lines.push({
          positions: [
            [ligne.geolocalisation.latitude, ligne.geolocalisation.longitude],
            [asset.geolocalisation.latitude, asset.geolocalisation.longitude],
          ],
          type: "SOUTERRAINE",
          color: "#8B5CF6",
          weight: 3,
          dashArray: "10, 5",
        });
      });
    });

    return lines;
  };

  const lines = generateLines();

  return (
    <>
      {lines.map((line, index) => (
        <Polyline
          key={`line-${index}`}
          positions={line.positions}
          pathOptions={{
            color: line.color,
            weight: line.weight,
            opacity: 0.7,
            dashArray: line.dashArray,
            lineCap: "round",
            lineJoin: "round",
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>Ligne {line.type}</strong>
              <br />
              Type:{" "}
              {line.type === "MT"
                ? "Moyenne Tension"
                : line.type === "BT"
                ? "Basse Tension"
                : line.type === "AERIENNE"
                ? "Ligne Aérienne"
                : "Ligne Souterraine"}
            </div>
          </Popup>
        </Polyline>
      ))}
    </>
  );
};

// Helper function to calculate distance between two points
const getDistance = (
  pos1: { latitude: number; longitude: number },
  pos2: { latitude: number; longitude: number }
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
  const dLon = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((pos1.latitude * Math.PI) / 180) *
      Math.cos((pos2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Enhanced markers component
const ActifMarkers: React.FC = () => {
  const {
    filteredActifs,
    selectedActifs,
    addSelectedActif,
    removeSelectedActif,
    showAllActifs,
    selectedDepart,
    departConnections,
    setSelectedDepart,
  } = useMapStore();

  const handleMarkerClick = (actif: Actif) => {
    const isSelected = selectedActifs.some((a) => a.id === actif.id);
    if (isSelected) {
      removeSelectedActif(actif.id);
    } else {
      addSelectedActif(actif);
    }
  };

  // Filter actifs if showing only specific depart
  const displayedActifs = showAllActifs
    ? filteredActifs
    : selectedDepart
    ? departConnections.find((conn) => conn.depart.id === selectedDepart)
        ?.actifs || []
    : filteredActifs;

  return (
    <LayersControl.Overlay checked={showAllActifs} name="Actifs">
      <LayerGroup>
        {displayedActifs.map((actif) => {
          const isSelected = selectedActifs.some((a) => a.id === actif.id);
          const icon = createCustomIcon(
            actif.type,
            getTypeColor(actif.type),
            isSelected
          );

          // Check if this actif belongs to the selected depart
          const belongsToSelectedDepart = selectedDepart
            ? departConnections
                .find((conn) => conn.depart.id === selectedDepart)
                ?.actifs.some((a) => a.id === actif.id)
            : true;

          const markerOpacity =
            selectedDepart && !belongsToSelectedDepart ? 0.3 : 1;

          return (
            <Marker
              key={actif.id}
              position={[
                actif.geolocalisation.latitude,
                actif.geolocalisation.longitude,
              ]}
              eventHandlers={{
                click: () => handleMarkerClick(actif),
                mouseover: (e: { target: { openPopup: () => void } }) => {
                  e.target.openPopup();
                },
                mouseout: (e: { target: { closePopup: () => void } }) => {
                  e.target.closePopup();
                },
              }}
              icon={icon}
              opacity={markerOpacity}
            >
              <Popup>
                <div className="p-3 min-w-[250px] max-w-[300px]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                        style={{ backgroundColor: getTypeColor(actif.type) }}
                      >
                        {getTypeSymbol(actif.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 leading-tight">
                          {actif.designationGenerale}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {actif.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        actif.etatVisuel === "Bon"
                          ? "bg-green-100 text-green-800"
                          : actif.etatVisuel === "Moyen"
                          ? "bg-yellow-100 text-yellow-800"
                          : actif.etatVisuel === "Passable"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {actif.etatVisuel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500 block">Région</span>
                      <span className="font-medium text-gray-900">
                        {actif.region}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500 block">Commune</span>
                      <span className="font-medium text-gray-900">
                        {actif.commune}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500 block">Position</span>
                      <span className="font-medium text-gray-900">
                        {actif.positionMateriel}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-500 block">Année</span>
                      <span className="font-medium text-gray-900">
                        {actif.anneeMiseEnService}
                      </span>
                    </div>
                  </div>

                  {/* Show depart information if available */}
                  {(() => {
                    const actifDeparts = departConnections.filter((conn) =>
                      conn.actifs.some((a) => a.id === actif.id)
                    );
                    return (
                      actifDeparts.length > 0 && (
                        <div className="border-t pt-2 mb-2">
                          <div className="text-xs text-gray-500 mb-1">
                            Départ(s)
                          </div>
                          {actifDeparts.map((conn) => (
                            <div
                              key={conn.depart.id}
                              className="flex items-center space-x-2 mb-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                              onClick={() => setSelectedDepart(conn.depart.id)}
                            >
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: conn.color }}
                              ></div>
                              <span className="text-xs font-medium">
                                {conn.depart.nom}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    );
                  })()}

                  <div className="border-t pt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      Coordonnées
                    </div>
                    <div className="font-mono text-xs text-gray-700 bg-gray-50 p-1 rounded">
                      {actif.geolocalisation.latitude.toFixed(6)},{" "}
                      {actif.geolocalisation.longitude.toFixed(6)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkerClick(actif)}
                    className={`w-full mt-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
                      isSelected
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md"
                    }`}
                  >
                    {isSelected ? "✓ Sélectionné" : "Sélectionner"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};

// Depart Control Panel Component
const DepartControlPanel: React.FC = () => {
  const {
    departConnections,
    selectedDepart,
    setSelectedDepart,
    showDepartConnections,
    setShowDepartConnections,
    showDepartLabels,
    setShowDepartLabels,
    showAllActifs,
    setShowAllActifs,
    toggleDepartVisibility,
    centerOnDepart,
  } = useMapStore();

  return (
    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 max-w-sm max-h-80 overflow-y-auto">
      <h4 className="font-semibold text-sm mb-3 text-gray-900 flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
        Contrôle des Départs
      </h4>

      {/* Display Controls */}
      <div className="space-y-2 mb-4">
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={showAllActifs}
            onChange={(e) => setShowAllActifs(e.target.checked)}
            className="mr-2 w-3 h-3"
          />
          <span>Afficher tous les actifs</span>
        </label>
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={showDepartConnections}
            onChange={(e) => setShowDepartConnections(e.target.checked)}
            className="mr-2 w-3 h-3"
          />
          <span>Afficher les connexions</span>
        </label>
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={showDepartLabels}
            onChange={(e) => setShowDepartLabels(e.target.checked)}
            className="mr-2 w-3 h-3"
          />
          <span>Afficher les labels</span>
        </label>
      </div>

      {/* Departs List */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-700 mb-2">
          Départs ({departConnections.length})
        </div>
        {departConnections.map(({ depart, actifs, color, isVisible }) => (
          <div
            key={depart.id}
            className={`p-2 rounded-lg border cursor-pointer transition-all ${
              selectedDepart === depart.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleDepartVisibility(depart.id)}
                  className={`w-3 h-3 rounded transition-opacity ${
                    isVisible ? "opacity-100" : "opacity-30"
                  }`}
                  style={{ backgroundColor: color }}
                ></button>
                <span className="text-xs font-medium">{depart.nom}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => centerOnDepart(depart.id)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-1 py-0.5 rounded"
                  title="Centrer sur le départ"
                >
                  🎯
                </button>
                <button
                  onClick={() =>
                    setSelectedDepart(
                      selectedDepart === depart.id ? null : depart.id
                    )
                  }
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-1 py-0.5 rounded"
                  title="Sélectionner le départ"
                >
                  {selectedDepart === depart.id ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{depart.typeDepart}</span>
              </div>
              <div className="flex justify-between">
                <span>Actifs:</span>
                <span className="font-medium">{actifs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tension:</span>
                <span className="font-medium">
                  {depart.tension.toLocaleString()}V
                </span>
              </div>
              <div className="flex justify-between">
                <span>État:</span>
                <span
                  className={`font-medium ${
                    depart.etatGeneral === "En service"
                      ? "text-green-600"
                      : depart.etatGeneral === "Maintenance"
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {depart.etatGeneral}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MapView: React.FC = () => {
  const center: L.LatLngExpression = [7.3697, 12.3547];

  return (
    <div className="flex-1 relative z-10">
      <MapContainer
        center={center}
        zoom={7}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          {/* Actifs Layer */}
          <ActifMarkers />

          {/* Depart Connections Layer */}
          <LayersControl.Overlay checked name="Connexions des Départs">
            <LayerGroup>
              <DepartConnections />
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Electrical Lines Layer */}
          <LayersControl.Overlay name="Lignes Électriques">
            <LayerGroup>
              <ElectricalLines />
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        <MapEventsHandler />
        <DrawingControls />
      </MapContainer>

      {/* Enhanced Drawing Instructions */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200 max-w-sm">
        <h4 className="font-semibold text-sm mb-3 text-gray-900 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Instructions de sélection
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
              ✋
            </div>
            <span>
              <strong>Navigation:</strong> Mode par défaut pour explorer la
              carte
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
              ⬜
            </div>
            <span>
              <strong>Rectangle:</strong> Tracez un rectangle pour sélectionner
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 rounded flex items-center justify-center">
              ⭕
            </div>
            <span>
              <strong>Cercle:</strong> Tracez un cercle pour sélectionner
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              🔷
            </div>
            <span>
              <strong>Polygone:</strong> Cliquez pour créer des points
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
              👆
            </div>
            <span>
              <strong>Clic direct:</strong> Sélection individuelle
            </span>
          </div>
        </div>
      </div>

      {/* Depart Control Panel */}
      <DepartControlPanel />

      {/* Enhanced Legend */}
      <div className="absolute top-4 right-16 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-200 max-w-xs">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Légende</h4>

        {/* Asset Types */}
        <div className="mb-3">
          <div className="text-xs font-medium text-gray-700 mb-1">
            Types d'Actifs
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {[
              { type: "POSTE_DISTRIBUTION", label: "Postes" },
              { type: "TRANSFORMATEUR", label: "Transformateurs" },
              { type: "LIGNE_AERIENNE", label: "L. Aériennes" },
              { type: "LIGNE_SOUTERRAINE", label: "L. Souterraines" },
              { type: "SUPPORT", label: "Supports" },
              { type: "OCR", label: "OCR" },
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getTypeColor(type) }}
                ></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Depart Types */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-1">
            Types de Départs
          </div>
          <div className="space-y-1 text-xs">
            {[
              "Principal",
              "Résidentiel",
              "Commercial",
              "Industriel",
              "Secondaire",
            ].map((type) => (
              <div key={type} className="flex items-center space-x-1">
                <div
                  className="w-3 h-1 rounded"
                  style={{ backgroundColor: getDepartColor(type) }}
                ></div>
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={() => {
            const map = document.querySelector(".leaflet-container") as any;
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomIn();
            }
          }}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border-b border-gray-200"
        >
          +
        </button>
        <button
          onClick={() => {
            const map = document.querySelector(".leaflet-container") as any;
            if (map && map._leaflet_map) {
              map._leaflet_map.zoomOut();
            }
          }}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
        >
          −
        </button>
      </div>
    </div>
  );
};

// Helper function to get depart color
const getDepartColor = (typeDepart: string): string => {
  const colors: Record<string, string> = {
    Principal: "#e74c3c",
    Résidentiel: "#3498db",
    Commercial: "#f39c12",
    Industriel: "#9b59b6",
    Secondaire: "#27ae60",
    Mixte: "#e67e22",
  };
  return colors[typeDepart] || "#95a5a6";
};

export default MapView;
