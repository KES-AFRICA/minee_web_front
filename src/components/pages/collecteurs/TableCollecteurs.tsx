/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Camera, Eye, Trash2, Edit2 } from "lucide-react";

export default function TableCollecteurs({
  paginatedCollectors,
  getPerformanceBadge,
  getPerformanceColor,
  getStatusBadge,
}: {
  paginatedCollectors: any[];
  getPerformanceBadge: (performance: string) => string;
  getPerformanceColor: (value: number, type: string) => string;
  getStatusBadge: (status: string) => string;
}) {
  return (
    <>
      {paginatedCollectors.length === 0 ? (
        <tr>
          <td
            colSpan={9}
            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            Aucune donnée disponible pour les filtres sélectionnés.
          </td>
        </tr>
      ) : (
        paginatedCollectors.map((collector) => (
          <tr
            key={collector.id}
            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* Collecteur Info */}
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {collector.nom
                      .split(" ")
                      .map((n: any[]) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {collector.nom}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {collector.matricule}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {collector.commune}
                  </div>
                </div>
              </div>
            </td>

            {/* Zone / Secteur */}
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900 dark:text-white font-medium">
                {collector.zone}
              </div>
            </td>

            {/* Performance */}
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPerformanceBadge(
                    collector.performance
                  )}`}
                >
                  {collector.performance}
                </span>
                <span
                  className={`text-sm font-bold ${getPerformanceColor(
                    collector.completionRate,
                    "completion"
                  )}`}
                >
                  {collector.completionRate.toFixed(1)}%
                </span>
              </div>
            </td>

            {/* Équipements */}
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {collector.equipementsCollectes}
                  <span className="text-xs text-gray-500">
                    / {collector.equipementsAssignes}
                  </span>
                </span>
                <div className="w-12 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{
                      width: `${
                        (collector.equipementsCollectes /
                          collector.equipementsAssignes) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </td>

            {/* Qualité */}
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <span
                  className={`text-sm font-bold ${getPerformanceColor(
                    collector.dataQualityScore,
                    "quality"
                  )}`}
                >
                  {collector.dataQualityScore.toFixed(1)}%
                </span>
                <div className="flex items-center gap-1">
                  <Camera className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {collector.photosValidated}/{collector.photosCaptured}
                  </span>
                </div>
              </div>
            </td>

            {/* Efficacité */}
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <span
                  className={`text-sm font-bold ${getPerformanceColor(
                    collector.rendementQuotidien,
                    "efficiency"
                  )}`}
                >
                  {collector.rendementQuotidien.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">équip./jour</span>
              </div>
            </td>

            {/* Statut */}
            <td className="px-6 py-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                    collector.status
                  )}`}
                >
                  {collector.status}
                </span>
              </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <button
                  className="p-1 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                  title="Voir détails"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </>
  );
}
