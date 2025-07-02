import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// ========== CORRECTION DES ICÔNES LEAFLET ==========
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Types
type ActifGeo = {
  id: string | number;
  designationGenerale: string;
  type: string;
  photo?: string[];
  geolocalisation: {
    latitude: number;
    longitude: number;
  };
};

type MultiAssetsMapProps = {
  actifsGeo: ActifGeo[];
  defaultCenter?: [number, number];
  height?: string;
  showControls?: boolean;
  enableClustering?: boolean;
  selectedAssetId?: string | number | null;
  onAssetSelect?: (assetId: string | number | null) => void;
  zoom?: number;
};

// Composant pour synchroniser la vue de la carte
const MapViewController: React.FC<{
  center: [number, number];
  zoom: number;
  selectedAssetId?: string | number | null;
}> = ({ center, zoom, selectedAssetId }) => {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom, { animate: true, duration: 1 });
    }
  }, [map, center, zoom]);

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

// Composant pour l'image avec gestion d'erreur
const SafeImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}> = ({ src, alt, className, onError }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-8 h-8 mx-auto mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">Image indisponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

// Composant principal avec forwardRef pour la référence
const MultiAssetsMap = forwardRef<any, MultiAssetsMapProps>(
  (
    {
      actifsGeo,
      defaultCenter,
      height = "h-80",
      showControls = true,
      enableClustering = false,
      selectedAssetId,
      onAssetSelect,
      zoom: initialZoom = 12,
    },
    ref
  ) => {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [useDefaultIcon, setUseDefaultIcon] = useState(false);
    const [currentCenter, setCurrentCenter] = useState<[number, number]>(
      defaultCenter || [0, 0]
    );
    const [currentZoom, setCurrentZoom] = useState<number>(initialZoom);

    // Exposer les méthodes via useImperativeHandle
    useImperativeHandle(ref, () => ({
      focusOnAsset: (assetId: string | number) => {
        const asset = validAssets.find((a) => a.id === assetId);
        if (asset) {
          setCurrentCenter([
            asset.geolocalisation.latitude,
            asset.geolocalisation.longitude,
          ]);
          setCurrentZoom(16);
          onAssetSelect?.(assetId);
        }
      },
      resetView: () => {
        setCurrentCenter(center);
        setCurrentZoom(zoom);
        onAssetSelect?.(null);
      },
    }));

    // Mettre à jour le centre et le zoom quand les props changent
    useEffect(() => {
      if (defaultCenter) {
        setCurrentCenter(defaultCenter);
      }
    }, [defaultCenter]);

    useEffect(() => {
      setCurrentZoom(initialZoom);
    }, [initialZoom]);

    // Filtrer les actifs avec coordonnées valides
    const validAssets = useMemo(() => {
      return actifsGeo.filter((actif) =>
        isValidCoordinate(
          actif.geolocalisation?.latitude,
          actif.geolocalisation?.longitude
        )
      );
    }, [actifsGeo]);

    // Calculer le centre automatiquement si non fourni
    const center = useMemo(() => {
      if (defaultCenter) return defaultCenter;

      if (validAssets.length === 0) {
        return [0, 0] as [number, number];
      }

      if (validAssets.length === 1) {
        return [
          validAssets[0].geolocalisation.latitude,
          validAssets[0].geolocalisation.longitude,
        ] as [number, number];
      }

      // Calculer le centre géographique
      const bounds = validAssets.reduce(
        (acc, asset) => ({
          minLat: Math.min(acc.minLat, asset.geolocalisation.latitude),
          maxLat: Math.max(acc.maxLat, asset.geolocalisation.latitude),
          minLng: Math.min(acc.minLng, asset.geolocalisation.longitude),
          maxLng: Math.max(acc.maxLng, asset.geolocalisation.longitude),
        }),
        {
          minLat: Infinity,
          maxLat: -Infinity,
          minLng: Infinity,
          maxLng: -Infinity,
        }
      );

      return [
        (bounds.minLat + bounds.maxLat) / 2,
        (bounds.minLng + bounds.maxLng) / 2,
      ] as [number, number];
    }, [defaultCenter, validAssets]);

    // Calculer le zoom automatique
    const zoom = useMemo(() => {
      if (validAssets.length <= 1) return 14;

      const bounds = validAssets.reduce(
        (acc, asset) => ({
          minLat: Math.min(acc.minLat, asset.geolocalisation.latitude),
          maxLat: Math.max(acc.maxLat, asset.geolocalisation.latitude),
          minLng: Math.min(acc.minLng, asset.geolocalisation.longitude),
          maxLng: Math.max(acc.maxLng, asset.geolocalisation.longitude),
        }),
        {
          minLat: Infinity,
          maxLat: -Infinity,
          minLng: Infinity,
          maxLng: -Infinity,
        }
      );

      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      const maxDiff = Math.max(latDiff, lngDiff);

      if (maxDiff > 0.2) return 8;
      if (maxDiff > 0.1) return 10;
      if (maxDiff > 0.05) return 11;
      if (maxDiff > 0.01) return 12;
      return 13;
    }, [validAssets]);

    // Icône personnalisée avec fallback
    const createCustomIcon = (asset: ActifGeo) => {
      const isSelected = selectedAssetId === asset.id;

      if (useDefaultIcon) {
        return new L.Icon.Default();
      }

      return new L.Icon({
        iconUrl: "/images/point.png",
        iconSize: isSelected ? [40, 40] : [32, 32],
        iconAnchor: isSelected ? [20, 20] : [16, 16],
        popupAnchor: isSelected ? [0, -20] : [0, -16],
        className: `custom-marker-icon ${isSelected ? "selected" : ""}`,
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });
    };

    // Gestion d'erreur pour l'icône
    const handleIconError = () => {
      setUseDefaultIcon(true);
    };

    // Observer pour les changements de taille
    useEffect(() => {
      if (!containerRef.current || validAssets.length === 0) return;

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
    }, [validAssets.length]);

    if (validAssets.length === 0) {
      return (
        <div
          className={`bg-gray-100 dark:bg-gray-700 rounded-lg ${height} p-4`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="text-6xl opacity-20">🗺️</div>
              <div>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  Aucun actif géolocalisé disponible
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Total des actifs: {actifsGeo.length}</p>
                  <p>Avec géolocalisation valide: {validAssets.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`bg-gray-100 dark:bg-gray-700 rounded-lg ${height} relative`}
      >
        <div
          ref={containerRef}
          className="w-full h-full rounded overflow-hidden relative"
        >
          <MapContainer
            ref={mapRef}
            center={currentCenter}
            zoom={currentZoom}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={true}
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

            <MapViewController
              center={currentCenter}
              zoom={currentZoom}
              selectedAssetId={selectedAssetId}
            />

            {validAssets.map((actif) => (
              <Marker
                key={actif.id}
                position={[
                  actif.geolocalisation.latitude,
                  actif.geolocalisation.longitude,
                ]}
                icon={createCustomIcon(actif)}
                eventHandlers={{
                  click: () => onAssetSelect?.(actif.id),
                  add: () => {
                    if (!useDefaultIcon) {
                      const img = new Image();
                      img.onerror = handleIconError;
                      img.src = "/images/point.png";
                    }
                  },
                }}
              >
                <Popup
                  maxWidth={300}
                  closeButton={true}
                  onClose={() => onAssetSelect?.(null)}
                >
                  <div className="space-y-3 p-2">
                    {/* Image de l'actif */}
                    {actif.photo && actif.photo.length > 0 && (
                      <div className="w-full h-32 rounded-lg overflow-hidden">
                        <SafeImage
                          src={actif.photo[0]}
                          alt={actif.designationGenerale}
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    )}

                    {/* Informations de l'actif */}
                    <div className="space-y-2">
                      <div className="font-bold text-blue-600 text-lg">
                        🏢 {actif.designationGenerale}
                      </div>

                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs uppercase tracking-wide">
                            Type
                          </span>
                          <div className="font-medium">
                            {actif.type.replace(/_/g, " ")}
                          </div>
                        </div>

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
                            Lat: {actif.geolocalisation.latitude.toFixed(6)}
                            <br />
                            Lng: {actif.geolocalisation.longitude.toFixed(6)}
                          </div>
                        </div>

                        {/* Photos supplémentaires */}
                        {actif.photo && actif.photo.length > 1 && (
                          <div>
                            <span className="text-gray-500 text-xs uppercase tracking-wide">
                              Photos ({actif.photo.length})
                            </span>
                            <div className="flex gap-1 mt-1">
                              {actif.photo.slice(1, 4).map((photo, index) => (
                                <div
                                  key={index}
                                  className="w-12 h-12 rounded overflow-hidden"
                                >
                                  <SafeImage
                                    src={photo}
                                    alt={`${actif.designationGenerale} ${
                                      index + 2
                                    }`}
                                    className="w-full h-full"
                                  />
                                </div>
                              ))}
                              {actif.photo.length > 4 && (
                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    +{actif.photo.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Contrôles et statistiques */}
          {showControls && (
            <>
              {/* Statistiques */}
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-sm shadow-lg z-10 border">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">
                    {validAssets.length}
                  </span>
                  <span className="text-gray-500">/{actifsGeo.length}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    actifs
                  </span>
                </div>
                {selectedAssetId && (
                  <div className="text-xs text-blue-600 mt-1">
                    Actif sélectionné
                  </div>
                )}
              </div>

              {/* Légende */}
              <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 rounded-lg p-3 text-xs shadow-lg z-10 border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Actifs géolocalisés</span>
                  </div>
                  {selectedAssetId && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Actif sélectionné</span>
                    </div>
                  )}
                  <div className="text-gray-500">
                    Cliquez sur un marqueur pour plus d'infos
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* CSS pour les icônes personnalisées */}
        <style jsx>{`
          .custom-marker-icon {
            border: 2px solid #fff;
            border-radius: 50%;
            box-sizing: border-box;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
          }
          .custom-marker-icon:hover {
            transform: scale(1.1);
            border-color: #3b82f6;
          }
          .custom-marker-icon.selected {
            border-color: #ef4444;
            border-width: 3px;
            box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
            transform: scale(1.2);
            z-index: 1000;
          }
        `}</style>
      </div>
    );
  }
);

MultiAssetsMap.displayName = "MultiAssetsMap";

export default MultiAssetsMap;
