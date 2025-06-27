import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Activity, MapPin, Filter, Layers, AlertTriangle } from "lucide-react";

// Icônes personnalisées
const createIcon = (iconColor: string) => {
  return L.divIcon({
    html: `
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="${iconColor}" stroke-width="2" fill="white" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
      </svg>
    `,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

type AssetType =
  | "Transformateur"
  | "Ligne"
  | "Poste"
  | "Compteur"
  | "Générateur";

const assetIcons: Record<AssetType, L.DivIcon> = {
  Transformateur: createIcon("#0d9488"),
  Ligne: createIcon("#0369a1"),
  Poste: createIcon("#b45309"),
  Compteur: createIcon("#7e22ce"),
  Générateur: createIcon("#d97706"),
};

type Asset = {
  id: string;
  name: string;
  type: AssetType;
  position: [number, number];
  status: string;
  capacity?: string;
  length?: string;
  lastInspection: string;
};

// Données fictives pour les actifs
const fakeAssets: Asset[] = [
  {
    id: "TR-001",
    name: "Transformateur HT Douala",
    type: "Transformateur",
    position: [4.0511, 9.7679], // Douala
    status: "Actif",
    capacity: "50 MVA",
    lastInspection: "2023-10-15",
  },
  {
    id: "LG-045",
    name: "Ligne 90kV Yaoundé",
    type: "Ligne",
    position: [3.848, 11.5021], // Yaoundé
    status: "En maintenance",
    length: "15 km",
    lastInspection: "2023-11-02",
  },
  // ... Ajoutez plus d'actifs pour différentes régions
];

// Couches GeoJSON fictives pour les régions du Cameroun
import type { FeatureCollection, Feature, Polygon } from "geojson";

const regionsLayer: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Littoral" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            /* Coordonnées du Littoral */
          ],
        ],
      },
    } as Feature<Polygon, { name: string }>,
    // ... Ajoutez d'autres régions
  ],
};

const criticalZonesLayer: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zone Industrielle Douala", criticality: "Haute" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            /* Coordonnées */
          ],
        ],
      },
    } as Feature<Polygon, { name: string; criticality: string }>,
  ],
};

export default function AssetMapPage() {
  const [selectedType, setSelectedType] = useState<string>("Tous");
  const [selectedRegion, setSelectedRegion] = useState<string>("Tous");
  const [selectedCriticality, setSelectedCriticality] =
    useState<string>("Tous");
  const [filteredAssets, setFilteredAssets] = useState(fakeAssets);

  useEffect(() => {
    const filtered = fakeAssets.filter((asset) => {
      const typeMatch = selectedType === "Tous" || asset.type === selectedType;
      const regionMatch =
        selectedRegion === "Tous" ||
        (selectedRegion === "Littoral" && asset.position[0] > 4.0) || // Exemple simplifié
        (selectedRegion === "Centre" && asset.position[1] > 11.0);
      const criticalityMatch =
        selectedCriticality === "Tous" ||
        (selectedCriticality === "Haute" && asset.type === "Transformateur");

      return typeMatch && regionMatch && criticalityMatch;
    });
    setFilteredAssets(filtered);
  }, [selectedType, selectedRegion, selectedCriticality]);

  // Style pour les couches GeoJSON
  const regionStyle = {
    fillColor: "#3b82f6",
    weight: 2,
    opacity: 1,
    color: "#1d4ed8",
    fillOpacity: 0.1,
  };

  const criticalZoneStyle = {
    fillColor: "#ef4444",
    weight: 2,
    opacity: 1,
    color: "#dc2626",
    fillOpacity: 0.2,
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="text-teal-600 dark:text-teal-400" />
              Cartographie des Actifs ENEO
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visualisation géographique du réseau électrique
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Activity className="h-4 w-4" />
              {filteredAssets.length} actifs
            </span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 dark:text-gray-400" />
          <select
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="Tous">Tous les types</option>
            <option value="Transformateur">Transformateurs</option>
            <option value="Ligne">Lignes</option>
            <option value="Poste">Postes</option>
            <option value="Compteur">Compteurs</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="text-gray-500 dark:text-gray-400" />
          <select
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="Tous">Toutes les régions</option>
            <option value="Littoral">Littoral</option>
            <option value="Centre">Centre</option>
            <option value="Nord">Nord</option>
            <option value="Sud">Sud</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="text-gray-500 dark:text-gray-400" />
          <select
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
          >
            <option value="Tous">Toutes criticités</option>
            <option value="Haute">Haute criticité</option>
            <option value="Moyenne">Moyenne criticité</option>
            <option value="Basse">Basse criticité</option>
          </select>
        </div>
      </div>

      {/* Carte */}
      <div className="flex-1 relative">
        <MapContainer
          center={[5.6919, 10.2227]} // Centre du Cameroun
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <LayersControl position="topright">
            {/* Couche de base - OpenStreetMap */}
            <LayersControl.BaseLayer checked name="Carte Standard">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </LayersControl.BaseLayer>

            {/* Couche Satellite */}
            <LayersControl.BaseLayer name="Vue Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
              />
            </LayersControl.BaseLayer>

            {/* Couche Terrain */}
            <LayersControl.BaseLayer name="Relief">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a>'
              />
            </LayersControl.BaseLayer>

            {/* Couches superposées */}
            <LayersControl.Overlay name="Régions" checked>
              <GeoJSON
                data={regionsLayer}
                style={regionStyle}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(`<b>${feature.properties.name}</b>`);
                }}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Zones Critiques">
              <GeoJSON
                data={criticalZonesLayer}
                style={criticalZoneStyle}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(`
                    <div class="space-y-1">
                      <h3 class="font-bold">${feature.properties.name}</h3>
                      <p>Criticité: <span class="text-red-600">${feature.properties.criticality}</span></p>
                    </div>
                  `);
                }}
              />
            </LayersControl.Overlay>

            {/* Marqueurs pour les actifs */}
            {filteredAssets.map((asset) => (
              <Marker
                key={asset.id}
                position={asset.position}
                icon={assetIcons[asset.type]}
              >
                <Popup>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{asset.name}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          asset.status === "Actif"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {asset.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {asset.type}
                      </span>
                    </div>
                    <p>
                      <span className="font-semibold">ID:</span> {asset.id}
                    </p>
                    {asset.capacity && (
                      <p>
                        <span className="font-semibold">Capacité:</span>{" "}
                        {asset.capacity}
                      </p>
                    )}
                    {asset.length && (
                      <p>
                        <span className="font-semibold">Longueur:</span>{" "}
                        {asset.length}
                      </p>
                    )}
                    <p>
                      <span className="font-semibold">
                        Dernière inspection:
                      </span>{" "}
                      {asset.lastInspection}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayersControl>
        </MapContainer>

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <h3 className="font-bold mb-2 flex items-center gap-1">
            <Layers className="h-4 w-4" /> Légende
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    (assetIcons.Transformateur.options.html as string) ?? "",
                }}
              />
              <span>Transformateur</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: assetIcons.Ligne.options.html ?? "",
                }}
              />
              <span>Ligne HT</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                dangerouslySetInnerHTML={{
                  __html: assetIcons.Poste.options.html ?? "",
                }}
              />
              <span>Poste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span>Zones critiques</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
