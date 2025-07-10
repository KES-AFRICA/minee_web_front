import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Download,
  X,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Eye,
  BarChart3,
  Zap,
  MapPin,
  Activity,
  Globe,
  CheckCircle,
  Navigation2,
  Navigation,
} from "lucide-react";
import { useMapStore } from "@/store/mapStore.ts";
import { natureDeBien, TypeDeBien, types } from "@/types";

const Header: React.FC = () => {
  const {
    // Actifs
    filters,
    setFilters,
    applyFilters,
    selectedActifs,
    exportSelection,
    searchTerm,
    setSearchTerm,
    filteredActifs,

    // Départs
    departs,
    selectedDepart,
    setSelectedDepart,
    centerOnDepart,
    getDepartStatistics,
  } = useMapStore();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showDepartDropdown, setShowDepartDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showEtatDropdown, setShowEtatDropdown] = useState(false);
  const [showTypeBienDropdown, setShowTypeBienDropdown] = useState(false);
  const [showNatureBienDropdown, setShowNatureBienDropdown] = useState(false);


  const exportMenuRef = useRef<HTMLDivElement>(null);
  const departDropdownRef = useRef<HTMLDivElement>(null);
  const regionDropdownRef = useRef<HTMLDivElement>(null);
  const etatDropdownRef = useRef<HTMLDivElement>(null);
  const typeBienDropdownRef = useRef<HTMLDivElement>(null);
  const natureBienDropdownRef = useRef<HTMLDivElement>(null);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
      if (
        departDropdownRef.current &&
        !departDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDepartDropdown(false);
      }
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowRegionDropdown(false);
      }
      if (
        typeBienDropdownRef.current &&
        !typeBienDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTypeBienDropdown(false);
      }
      if (
        natureBienDropdownRef.current &&
        !natureBienDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNatureBienDropdown(false);
      }
      if (
        etatDropdownRef.current &&
        !etatDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEtatDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters({ [key]: value });
    applyFilters();
  };

  const handleMultiSelectFilter = (key: string, value: string) => {
    const currentValues = filters[key as keyof typeof filters] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    handleFilterChange(key, newValues);
  };

  const clearAllFilters = () => {
    setFilters({
      types: [],
      regions: [],
      etatVisuel: [],
      typeDeBien: [],
      natureDuBien: [],
      etatFonctionnement: [],
      anneeMiseEnService: { min: 2000, max: 2024 },
    });
    applyFilters();
  };

  const regions = ["Centre", "Littoral", "Ouest", "Nord", "Sud"];
  const etatsVisuels = ["Bon", "Moyen", "Passable", "Mauvais"];

  // Calculate statistics
  const stats = {
    total: filteredActifs.length,
    byType: types.reduce((acc, type) => {
      acc[type.value] = filteredActifs.filter(
        (a) => a.type === type.value
      ).length;
      return acc;
    }, {} as Record<string, number>),
    byState: etatsVisuels.reduce((acc, state) => {
      acc[state] = filteredActifs.filter((a) => a.etatVisuel === state).length;
      return acc;
    }, {} as Record<string, number>),
  };

  // Get selected depart info
  const selectedDepartInfo = selectedDepart
    ? departs.find((d) => d.id === selectedDepart)
    : null;
  const selectedDepartStats = selectedDepart
    ? getDepartStatistics(selectedDepart)
    : null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Region Filter Dropdown */}
            <div className="relative" ref={regionDropdownRef}>
              <button
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                  filters.regions.length > 0
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filters.regions.length > 0
                    ? `${filters.regions.length} région${
                        filters.regions.length > 1 ? "s" : ""
                      }`
                    : "Toutes les régions"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showRegionDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showRegionDropdown && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Filtrer par région
                      </h3>
                      {filters.regions.length > 0 && (
                        <button
                          onClick={() => {
                            handleFilterChange("regions", []);
                            setShowRegionDropdown(false);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Effacer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="py-2">
                    {regions.map((region) => (
                      <label
                        key={region}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.regions.includes(region)}
                          onChange={() =>
                            handleMultiSelectFilter("regions", region)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {region}
                        </span>
                        {filters.regions.includes(region) && (
                          <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* type de bien Filter Dropdown */}
            <div className="relative" ref={natureBienDropdownRef}>
              <button
                onClick={() =>
                  setShowNatureBienDropdown(!showNatureBienDropdown)
                }
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                  filters.natureDuBien.length > 0
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Navigation2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filters.natureDuBien.length > 0
                    ? `${filters.natureDuBien.length} type de bien${
                        filters.natureDuBien.length > 1 ? "s" : ""
                      }`
                    : "Toutes les nature de bien"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showNatureBienDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showNatureBienDropdown && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Filtrer par Nature de Bien
                      </h3>
                      {filters.natureDuBien.length > 0 && (
                        <button
                          onClick={() => {
                            handleFilterChange("natureDuBien", []);
                            setShowTypeBienDropdown(false);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Effacer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="py-2">
                    {natureDeBien.map((tb) => (
                      <label
                        key={tb}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.natureDuBien.includes(tb)}
                          onChange={() =>
                            handleMultiSelectFilter("natureDuBien", tb)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{tb}</span>
                        {filters.natureDuBien.includes(tb) && (
                          <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* type de bien Filter Dropdown */}
            <div className="relative" ref={typeBienDropdownRef}>
              <button
                onClick={() => setShowTypeBienDropdown(!showTypeBienDropdown)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                  filters.typeDeBien.length > 0
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Navigation className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filters.typeDeBien.length > 0
                    ? `${filters.typeDeBien.length} type de bien${
                        filters.typeDeBien.length > 1 ? "s" : ""
                      }`
                    : "Tous les type de bien"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showTypeBienDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showTypeBienDropdown && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Filtrer par Type de Bien
                      </h3>
                      {filters.typeDeBien.length > 0 && (
                        <button
                          onClick={() => {
                            handleFilterChange("typeDeBien", []);
                            setShowTypeBienDropdown(false);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Effacer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="py-2">
                    {TypeDeBien.map((tb) => (
                      <label
                        key={tb}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.typeDeBien.includes(tb)}
                          onChange={() =>
                            handleMultiSelectFilter("typeDeBien", tb)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">{tb}</span>
                        {filters.typeDeBien.includes(tb) && (
                          <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* État Visuel Filter Dropdown */}
            <div className="relative" ref={etatDropdownRef}>
              <button
                onClick={() => setShowEtatDropdown(!showEtatDropdown)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                  filters.etatVisuel.length > 0
                    ? "bg-orange-50 border-orange-200 text-orange-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filters.etatVisuel.length > 0
                    ? `${filters.etatVisuel.length} état${
                        filters.etatVisuel.length > 1 ? "s" : ""
                      }`
                    : "Tous les états"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showEtatDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showEtatDropdown && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Filtrer par état
                      </h3>
                      {filters.etatVisuel.length > 0 && (
                        <button
                          onClick={() => {
                            handleFilterChange("etatVisuel", []);
                            setShowEtatDropdown(false);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Effacer
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="py-2">
                    {etatsVisuels.map((etat) => (
                      <label
                        key={etat}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.etatVisuel.includes(etat)}
                          onChange={() =>
                            handleMultiSelectFilter("etatVisuel", etat)
                          }
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span
                          className={`ml-3 text-sm flex items-center ${
                            etat === "Bon"
                              ? "text-green-700"
                              : etat === "Moyen"
                              ? "text-yellow-700"
                              : etat === "Passable"
                              ? "text-orange-700"
                              : "text-red-700"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              etat === "Bon"
                                ? "bg-green-500"
                                : etat === "Moyen"
                                ? "bg-yellow-500"
                                : etat === "Passable"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          {etat}
                        </span>
                        {filters.etatVisuel.includes(etat) && (
                          <CheckCircle className="w-4 h-4 text-orange-600 ml-auto" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Depart Selector */}
            <div className="relative" ref={departDropdownRef}>
              <button
                onClick={() => setShowDepartDropdown(!showDepartDropdown)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg border transition-all ${
                  selectedDepart
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedDepartInfo
                    ? selectedDepartInfo.nom
                    : "Sélectionner un départ"}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showDepartDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDepartDropdown && (
                <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        Sélectionner un Départ
                      </h3>
                      {selectedDepart && (
                        <button
                          onClick={() => {
                            setSelectedDepart(null);
                            setShowDepartDropdown(false);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Tout afficher</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Depart List */}
                  <div className="py-2">
                    {departs.map((depart) => {
                      const departStats = getDepartStatistics(depart.id);
                      const isSelected = selectedDepart === depart.id;

                      return (
                        <div
                          key={depart.id}
                          className={`px-4 py-3 cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setSelectedDepart(isSelected ? null : depart.id);
                            if (!isSelected) {
                              centerOnDepart(depart.id);
                            }
                            setShowDepartDropdown(false);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-sm text-gray-900">
                                  {depart.nom}
                                </h4>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    depart.etatGeneral === "En service"
                                      ? "bg-green-100 text-green-800"
                                      : depart.etatGeneral === "Maintenance"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {depart.etatGeneral}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                                <div className="flex justify-between">
                                  <span>Type:</span>
                                  <span className="font-medium">
                                    {depart.typeDepart}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tension:</span>
                                  <span className="font-medium">
                                    {depart.tension.toLocaleString()}V
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Actifs:</span>
                                  <span className="font-medium">
                                    {departStats?.nombreActifs || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Longueur:</span>
                                  <span className="font-medium">
                                    {depart.longueurTotale}km
                                  </span>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                <MapPin className="inline w-3 h-3 mr-1" />
                                {depart.zonesGeographiques.communes
                                  .slice(0, 2)
                                  .join(", ")}
                                {depart.zonesGeographiques.communes.length >
                                  2 && "..."}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="ml-3 flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 rounded-lg">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-medium">{stats.total}</span>
                <span className="text-blue-600">actifs</span>
              </div>

              {selectedDepart && selectedDepartStats && (
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 rounded-lg">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">
                    {selectedDepartStats.nombreActifs}
                  </span>
                  <span className="text-green-600">dans le départ</span>
                </div>
              )}

              {selectedActifs.length > 0 && (
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 rounded-lg">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">
                    {selectedActifs.length}
                  </span>
                  <span className="text-purple-600">sélectionnés</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Export */}
          {selectedActifs.length > 0 && (
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Exporter ({selectedActifs.length})
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-55 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide border-b border-gray-100">
                      Formats d'export
                    </div>
                    <button
                      onClick={() => {
                        exportSelection("csv");
                        setShowExportMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-green-50 flex items-center space-x-3 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium">Exporter en CSV</div>
                        <div className="text-xs text-gray-500">
                          Format tableur standard
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        exportSelection("json");
                        setShowExportMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Exporter en JSON</div>
                        <div className="text-xs text-gray-500">
                          Format de données structurées
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        exportSelection("excel");
                        setShowExportMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 flex items-center space-x-3 transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Exporter en Excel</div>
                        <div className="text-xs text-gray-500">
                          Format Microsoft Excel
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Type Filters Row */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {types.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center group cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.value)}
                    onChange={() =>
                      handleMultiSelectFilter("types", type.value)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                    <span className={`mr-2 ${type.color}`}>{type.icon}</span>
                    {type.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Clear Filters */}
            {(filters.types.length > 0 ||
              filters.regions.length > 0 ||
              filters.etatVisuel.length > 0 ||
              selectedDepart) && (
              <button
                onClick={() => {
                  clearAllFilters();
                  setSelectedDepart(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Effacer tous les filtres</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Depart Info Bar */}
      {selectedDepart && selectedDepartInfo && selectedDepartStats && (
        <div className="bg-green-50 border-t border-green-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedDepartInfo.nom}
                </span>
                <span className="text-green-600">•</span>
                <span className="text-green-700">
                  {selectedDepartInfo.typeDepart}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-sm text-green-700">
                <div>
                  <span className="text-green-600">Tension:</span>
                  <span className="font-medium ml-1">
                    {selectedDepartInfo.tension.toLocaleString()}V
                  </span>
                </div>
                <div>
                  <span className="text-green-600">Actifs:</span>
                  <span className="font-medium ml-1">
                    {selectedDepartStats.nombreActifs}
                  </span>
                </div>
                <div>
                  <span className="text-green-600">Longueur:</span>
                  <span className="font-medium ml-1">
                    {selectedDepartInfo.longueurTotale}km
                  </span>
                </div>
                <div>
                  <span className="text-green-600">Valorisation:</span>
                  <span className="font-medium ml-1">
                    {selectedDepartStats.valorisationTotale.toLocaleString()}€
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDepart(null)}
              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
