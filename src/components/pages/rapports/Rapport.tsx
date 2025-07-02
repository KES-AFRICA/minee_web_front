import { useState } from "react";
import {
  Download,
  Printer,
  FileText,
  PieChart,
  BarChart2,
  Filter,
  Calendar,
  ChevronDown,
  HardHat,
  Zap,
  Battery,
  Activity,
  MapPin,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState("last30days");
  const [assetTypeFilter, setAssetTypeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  // Données fictives pour les rapports
  const reportData = {
    summary: {
      totalAssets: 1245,
      active: 1120,
      maintenance: 85,
      outOfService: 40,
      value: 45200000000,
    },
    byType: [
      { type: "Transformateur", count: 245, value: 28000000000 },
      { type: "Ligne HT", count: 560, value: 12000000000 },
      { type: "Poste", count: 180, value: 4000000000 },
      { type: "Compteur", count: 260, value: 1200000000 },
    ],
    byRegion: [
      { region: "Littoral", count: 420, percentage: 34 },
      { region: "Centre", count: 380, percentage: 30 },
      { region: "Nord", count: 210, percentage: 17 },
      { region: "Sud", count: 150, percentage: 12 },
      { region: "Ouest", count: 85, percentage: 7 },
    ],
    recentReports: [
      {
        id: "RPT-2023-045",
        title: "Inventaire complet Q3 2023",
        date: "15/10/2023",
        type: "Inventaire",
        size: "2.4 MB",
      },
      {
        id: "RPT-2023-044",
        title: "Actifs critiques - Sept 2023",
        date: "30/09/2023",
        type: "Analyse",
        size: "1.8 MB",
      },
      {
        id: "RPT-2023-043",
        title: "Valeur patrimoniale Q3",
        date: "25/09/2023",
        type: "Financier",
        size: "3.2 MB",
      },
    ],
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Transformateur":
        return <Zap className="h-4 w-4 text-teal-600" />;
      case "Ligne HT":
        return <Activity className="h-4 w-4 text-blue-600" />;
      case "Poste":
        return <HardHat className="h-4 w-4 text-amber-600" />;
      case "Compteur":
        return <Battery className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            
                Rapports d'Inventaire
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Synthèse et analyse du patrimoine électrique ENEO
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors">
                <Download className="h-5 w-5" />
                <span>Exporter</span>
              </button>
              <button className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
                <Printer className="h-5 w-5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
       

        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Type de rapport
              </label>
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                <option value="inventory">Inventaire</option>
                <option value="financial">Financier</option>
                <option value="maintenance">Maintenance</option>
                <option value="analysis">Analyse</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="last30days">30 derniers jours</option>
                <option value="lastquarter">Dernier trimestre</option>
                <option value="lastyear">Année dernière</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <HardHat className="h-4 w-4" />
                Type d'actif
              </label>
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={assetTypeFilter}
                onChange={(e) => setAssetTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="transformer">Transformateurs</option>
                <option value="line">Lignes HT</option>
                <option value="station">Postes</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Région
              </label>
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="all">Toutes régions</option>
                <option value="littoral">Littoral</option>
                <option value="centre">Centre</option>
                <option value="north">Nord</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Actifs
              </h3>
              <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(reportData.summary.totalAssets)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Équipements enregistrés
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Valeur Totale
              </h3>
              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(reportData.summary.value)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Patrimoine électrique
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Actifs Actifs
              </h3>
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(reportData.summary.active)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              En service (
              {Math.round(
                (reportData.summary.active / reportData.summary.totalAssets) *
                  100
              )}
              %)
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                En Maintenance
              </h3>
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(reportData.summary.maintenance)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Actifs en intervention
            </p>
          </div>
        </div>

        {/* Rapport Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChart className="text-teal-600 dark:text-teal-400" />
              Répartition des Actifs par Type
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            <div className="lg:col-span-2">
              <div className="h-80 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center">
                <BarChart2 className="h-12 w-12 text-gray-400" />
                {/* Ici vous intégrerez votre graphique (Chart.js, Recharts, etc.) */}
              </div>
            </div>
            <div className="space-y-4">
              {reportData.byType.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getAssetIcon(item.type)}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {item.count}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rapports Secondaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par région */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="text-blue-600 dark:text-blue-400" />
                Répartition Géographique
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center mb-4">
                {/* Carte ou graphique des régions */}
                <span className="text-gray-500">
                  Visualisation cartographique
                </span>
              </div>
              <div className="space-y-3">
                {reportData.byRegion.map((region, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {region.region}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {region.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rapports récents */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="text-purple-600 dark:text-purple-400" />
                Rapports Récents
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {reportData.recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Généré le {report.date} • {report.type} • {report.size}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 p-1">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1">
                        <Printer className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 text-sm font-medium flex items-center gap-1">
                Voir tous les rapports
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
