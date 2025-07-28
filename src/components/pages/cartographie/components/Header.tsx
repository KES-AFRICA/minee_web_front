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
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useMapStore } from "@/store/mapStore.ts";
import { natureDeBien, TypeDeBien, types } from "@/types";
import { TypeFilters } from "@/sig/Header/TypeFilters";

// Hook personnalisé pour gérer les dropdowns
const useDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => setOpenDropdown(null);

  return { openDropdown, toggleDropdown, closeDropdown };
};

// Composant FilterDropdown réutilisable
interface FilterDropdownProps {
  name: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount: number;
  placeholder: string;
  children: React.ReactNode;
  className?: string;
  colorScheme?: 'blue' | 'orange' | 'green' | 'purple';
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  selectedCount,
  placeholder,
  children,
  className = "",
  colorScheme = 'blue'
}) => {
  const colors = {
    blue: {
      active: "bg-blue-50 border-blue-200 text-blue-700",
      focus: "text-blue-600 focus:ring-blue-500"
    },
    orange: {
      active: "bg-orange-50 border-orange-200 text-orange-700",
      focus: "text-orange-600 focus:ring-orange-500"
    },
    green: {
      active: "bg-green-50 border-green-200 text-green-700",
      focus: "text-green-600 focus:ring-green-500"
    },
    purple: {
      active: "bg-purple-50 border-purple-200 text-purple-700",
      focus: "text-purple-600 focus:ring-purple-500"
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:shadow-md ${selectedCount > 0
            ? colors[colorScheme].active
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }`}
      >
        {icon}
        <span className="text-sm font-medium">
          {selectedCount > 0
            ? `${selectedCount} ${title.toLowerCase()}${selectedCount > 1 ? "s" : ""}`
            : placeholder}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

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
    loading,

    // Départs
    departs,
    selectedDepart,
    setSelectedDepart,
    centerOnDepart,
    getDepartStatistics,
  } = useMapStore();

  const { openDropdown, toggleDropdown, closeDropdown } = useDropdown();
  const headerRef = useRef<HTMLDivElement>(null);

  // Fermer les dropdowns quand on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

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

  const hasActiveFilters = () => {
    return (
      filters.types.length > 0 ||
      filters.regions.length > 0 ||
      filters.etatVisuel.length > 0 ||
      filters.typeDeBien.length > 0 ||
      filters.natureDuBien.length > 0 ||
      filters.etatFonctionnement.length > 0 ||
      searchTerm.length > 0
    );
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
    <header ref={headerRef} className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Search - Amélioré */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un actif, ville, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md bg-gray-50 focus:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtres dans un conteneur scrollable */}
            <div className="flex items-center space-x-3 overflow-x-auto pb-1 flex-1 min-w-0">
              {/* Region Filter */}
              <FilterDropdown
                name="regions"
                title="région"
                icon={<Globe className="w-4 h-4" />}
                isOpen={openDropdown === "regions"}
                onToggle={() => toggleDropdown("regions")}
                selectedCount={filters.regions.length}
                placeholder="Toutes les régions"
                colorScheme="blue"
                className="flex-shrink-0"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Filtrer par région</h3>
                    {filters.regions.length > 0 && (
                      <button
                        onClick={() => {
                          handleFilterChange("regions", []);
                          closeDropdown();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {regions.map((region) => (
                    <label
                      key={region}
                      className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.regions.includes(region)}
                        onChange={() => handleMultiSelectFilter("regions", region)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {region}
                      </span>
                      {filters.regions.includes(region) && (
                        <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </FilterDropdown>

              {/* Nature de Bien Filter */}
              <FilterDropdown
                name="natureBien"
                title="nature"
                icon={<Navigation2 className="w-4 h-4" />}
                isOpen={openDropdown === "natureBien"}
                onToggle={() => toggleDropdown("natureBien")}
                selectedCount={filters.natureDuBien.length}
                placeholder="Nature de bien"
                colorScheme="purple"
                className="flex-shrink-0"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Nature de bien</h3>
                    {filters.natureDuBien.length > 0 && (
                      <button
                        onClick={() => {
                          handleFilterChange("natureDuBien", []);
                          closeDropdown();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {natureDeBien.map((nature) => (
                    <label
                      key={nature}
                      className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.natureDuBien.includes(nature)}
                        onChange={() => handleMultiSelectFilter("natureDuBien", nature)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {nature}
                      </span>
                      {filters.natureDuBien.includes(nature) && (
                        <CheckCircle className="w-4 h-4 text-purple-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </FilterDropdown>

              {/* Type de Bien Filter */}
              <FilterDropdown
                name="typeBien"
                title="type"
                icon={<Navigation className="w-4 h-4" />}
                isOpen={openDropdown === "typeBien"}
                onToggle={() => toggleDropdown("typeBien")}
                selectedCount={filters.typeDeBien.length}
                placeholder="Type de bien"
                colorScheme="blue"
                className="flex-shrink-0"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Type de bien</h3>
                    {filters.typeDeBien.length > 0 && (
                      <button
                        onClick={() => {
                          handleFilterChange("typeDeBien", []);
                          closeDropdown();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
                <div className="py-2 max-h-64 overflow-y-auto">
                  {TypeDeBien.map((type) => (
                    <label
                      key={type}
                      className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.typeDeBien.includes(type)}
                        onChange={() => handleMultiSelectFilter("typeDeBien", type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {type}
                      </span>
                      {filters.typeDeBien.includes(type) && (
                        <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </label>
                  ))}
                </div>
              </FilterDropdown>

              {/* État Visuel Filter */}
              <FilterDropdown
                name="etatVisuel"
                title="état"
                icon={<Activity className="w-4 h-4" />}
                isOpen={openDropdown === "etatVisuel"}
                onToggle={() => toggleDropdown("etatVisuel")}
                selectedCount={filters.etatVisuel.length}
                placeholder="État visuel"
                colorScheme="orange"
                className="flex-shrink-0"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">État visuel</h3>
                    {filters.etatVisuel.length > 0 && (
                      <button
                        onClick={() => {
                          handleFilterChange("etatVisuel", []);
                          closeDropdown();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
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
                      className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.etatVisuel.includes(etat)}
                        onChange={() => handleMultiSelectFilter("etatVisuel", etat)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors"
                      />
                      <span
                        className={`ml-3 text-sm flex items-center group-hover:font-medium ${etat === "Bon"
                            ? "text-green-700"
                            : etat === "Moyen"
                              ? "text-yellow-700"
                              : etat === "Passable"
                                ? "text-orange-700"
                                : "text-red-700"
                          }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full mr-2 ${etat === "Bon"
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
              </FilterDropdown>

              {/* Depart Selector */}
              <FilterDropdown
                name="depart"
                title="départ"
                icon={<Zap className="w-4 h-4" />}
                isOpen={openDropdown === "depart"}
                onToggle={() => toggleDropdown("depart")}
                selectedCount={selectedDepart ? 1 : 0}
                placeholder="Sélectionner un départ"
                colorScheme="green"
                className="flex-shrink-0"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Départs disponibles</h3>
                    {selectedDepart && (
                      <button
                        onClick={() => {
                          setSelectedDepart(null);
                          closeDropdown();
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        <span>Tout afficher</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="py-2 max-h-80 overflow-y-auto">
                  {departs.map((depart) => {
                    const departStats = getDepartStatistics(depart.id);
                    const isSelected = selectedDepart === depart.id;

                    return (
                      <div
                        key={depart.id}
                        className={`px-4 py-3 cursor-pointer transition-all duration-200 ${isSelected
                            ? "bg-green-50 border-l-4 border-green-500 shadow-sm"
                            : "hover:bg-gray-50"
                          }`}
                        onClick={() => {
                          setSelectedDepart(isSelected ? null : depart.id);
                          if (!isSelected) {
                            centerOnDepart(depart.id);
                          }
                          closeDropdown();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-sm text-gray-900">
                                {depart.nom}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${depart.etatGeneral === "En service"
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
                                <span className="font-medium text-gray-800">
                                  {depart.typeDepart}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tension:</span>
                                <span className="font-medium text-gray-800">
                                  {depart.tension.toLocaleString()}V
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Actifs:</span>
                                <span className="font-medium text-gray-800">
                                  {departStats?.nombreActifs || 0}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Longueur:</span>
                                <span className="font-medium text-gray-800">
                                  {depart.longueurTotale}km
                                </span>
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin className="inline w-3 h-3 mr-1" />
                              {depart.zonesGeographiques.communes
                                .slice(0, 2)
                                .join(", ")}
                              {depart.zonesGeographiques.communes.length > 2 && "..."}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="ml-3 flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </FilterDropdown>
            </div>

            {/* Quick Stats - Améliorés */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800 font-semibold text-sm">{stats.total}</span>
                <span className="text-blue-600 text-sm">actifs</span>
                {loading && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
              </div>

              {selectedDepart && selectedDepartStats && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-semibold text-sm">
                    {selectedDepartStats.nombreActifs}
                  </span>
                  <span className="text-green-600 text-sm">dans le départ</span>
                </div>
              )}

              {selectedActifs.length > 0 && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-800 font-semibold text-sm">
                    {selectedActifs.length}
                  </span>
                  <span className="text-purple-600 text-sm">sélectionnés</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-medium">Réinitialiser</span>
              </button>
            )}

            {/* Export Button */}
            {selectedActifs.length > 0 && (
              <FilterDropdown
                name="export"
                title="export"
                icon={<Download className="w-4 h-4" />}
                isOpen={openDropdown === "export"}
                onToggle={() => toggleDropdown("export")}
                selectedCount={0}
                placeholder={`Exporter (${selectedActifs.length})`}
                className="flex-shrink-0"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide border-b border-gray-100">
                    Formats d'export
                  </div>
                  {[
                    { format: "csv", icon: FileSpreadsheet, label: "CSV", color: "text-green-600", desc: "Format tableur standard" },
                    { format: "json", icon: FileText, label: "JSON", color: "text-blue-600", desc: "Format de données structurées" },
                    { format: "excel", icon: FileSpreadsheet, label: "Excel", color: "text-emerald-600", desc: "Format Microsoft Excel" }
                  ].map(({ format, icon: Icon, label, color, desc }) => (
                    <button
                      key={format}
                      onClick={() => {
                        exportSelection(format);
                        closeDropdown();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors group"
                    >
                      <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
                      <div>
                        <div className="font-medium group-hover:text-gray-900">Exporter en {label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </FilterDropdown>
            )}
          </div>
        </div>

        {/* Type Filters Row */}
        <div className="mt-4">
          <TypeFilters
            selectedDepart={selectedDepart}
            setSelectedDepart={setSelectedDepart}
          />
        </div>
      </div>

      {/* Selected Depart Info Bar - Amélioré */}
      {selectedDepart && selectedDepartInfo && selectedDepartStats && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900 text-lg">
                  {selectedDepartInfo.nom}
                </span>
                <span className="text-green-600">•</span>
                <span className="text-green-700 font-medium">
                  {selectedDepartInfo.typeDepart}
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                {[
                  { label: "Tension", value: `${selectedDepartInfo.tension.toLocaleString()}V` },
                  { label: "Actifs", value: selectedDepartStats.nombreActifs },
                  { label: "Longueur", value: `${selectedDepartInfo.longueurTotale}km` },
                  { label: "Valorisation", value: `${selectedDepartStats.valorisationTotale.toLocaleString()}€` }
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-lg backdrop-blur-sm border border-green-200/50">
                    <span className="text-green-600 font-medium">{label}:</span>
                    <span className="text-green-800 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedDepart(null)}
              className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-white/50 transition-all duration-200 hover:shadow-md"
              title="Fermer la sélection du départ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;