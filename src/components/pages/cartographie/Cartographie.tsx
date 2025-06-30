import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Layers,
  Search,
  Filter,
  MapPin,
  Eye,
  EyeOff,
  Menu,
  X,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Fonction pour créer des icônes personnalisées
const createIcon = (color: string, icon: string) => {
  return new L.DivIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 rounded-full shadow-lg border-2 border-white" style="background-color: ${color}">
          <div class="w-full h-full flex items-center justify-center text-white text-xs font-bold">
            ${icon}
          </div>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${color}"></div>
      </div>
    `,
    className: "custom-div-icon",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

type AssetType =
  | "Transformateur"
  | "Ligne"
  | "Poste"
  | "Compteur"
  | "Générateur";

const assetIcons: Record<AssetType, L.DivIcon> = {
  Transformateur: createIcon("#0d9488", "T"),
  Ligne: createIcon("#0369a1", "L"),
  Poste: createIcon("#b45309", "P"),
  Compteur: createIcon("#7e22ce", "C"),
  Générateur: createIcon("#d97706", "G"),
};

const assetColors: Record<AssetType, string> = {
  Transformateur: "#0d9488",
  Ligne: "#0369a1",
  Poste: "#b45309",
  Compteur: "#7e22ce",
  Générateur: "#d97706",
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
  region: string;
  criticality: string;
};

// Données étendues avec plus d'actifs
const fakeAssets: Asset[] = [
  {
    id: "TR-001",
    name: "Transformateur HT Douala",
    type: "Transformateur",
    position: [4.0511, 9.7679],
    status: "Actif",
    capacity: "50 MVA",
    lastInspection: "2023-10-15",
    region: "Littoral",
    criticality: "Haute",
  },
  {
    id: "LG-045",
    name: "Ligne 90kV Yaoundé",
    type: "Ligne",
    position: [3.848, 11.5021],
    status: "En maintenance",
    length: "15 km",
    lastInspection: "2023-11-02",
    region: "Centre",
    criticality: "Moyenne",
  },
  {
    id: "PS-032",
    name: "Poste Garoua",
    type: "Poste",
    position: [9.3265, 13.3978],
    status: "Actif",
    capacity: "30 MVA",
    lastInspection: "2023-09-20",
    region: "Nord",
    criticality: "Faible",
  },
  {
    id: "GN-008",
    name: "Générateur Bafoussam",
    type: "Générateur",
    position: [5.4781, 10.4199],
    status: "Actif",
    capacity: "25 MW",
    lastInspection: "2023-11-10",
    region: "Ouest",
    criticality: "Haute",
  },
  {
    id: "CM-156",
    name: "Compteur Bertoua",
    type: "Compteur",
    position: [4.5772, 13.6848],
    status: "Actif",
    lastInspection: "2023-10-28",
    region: "Est",
    criticality: "Faible",
  },
];

const regions = [
  "Tous",
  "Centre",
  "Littoral",
  "Nord",
  "Ouest",
  "Est",
  "Adamaoua",
  "Extrême-Nord",
  "Nord-Ouest",
  "Sud",
  "Sud-Ouest",
];
const assetTypes = [
  "Tous",
  "Transformateur",
  "Ligne",
  "Poste",
  "Compteur",
  "Générateur",
];
const criticalityLevels = ["Tous", "Haute", "Moyenne", "Faible"];

export default function AssetMapPage() {
  const [selectedType, setSelectedType] = useState<string>("Tous");
  const [selectedRegion, setSelectedRegion] = useState<string>("Tous");
  const [selectedCriticality, setSelectedCriticality] =
    useState<string>("Tous");
  const [filteredAssets, setFilteredAssets] = useState(fakeAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    const filtered = fakeAssets.filter((asset) => {
      const typeMatch = selectedType === "Tous" || asset.type === selectedType;
      const regionMatch =
        selectedRegion === "Tous" || asset.region === selectedRegion;
      const criticalityMatch =
        selectedCriticality === "Tous" ||
        asset.criticality === selectedCriticality;
      const searchMatch =
        searchTerm === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase());

      return typeMatch && regionMatch && criticalityMatch && searchMatch;
    });
    setFilteredAssets(filtered);
  }, [selectedType, selectedRegion, selectedCriticality, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "En maintenance":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Hors service":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Haute":
        return "bg-red-100 text-red-800 border-red-200";
      case "Moyenne":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Faible":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  return (
    <div className="  bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header moderne avec glassmorphism */}
      <header className="relative z-15 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-slate-700/20 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Carte des Actifs Électriques
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filteredAssets.length} actif
                    {filteredAssets.length > 1 ? "s" : ""} affiché
                    {filteredAssets.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Statistiques rapides */}
              <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/30 dark:border-slate-700/30">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {fakeAssets.filter((a) => a.status === "Actif").length}{" "}
                    Actifs
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {
                      fakeAssets.filter((a) => a.status === "En maintenance")
                        .length
                    }{" "}
                    Maintenance
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-lg border border-white/30 dark:border-slate-700/30 transition-all duration-200"
              >
                {showFilters ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(90vh-130px)]">
        {/* Panneau de filtres moderne avec animation */}
        <div
          className={`${
            showFilters ? "w-80" : "w-0"
          } transition-all duration-300 ease-in-out overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-r border-white/20 dark:border-slate-700/20 shadow-xl`}
        >
          <div className="p-6 space-y-6 h-full overflow-y-auto">
            {/* Barre de recherche */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un actif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="space-y-6">
              {/* Type d'actif */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Type d'actif</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {assetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Région */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Région
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Criticité */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Niveau de criticité
                </label>
                <select
                  value={selectedCriticality}
                  onChange={(e) => setSelectedCriticality(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {criticalityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Filtres */}
            <div className="space-y-6">
              {/* Type d'actif */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Type d'actif</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {assetTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Région */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Région
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Criticité */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Niveau de criticité
                </label>
                <select
                  value={selectedCriticality}
                  onChange={(e) => setSelectedCriticality(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/30 dark:border-slate-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  {criticalityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statistiques par type */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Répartition par type</span>
              </h3>
              <div className="space-y-2">
                {assetTypes.slice(1).map((type) => {
                  const count = filteredAssets.filter(
                    (asset) => asset.type === type
                  ).length;
                  const total = filteredAssets.length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: assetColors[type as AssetType],
                          }}
                        ></div>
                        <span className="text-slate-600 dark:text-slate-400">
                          {type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {count}
                        </span>
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: assetColors[type as AssetType],
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="flex-1 relative">
          <MapContainer
            center={[5.6919, 10.2227]}
            zoom={7}
            style={{ height: "90%", width: "100%" }}
            className="z-0"
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Carte Standard">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Vue Satellite">
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution="Tiles &copy; Esri"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name="Relief">
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              </LayersControl.BaseLayer>
              

              {filteredAssets.map((asset) => (
                <Marker
                  key={asset.id}
                  position={asset.position}
                  icon={assetIcons[asset.type]}
                >
                  <Popup className="custom-popup">
                    <div className="p-4 min-w-[280px]">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">
                          {asset.name}
                        </h3>
                        <div className="flex space-x-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              asset.status
                            )}`}
                          >
                            {asset.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">
                            Type:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border`}
                            style={{
                              backgroundColor: `${assetColors[asset.type]}20`,
                              color: assetColors[asset.type],
                              borderColor: `${assetColors[asset.type]}40`,
                            }}
                          >
                            {asset.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">
                            Criticité:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCriticalityColor(
                              asset.criticality
                            )}`}
                          >
                            {asset.criticality}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">
                            ID:
                          </span>
                          <span className="text-sm text-slate-800 font-mono">
                            {asset.id}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">
                            Région:
                          </span>
                          <span className="text-sm text-slate-800">
                            {asset.region}
                          </span>
                        </div>

                        {asset.capacity && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Capacité:
                            </span>
                            <span className="text-sm text-slate-800 font-medium">
                              {asset.capacity}
                            </span>
                          </div>
                        )}

                        {asset.length && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Longueur:
                            </span>
                            <span className="text-sm text-slate-800 font-medium">
                              {asset.length}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600">
                              Dernière inspection:
                            </span>
                            <span className="text-sm text-slate-800">
                              {asset.lastInspection}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LayersControl>
          </MapContainer>

          {/* Légende moderne */}
          {showLegend && (
            <div className="absolute bottom-6 left-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/30 dark:border-slate-700/30 z-10 max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                  <Layers className="h-4 w-4" />
                  <span>Légende</span>
                </h3>
                <button
                  onClick={() => setShowLegend(false)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <EyeOff className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2">
                {assetTypes.slice(1).map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{
                        backgroundColor: assetColors[type as AssetType],
                      }}
                    ></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bouton pour réafficher la légende */}
          {!showLegend && (
            <button
              onClick={() => setShowLegend(true)}
              className="absolute bottom-6 left-6 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-900/90 rounded-xl shadow-xl border border-white/30 dark:border-slate-700/30 transition-all duration-200 z-10"
            >
              <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
