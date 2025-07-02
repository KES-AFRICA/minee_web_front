import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Type pour un actif
type Actif = {
  id: string | number;
  designationGenerale: string;
  type?: string;
  geolocalisation?: {
    latitude: number;
    longitude: number;
  };
};

// Composant de redimensionnement de la carte
const MapResizer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [map]);

  return null;
};

// Validation des coordonnées
const isValidCoordinate = (lat?: number, lng?: number): boolean => {
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

// Composant principal de la carte pour un actif
interface AssetMapProps {
  actif: Actif;
  height?: string;
  zoom?: number;
  showFullscreen?: boolean;
}

const AssetMap: React.FC<AssetMapProps> = ({
  actif,
  height = "h-64",
  zoom = 15,
  showFullscreen = false,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [useDefaultIcon, setUseDefaultIcon] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Icône personnalisée avec fallback
  const customIcon = useDefaultIcon
    ? new L.Icon.Default()
    : new L.Icon({
        iconUrl: "/images/point.png",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19],
        className: "custom-marker-icon",
        // Fallback si l'image n'existe pas
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });

  // Vérification de la validité des coordonnées
  const hasValidCoordinates = isValidCoordinate(
    actif.geolocalisation?.latitude,
    actif.geolocalisation?.longitude
  );

  // Gestion d'erreur pour l'icône
  const handleIconError = () => {
    setUseDefaultIcon(true);
  };

  // Force le redimensionnement de la carte
  useEffect(() => {
    if (hasValidCoordinates && mapRef.current) {
      const timeoutId = setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [hasValidCoordinates, isFullscreen]);

  // Observer pour détecter les changements de taille
  useEffect(() => {
    if (!containerRef.current || !hasValidCoordinates) return;

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
  }, [hasValidCoordinates]);

  // Gestion du plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Gestion de l'échappement pour fermer le plein écran
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  if (!hasValidCoordinates) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg ${height}`}>
        <div className="mt-4 border bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="text-4xl opacity-30">📍</div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Localisation non disponible
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Coordonnées manquantes ou invalides
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mapContent = (
    <div className="w-full h-full rounded overflow-hidden relative">
      <MapContainer
        ref={mapRef}
        center={[
          actif.geolocalisation!.latitude,
          actif.geolocalisation!.longitude,
        ]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={!isFullscreen} // Désactiver le scroll sur la version compacte
        whenReady={() => {
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize();
            }
          }, 100);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapResizer />

        <Marker
          position={[
            actif.geolocalisation!.latitude,
            actif.geolocalisation!.longitude,
          ]}
          icon={customIcon}
          eventHandlers={{
            add: () => {
              if (!useDefaultIcon) {
                const img = new Image();
                img.onerror = handleIconError;
                img.src = "/images/point.png";
              }
            },
          }}
        >
          <Popup maxWidth={300} closeButton={true}>
            <div className="space-y-3 p-2">
              <div className="font-bold text-blue-600 text-lg">
                🏢 {actif.designationGenerale}
              </div>
              <div className="space-y-2 text-sm">
                {actif.type && (
                  <div>
                    <span className="text-gray-500 text-xs uppercase tracking-wide">
                      Type
                    </span>
                    <div className="font-medium">
                      {actif.type.replace(/_/g, " ")}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    ID
                  </span>
                  <div className="font-mono text-sm">{actif.id}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    Coordonnées
                  </span>
                  <div className="font-mono text-xs">
                    Lat: {actif.geolocalisation!.latitude.toFixed(6)}
                    <br />
                    Lng: {actif.geolocalisation!.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Bouton plein écran */}
      {showFullscreen && !isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:shadow-lg transition-all z-10 group"
          title="Ouvrir en plein écran"
        >
          <svg
            className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
      )}

      {/* Indicateur de précision */}
      <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs shadow-md z-10">
        <span className="text-green-600">📍</span>
        <span className="text-gray-600 dark:text-gray-300 ml-1">
          Géolocalisé
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Carte normale */}
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg ${height}`}>
        <div
          ref={containerRef}
          className="mt-4 border bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center h-full p-2"
        >
          {mapContent}
        </div>
      </div>

      {/* Modal plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl max-h-[95vh] m-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 rounded-t-lg z-20 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                📍 {actif.designationGenerale}
              </h3>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Fermer le plein écran"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Carte plein écran */}
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden pt-16">
              {mapContent}
            </div>
          </div>
        </div>
      )}

      {/* CSS pour l'icône personnalisée */}
      <style jsx>{`
        .custom-marker-icon {
          border: 2px solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .custom-marker-icon:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default AssetMap;
