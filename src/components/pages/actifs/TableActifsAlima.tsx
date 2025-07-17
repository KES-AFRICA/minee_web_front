 
import { Pagination } from "antd";
import { Edit2, MapPin, Tag, Trash2 } from "lucide-react";
import type { Asset } from "./types";
import type { JSX } from "react";

export default function TableActifs({
  paginatedActifs,
  currentPage,
  handlePageChange,
  deleteAsset,
  getAssetIcon,
  filteredAssets,
  PAGE_SIZE = 5,
}: {
  paginatedActifs: Asset[];
  currentPage: number;
  handlePageChange: (page: number) => void;
  deleteAsset: (id: string) => void;
  getAssetIcon: (type: string) => JSX.Element;
  PAGE_SIZE?: number;
  filteredAssets: Asset[];
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actifs
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Localisation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Valeur
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Criticité
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Date d'inspection
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedActifs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Aucun actif trouvé
                </td>
              </tr>
            ) : (
              paginatedActifs.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {asset.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          • Code: {asset.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {asset.location}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Installé le {asset.installationDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        asset.status === "Actif"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                          : asset.status === "En maintenance"
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                          : asset.status === "Hors service"
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                          : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XAF",
                      maximumFractionDigits: 0,
                    }).format(asset.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-2.5 w-2.5 rounded-full mr-2 ${
                          asset.criticality === "Haute"
                            ? "bg-red-500"
                            : asset.criticality === "Moyenne"
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {asset.criticality}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    {asset.lastInspection}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {}}
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300"
                        title="Générer des étiquettes"
                      >
                        <Tag className="h-5 w-5" />
                      </button>
                      <button className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 p-4 rounded-b-xl border-t border-gray-200">
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={filteredAssets.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
