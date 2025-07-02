import { useState, useMemo } from "react";
import {
  MapPin,
  Download,
  Calendar,
  Users,
  Gauge,
  Activity,
  Search,
  MapIcon,
  Dot,
} from "lucide-react";
import {
  communesData,
  fieldCollectors,
  monthNames,
} from "../../../data/collecteurs";
import { Pagination } from "antd";
import StatistiquesCollecteurs from "./StatistiquesCollecteurs";
import TableCollecteurs from "./TableCollecteurs";

type RegionKey = keyof typeof communesData;
const PAGE_SIZE = 5;
export default function CollectorPerformance() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState("month");
  const [regionFilter, setRegionFilter] = useState("all");
  const [communeFilter, setCommuneFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage des données
  const filteredCollectors = useMemo(() => {
    return fieldCollectors.filter((collector) => {
      const regionMatch =
        regionFilter === "all" || collector.region === regionFilter;
      const communeMatch =
        communeFilter === "all" || collector.commune === communeFilter;
      const performanceMatch =
        performanceFilter === "all" ||
        collector.performance === performanceFilter;
      const searchMatch =
        searchTerm === "" ||
        collector.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collector.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collector.commune.toLowerCase().includes(searchTerm.toLowerCase());

      return regionMatch && communeMatch && performanceMatch && searchMatch;
    });
  }, [regionFilter, communeFilter, performanceFilter, searchTerm]);

  // Pagination
  const paginatedCollectors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCollectors.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredCollectors]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Calcul des KPIs globaux
  const globalKPIs = useMemo(() => {
    const total = filteredCollectors.reduce(
      (acc, collector) => ({
        equipements: acc.equipements + collector.equipementsCollectes,
        equipementsAssignes:
          acc.equipementsAssignes + collector.equipementsAssignes,
        incidents: acc.incidents + collector.incidents,
        anomalies: acc.anomalies + collector.anomalies,
        reparations: acc.reparations + collector.reparations,
        kmTotal: acc.kmTotal + collector.kmParcourus,
        carburant: acc.carburant + collector.consommationCarburant,
        heuresSupp: acc.heuresSupp + collector.overtimeHours,
        coutTotal: acc.coutTotal + collector.cout,
        photos: acc.photos + collector.photosCaptured,
        photosValidees: acc.photosValidees + collector.photosValidated,
        issuesResolues: acc.issuesResolues + collector.issuesResolues,
        maintenance: acc.maintenance + collector.maintenancePreventive,
        urgences: acc.urgences + collector.urgences,
        rapports: acc.rapports + collector.rapportsGeneres,
      }),
      {
        equipements: 0,
        equipementsAssignes: 0,
        incidents: 0,
        anomalies: 0,
        reparations: 0,
        kmTotal: 0,
        carburant: 0,
        heuresSupp: 0,
        coutTotal: 0,
        photos: 0,
        photosValidees: 0,
        issuesResolues: 0,
        maintenance: 0,
        urgences: 0,
        rapports: 0,
      }
    );

    const avgCompletion =
      filteredCollectors.reduce((sum, c) => sum + c.completionRate, 0) /
      filteredCollectors.length;
    const avgAccuracy =
      filteredCollectors.reduce((sum, c) => sum + c.accuracy, 0) /
      filteredCollectors.length;
    const avgTime =
      filteredCollectors.reduce((sum, c) => sum + c.avgTimePerAsset, 0) /
      filteredCollectors.length;
    const avgEfficiency =
      filteredCollectors.reduce((sum, c) => sum + c.rendementQuotidien, 0) /
      filteredCollectors.length;
    const avgDataQuality =
      filteredCollectors.reduce((sum, c) => sum + c.dataQualityScore, 0) /
      filteredCollectors.length;
    const avgCompliance =
      filteredCollectors.reduce((sum, c) => sum + c.compliance, 0) /
      filteredCollectors.length;
    const avgGpsSignal =
      filteredCollectors.reduce((sum, c) => sum + c.gpsSignal, 0) /
      filteredCollectors.length;
    const avgConnexion =
      filteredCollectors.reduce((sum, c) => sum + c.tempsConnexion, 0) /
      filteredCollectors.length;

    return {
      ...total,
      avgCompletion,
      avgAccuracy,
      avgTime,
      avgEfficiency,
      avgDataQuality,
      avgCompliance,
      avgGpsSignal,
      avgConnexion,
      tauxCompletion: (total.equipements / total.equipementsAssignes) * 100,
      photoValidationRate: (total.photosValidees / total.photos) * 100,
      kmParEquipement: total.kmTotal / total.equipements,
    };
  }, [filteredCollectors]);

  const getPerformanceColor = (value: number, type: string) => {
    switch (type) {
      case "completion":
        return value >= 90
          ? "text-green-600"
          : value >= 80
          ? "text-yellow-600"
          : "text-red-600";
      case "accuracy":
        return value >= 90
          ? "text-green-600"
          : value >= 80
          ? "text-yellow-600"
          : "text-red-600";
      case "efficiency":
        return value >= 30
          ? "text-green-600"
          : value >= 25
          ? "text-yellow-600"
          : "text-red-600";
      case "quality":
        return value >= 95
          ? "text-green-600"
          : value >= 85
          ? "text-yellow-600"
          : "text-red-600";
      case "signal":
        return value >= 90
          ? "text-green-600"
          : value >= 70
          ? "text-yellow-600"
          : "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactif":
        return "bg-red-100 text-red-800 border-red-200";
      case "pause":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "bon":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "acceptable":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "amélioration":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Définir le mois et l'année courants en temps reel
  const date = new Date();
  const currentMonth = monthNames[date.getMonth()];
  const currentYear = date.getFullYear();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Activity className="text-teal-600 dark:text-teal-400" />
                Performance des Collecteurs
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Suivi et analyse des indicateurs clés des équipes terrain
              </p>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 dark:text-gray-400 text-gray-600">
                <Calendar className="h-4 w-4" />
                Période: {currentMonth} {currentYear}
              </span>
              <span className="flex items-center gap-1 dark:text-gray-400 text-gray-600">
                <Users className="h-4 w-4" />
                {filteredCollectors
                  .filter((collector) => collector.status === "actif")
                  .length.toLocaleString()}{" "}
                Collecteurs actifs
                <Dot className="h-2 w-2 bg-green-500 rounded-full" />
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher collecteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white w-64"
              />
            </div>
            <button className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Download className="h-5 w-5" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Contrôles et filtres avancés */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4  ">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Période
            </label>
            <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="day">Journaliere</option>
              <option value="week">Hebdomadaire</option>
              <option value="month">Mensuelle</option>
              <option value="quarter">Trismestielle</option>
              <option value="year">Annee</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Région
            </label>
            <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCommuneFilter("all");
              }}
            >
              <option value="all">Toutes régions</option>
              <option value="centre">Centre</option>
              <option value="littoral">Littoral</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <MapIcon className="h-4 w-4" />
              Commune
            </label>
            <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              disabled={regionFilter === "all"}
            >
              <option value="all">Toutes communes</option>
              {regionFilter !== "all" &&
                communesData[regionFilter as RegionKey]?.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              Performance
            </label>
            <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
            >
              <option value="all">Tous niveaux</option>
              <option value="excellent">Excellent (≥90%)</option>
              <option value="bon">Bon (80-89%)</option>
              <option value="acceptable">Acceptable (70-79%)</option>
              <option value="amélioration">À améliorer (&lt;70%)</option>
            </select>
          </div>
        </div>

        <StatistiquesCollecteurs
          filteredCollectors={filteredCollectors}
          getPerformanceColor={getPerformanceColor}
          globalKPIs={globalKPIs}
        />

        {/* Liste détaillée des collecteurs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Collecteur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Zone / Secteur
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Équipements
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Qualité
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Efficacité
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <TableCollecteurs
                  paginatedCollectors={paginatedCollectors}
                  getPerformanceBadge={getPerformanceBadge}
                  getPerformanceColor={getPerformanceColor}
                  getStatusBadge={getStatusBadge}
                />
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4 p-4 bg-teal-800/25 dark:bg-teal-900/20 rounded-b-xl">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredCollectors.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
