import { useState, useEffect } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Menu,
  X,
  Eye,
  EyeOff,
  Layers,
  BarChart3,
  Download,
  Maximize2,
  Settings,
  RefreshCw,
  Compass,
  Ruler,
  Bell,
} from "lucide-react";

import { useAssetFiltering } from "./hooks/useAssetFiltering";
import { FilterPanel } from "./components/FilterPanel";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { AssetMarkers } from "./components/AssetMarkers";
import type { Asset, MapViewState } from "./types";

const PANEL_TABS = [
  { id: "filters", label: "Filtres", icon: Menu },
  { id: "tools", label: "Outils", icon: Settings },
] as const;

type PanelTab = (typeof PANEL_TABS)[number]["id"];

export default function AssetMapPage() {
  const {
    filters,
    filteredAssets,
    updateFilter,
    resetFilters,
    getFilteredCount,
    getTotalCount,
  } = useAssetFiltering();

  const [activePanel, setActivePanel] = useState<PanelTab>("filters");
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [mapView, setMapView] = useState<MapViewState>({
    showHeatmap: false,
    showClusters: true,
    showMeasurements: false,
    selectedAssets: [],
    compareMode: false,
  });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates here
      console.log("Checking for real-time updates...");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    if (mapView.compareMode) {
      setMapView((prev) => ({
        ...prev,
        selectedAssets: prev.selectedAssets.includes(asset.id)
          ? prev.selectedAssets.filter((id) => id !== asset.id)
          : [...prev.selectedAssets.slice(0, 2), asset.id],
      }));
    }
  };

  const exportData = () => {
    const data = filteredAssets.map((asset) => ({
      ID: asset.id,
      Nom: asset.name,
      Type: asset.type,
      Statut: asset.status,
      Région: asset.region,
      Criticité: asset.criticality,
      "Dernière Inspection": asset.lastInspection,
      "Prochaine Maintenance": asset.nextMaintenance,
    }));

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `actifs-electriques-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const criticalAlerts = filteredAssets.reduce(
    (count, asset) =>
      count +
      (asset.alerts?.filter((alert) => alert.severity === "high").length || 0),
    0
  );

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : ""
      } bg-gradient-to-br w-full from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden`}
    >
      {/* Enhanced Header */}
      <motion.header
        className="relative z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Gestion des Actifs Électriques
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getFilteredCount()} actif
                    {getFilteredCount() > 1 ? "s" : ""} • {criticalAlerts}{" "}
                    alerte{criticalAlerts > 1 ? "s" : ""} critique
                    {criticalAlerts > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Real-time Status */}
              <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-white/30 dark:border-slate-700/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Temps réel
                  </span>
                </div>
                {criticalAlerts > 0 && (
                  <>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        {criticalAlerts} Alerte{criticalAlerts > 1 ? "s" : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportData}
                  className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-lg border border-white/30 dark:border-slate-700/30 transition-all duration-200"
                  title="Exporter les données"
                >
                  <Download className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-lg border border-white/30 dark:border-slate-700/30 transition-all duration-200"
                  title="Plein écran"
                >
                  <Maximize2 className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-lg border border-white/30 dark:border-slate-700/30 transition-all duration-200"
                >
                  {showSidebar ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex w-full h-[calc(100vh-88px)]">
        {" "}
        {/* Changed from flex-wrap to flex and w-[100%] to w-full */}
        {/* Enhanced Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-96 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl flex-shrink-0" /* Added flex-shrink-0 */
            >
              {/* Panel Tabs */}
              <div className="flex border-b border-white/20 dark:border-slate-700/20">
                {PANEL_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePanel(tab.id)}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                        activePanel === tab.id
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </div>
                      {activePanel === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Panel Content */}
              <div className="h-[calc(100%-53px)] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activePanel === "filters" && (
                      <FilterPanel
                        filters={filters}
                        onFilterChange={updateFilter}
                        onReset={resetFilters}
                        resultCount={getFilteredCount()}
                        totalCount={getTotalCount()}
                      />
                    )}


                    {activePanel === "tools" && (
                      <div className="p-6 space-y-6">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          Outils de Carte
                        </h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Mode Comparaison
                            </label>
                            <button
                              onClick={() =>
                                setMapView((prev) => ({
                                  ...prev,
                                  compareMode: !prev.compareMode,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                mapView.compareMode
                                  ? "bg-teal-600"
                                  : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  mapView.compareMode
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Groupement d'Actifs
                            </label>
                            <button
                              onClick={() =>
                                setMapView((prev) => ({
                                  ...prev,
                                  showClusters: !prev.showClusters,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                mapView.showClusters
                                  ? "bg-teal-600"
                                  : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  mapView.showClusters
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              Carte de Chaleur
                            </label>
                            <button
                              onClick={() =>
                                setMapView((prev) => ({
                                  ...prev,
                                  showHeatmap: !prev.showHeatmap,
                                }))
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                mapView.showHeatmap
                                  ? "bg-teal-600"
                                  : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  mapView.showHeatmap
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Actions Rapides
                          </h4>
                          <div className="space-y-2">
                            <button
                              onClick={() => window.location.reload()}
                              className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-lg transition-colors"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Actualiser les Données</span>
                            </button>

                            <button
                              onClick={exportData}
                              className="w-full flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-lg transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              <span>Exporter CSV</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Map Container */}
        <div className="flex-1 h-full relative border-amber-800 border-2">
          {" "}
          {/* Changed w-[100%] to h-full and removed unnecessary w-[100%] */}
          <MapContainer
            center={[5.6919, 10.2227]}
            zoom={
              7
            } /* Changed zoom from 70 to 7 for a more realistic initial view */
            style={{ height: "100%", width: "100%" }}
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
            </LayersControl>

            <AssetMarkers
              assets={filteredAssets}
              onAssetSelect={handleAssetSelect}
              selectedAssets={mapView.selectedAssets}
            />
          </MapContainer>
          {/* Enhanced Legend */}
          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="absolute bottom-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-xl shadow-2xl border border-white/30 dark:border-700/30 z-10 max-w-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>Légende</span>
                  </h3>
                  <button
                    onClick={() => setShowLegend(false)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  >
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { type: "Transformateur", color: "#0d9488", icon: "T" },
                    { type: "Ligne", color: "#0369a1", icon: "L" },
                    { type: "Poste", color: "#b45309", icon: "P" },
                    { type: "Compteur", color: "#7e22ce", icon: "C" },
                    { type: "Générateur", color: "#d97706", icon: "G" },
                  ].map((item) => (
                    <div
                      key={item.type}
                      className="flex items-center space-x-3"
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.icon}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Les actifs en alerte ont un indicateur rouge pulsant
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Show Legend Button */}
          {!showLegend && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowLegend(true)}
              className="absolute bottom-6 left-6 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-900 rounded-xl shadow-2xl border border-white/30 dark:border-slate-700/30 transition-all duration-200 z-10"
            >
              <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </motion.button>
          )}
          {/* Map Controls */}
          <div className="absolute top-6 right-6 space-y-2 z-10">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/30 dark:border-slate-700/30 p-2">
              <button
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors block"
                title="Boussole"
              >
                <Compass className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors block"
                title="Mesures"
              >
                <Ruler className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
