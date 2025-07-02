import { AlertCircle, DollarSign, TrendingUp, Users } from "lucide-react";
import type { JSX } from "react";

export default function Dashboard({
  totalAssets,
  totalValue,
  activeAssets,
  highCriticalityAssets,
  assetsByType,
  assetsByZone,
  getAssetIcon,
  formatCurrency,
}: {
  totalAssets: number;
  totalValue: number;
  activeAssets: number;
  highCriticalityAssets: number;
  assetsByType: Record<string, number>;
  assetsByZone: Record<string, number>;
  getAssetIcon: (type: string) => JSX.Element;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="space-y-6 mb-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Actifs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalAssets}
              </p>
            </div>
            <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Valeur Totale
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Actifs Actifs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeAssets}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {((activeAssets / totalAssets) * 100).toFixed(1)}% du parc
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Criticité Haute
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {highCriticalityAssets}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                Surveillance renforcée
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par Type
          </h3>
          <div className="space-y-3">
            {Object.entries(assetsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAssetIcon(type)}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${(count / totalAssets) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par Zone
          </h3>
          <div className="space-y-4">
            {Object.entries(assetsByZone).map(([zone, count]) => (
              <div key={zone} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {zone}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {count} actifs
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      zone === "Centre" ? "bg-blue-600" : "bg-teal-600"
                    }`}
                    style={{ width: `${(count / totalAssets) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {((count / totalAssets) * 100).toFixed(1)}% du parc total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
