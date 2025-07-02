import React, { useMemo, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ========== CORRECTION DES ICÔNES LEAFLET ==========
// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Configuration des icônes personnalisées
const MARKER_ICONS = {
  origin: new L.Icon({
    iconUrl: "/images/point-origin.png",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -21],
    className: "origin-marker-icon",
    // Fallback vers icône par défaut si l'image n'existe pas
    iconRetinaUrl: "/images/point-origin.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  }),
  asset: new L.Icon({
    iconUrl: "/images/point.png",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
    className: "asset-marker-icon",
    // Fallback vers icône par défaut si l'image n'existe pas
    iconRetinaUrl: "/images/point.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  }),
};

// Configuration des styles de ligne
const LINE_STYLES = {
  route: {
    color: "#3B82F6", // blue-500
    weight: 4,
    opacity: 0.8,
    lineCap: "round" as const,
    lineJoin: "round" as const,
  },
  connection: {
    color: "#EF4444", // red-500
    weight: 3,
    opacity: 0.7,
    dashArray: "8, 12",
    lineCap: "round" as const,
    lineJoin: "round" as const,
  },
};

// ========== COMPOSANT DE REDIMENSIONNEMENT ==========
// Ce composant force la carte à se redimensionner correctement
const MapResizer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Petit délai pour laisser le DOM se stabiliser
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [map]);

  return null;
};

// Utilitaires de validation
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return (
    lat != null &&
    lng != null &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

const isValidPosition = (geolocalisation?: {
  latitude: number;
  longitude: number;
}): boolean => {
  if (!geolocalisation) return false;
  return isValidCoordinate(geolocalisation.latitude, geolocalisation.longitude);
};

// Types
type PosteOrigine = {
  id: string | number;
  libelleCompte: string;
  geolocalisation: {
    latitude: number;
    longitude: number;
  };
};

type Asset = {
  id: string | number;
  designationGenerale: string;
  type: string;
  geolocalisation: {
    latitude: number;
    longitude: number;
  };
};

type DepartureMapProps = {
  posteOrigine: PosteOrigine;
  actifsAssocies: Asset[];
};

// Composant pour le marqueur d'origine
const OriginMarker: React.FC<{ posteOrigine: PosteOrigine }> = ({
  posteOrigine,
}) => {
  // Utiliser l'icône par défaut si l'icône personnalisée ne charge pas
  const [useDefaultIcon, setUseDefaultIcon] = React.useState(false);

  const handleIconError = () => {
    setUseDefaultIcon(true);
  };

  return (
    <Marker
      position={[
        posteOrigine.geolocalisation.latitude,
        posteOrigine.geolocalisation.longitude,
      ]}
      icon={useDefaultIcon ? new L.Icon.Default() : MARKER_ICONS.origin}
      eventHandlers={{
        add: (e) => {
          // Vérifier si l'icône se charge correctement
          console.log(e.target.options.icon.options.iconUrl);
          const img = new Image();
          img.onerror = handleIconError;
          img.src = "/images/point-origin.png";
        },
      }}
    >
      <Popup maxWidth={250} closeButton={true}>
        <div className="space-y-2">
          <div className="font-semibold text-blue-600">📍 Poste d'origine</div>
          <div className="text-sm">
            <div>
              <strong>Libellé:</strong> {posteOrigine.libelleCompte}
            </div>
            <div>
              <strong>ID:</strong> {posteOrigine.id}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Composant pour les marqueurs d'actifs
const AssetMarkers: React.FC<{ validAssets: Asset[] }> = ({ validAssets }) => {
  const [useDefaultIcon, setUseDefaultIcon] = React.useState(false);

  const handleIconError = () => {
    setUseDefaultIcon(true);
  };

  return (
    <>
      {validAssets.map((actif, index) => (
        <Marker
          key={`asset-${actif.id}`}
          position={[
            actif.geolocalisation.latitude,
            actif.geolocalisation.longitude,
          ]}
          icon={useDefaultIcon ? new L.Icon.Default() : MARKER_ICONS.asset}
          eventHandlers={{
            add: (e) => {
              if (!useDefaultIcon) {
                const img = new Image();
                img.onerror = handleIconError;
                img.src = "/images/point.png";
              }
            },
          }}
        >
          <Popup maxWidth={250} closeButton={true}>
            <div className="space-y-2">
              <div className="font-semibold text-green-600">
                🏢 {actif.designationGenerale}
              </div>
              <div className="text-sm space-y-1">
                <div>
                  <strong>Type:</strong> {actif.type.replace(/_/g, " ")}
                </div>
                <div>
                  <strong>ID:</strong> {actif.id}
                </div>
                <div>
                  <strong>Position:</strong> {index + 1}/{validAssets.length}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// Composant pour les lignes de route
const RouteLines: React.FC<{
  posteOrigine: PosteOrigine;
  validAssets: Asset[];
}> = ({ posteOrigine, validAssets }) => {
  const { routePositions, connectionLine } = useMemo(() => {
    const routePositions = validAssets.map((actif) => [
      actif.geolocalisation.latitude,
      actif.geolocalisation.longitude,
    ]) as [number, number][];

    const connectionLine: [number, number][] =
      validAssets.length > 0
        ? [
            [
              posteOrigine.geolocalisation.latitude,
              posteOrigine.geolocalisation.longitude,
            ],
            [
              validAssets[0].geolocalisation.latitude,
              validAssets[0].geolocalisation.longitude,
            ],
          ]
        : [];

    return { routePositions, connectionLine };
  }, [posteOrigine, validAssets]);

  return (
    <>
      {connectionLine.length > 0 && (
        <Polyline
          positions={connectionLine}
          pathOptions={LINE_STYLES.connection}
        />
      )}
      {routePositions.length >= 2 && (
        <Polyline positions={routePositions} pathOptions={LINE_STYLES.route} />
      )}
    </>
  );
};

// Composant principal de la carte
const DepartureMap: React.FC<DepartureMapProps> = ({
  posteOrigine,
  actifsAssocies,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Validation et filtrage des données
  const { validAssets, stats } = useMemo(() => {
    const isOriginValid = isValidPosition(posteOrigine?.geolocalisation);
    const validAssets = (actifsAssocies || []).filter((actif) =>
      isValidPosition(actif.geolocalisation)
    );

    const stats = {
      total: actifsAssocies?.length || 0,
      valid: validAssets.length,
      hasOrigin: isOriginValid,
      canShowMap: isOriginValid && validAssets.length > 0,
    };

    return { validAssets, stats };
  }, [posteOrigine, actifsAssocies]);

  // Calcul du centre et du zoom automatique
  const { center, zoom } = useMemo((): {
    center: [number, number];
    zoom: number;
  } => {
    if (!stats.canShowMap) {
      return { center: [0, 0] as [number, number], zoom: 2 };
    }

    if (validAssets.length > 1) {
      const allPositions = [
        posteOrigine.geolocalisation,
        ...validAssets.map((a) => a.geolocalisation),
      ];

      const bounds = allPositions.reduce(
        (acc, pos) => ({
          minLat: Math.min(acc.minLat, pos.latitude),
          maxLat: Math.max(acc.maxLat, pos.latitude),
          minLng: Math.min(acc.minLng, pos.longitude),
          maxLng: Math.max(acc.maxLng, pos.longitude),
        }),
        {
          minLat: Infinity,
          maxLat: -Infinity,
          minLng: Infinity,
          maxLng: -Infinity,
        }
      );

      const centerLat = (bounds.minLat + bounds.maxLat) / 2;
      const centerLng = (bounds.minLng + bounds.maxLng) / 2;
      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      const maxDiff = Math.max(latDiff, lngDiff);

      let adaptiveZoom = 13;
      if (maxDiff > 0.1) adaptiveZoom = 10;
      else if (maxDiff > 0.05) adaptiveZoom = 11;
      else if (maxDiff > 0.01) adaptiveZoom = 12;

      return {
        center: [centerLat, centerLng] as [number, number],
        zoom: adaptiveZoom,
      };
    }

    return {
      center: [
        posteOrigine.geolocalisation.latitude,
        posteOrigine.geolocalisation.longitude,
      ] as [number, number],
      zoom: 14,
    };
  }, [posteOrigine, validAssets, stats.canShowMap]);

  // Force le redimensionnement de la carte quand elle devient visible
  useEffect(() => {
    if (stats.canShowMap && mapRef.current) {
      const timeoutId = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [stats.canShowMap]);

  // Observer pour détecter les changements de taille du conteneur
  useEffect(() => {
    if (!containerRef.current || !stats.canShowMap) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [stats.canShowMap]);

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Carte du départ
      </h2>

      <div
        ref={containerRef}
        className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-80 w-full"
      >
        {stats.canShowMap ? (
          <div className="h-full w-full relative">
            <MapContainer
              ref={mapRef}
              center={center}
              zoom={zoom}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: "0.5rem",
              }}
              className="z-0"
              whenReady={() => {
                // Force un redimensionnement quand la carte est prête
                setTimeout(() => {
                  if (mapRef.current) {
                    mapRef.current.invalidateSize();
                  }
                }, 100);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />

              {/* Composant pour forcer le redimensionnement */}
              <MapResizer />

              <OriginMarker posteOrigine={posteOrigine} />
              <AssetMarkers validAssets={validAssets} />
              <RouteLines
                posteOrigine={posteOrigine}
                validAssets={validAssets}
              />
            </MapContainer>

            {/* Indicateur de statistiques */}
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-md px-2 py-1 text-xs shadow-md z-10">
              <span className="text-green-600 font-medium">{stats.valid}</span>
              <span className="text-gray-500">/{stats.total} actifs</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="text-6xl opacity-20">🗺️</div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  Données de géolocalisation insuffisantes
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <div className="flex items-center justify-center space-x-4">
                    <span
                      className={`flex items-center space-x-1 ${
                        stats.hasOrigin ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>{stats.hasOrigin ? "✅" : "❌"}</span>
                      <span>Poste origine</span>
                    </span>
                    <span
                      className={`flex items-center space-x-1 ${
                        stats.valid > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      <span>{stats.valid > 0 ? "✅" : "❌"}</span>
                      <span>
                        {stats.valid}/{stats.total} actifs
                      </span>
                    </span>
                  </div>
                  <p className="text-xs mt-2">
                    Minimum requis: 1 poste origine + 1 actif avec coordonnées
                    valides
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartureMap;
