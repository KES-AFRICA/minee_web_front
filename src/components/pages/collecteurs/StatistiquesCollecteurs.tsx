/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Users,
  Zap,
  TrendingUp,
  Shield,
  AlertTriangle,
  TrendingDown,
} from "lucide-react";

export default function StatistiquesCollecteurs({
  globalKPIs,
  filteredCollectors,
  getPerformanceColor,
}: {
  filteredCollectors: any[];
  getPerformanceColor: (value: number, type: string) => string;
  globalKPIs: any;
}) {
  return (
    <div>
      {/* KPIs principaux  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Collecteurs Actifs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Equipes Actifs
            </h3>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {/* lire le nombre dde collecteurs avec statut actif */}
              {filteredCollectors
                .filter((collector) => collector.status === "actif")
                .length.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sur {filteredCollectors.length} collecteurs
            </p>
            <div className="flex items-center gap-1 text-xs">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600"> {filteredCollectors.length} connectés</span>
            </div>
          </div>
        </div>

        {/* Équipements Inventoriés */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Équipements Inventoriés
            </h3>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
              <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {globalKPIs.equipements.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Objectif: {globalKPIs.equipementsAssignes.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-600">
                {globalKPIs.tauxCompletion.toFixed(1)}% complété
              </span>
            </div>
          </div>
        </div>

        {/* Taux de Conformité */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Precision de la collecte
            </h3>
            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
              <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p
              className={`text-2xl font-bold ${getPerformanceColor(
                globalKPIs.avgDataQuality,
                "quality"
              )}`}
            >
              {globalKPIs.avgDataQuality.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conformité: {globalKPIs.avgCompliance.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Incidents et Anomalies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Incidents Terrain
            </h3>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {globalKPIs.incidents}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Anomalies: {globalKPIs.anomalies}
            </p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-green-600">-15% vs période précédente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
