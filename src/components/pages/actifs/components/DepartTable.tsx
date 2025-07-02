import type { Actif, Depart } from "@/types";
import { GitBranch, Tag } from "lucide-react";

export // Nouveau composant pour le tableau des départs
function DepartTable({
  departs,
  // actifs,
  selectedDepart,
  setSelectedDepart,
  onOpenDetails,
}: 
{
  departs: Depart[];
  actifs: Actif[];
  selectedDepart: string;
  setSelectedDepart: (id: string) => void;
  onOpenDetails: (id: string) => void;
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
                Départ
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Poste Origine
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Régions
              </th>
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
                Longueur (km)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                VNC (Fcfa)
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {departs.map((depart) => (
              <tr
                key={depart.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  selectedDepart === depart.id
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : ""
                }`}
                onClick={() => {
                  setSelectedDepart(depart.id);
                  onOpenDetails(depart.id);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <GitBranch className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {depart.nom}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {depart.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {depart.posteOrigine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {depart.zonesGeographiques.regions.join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {depart.zonesGeographiques.departements.join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {depart.actifs.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {depart.longueurTotale}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      depart.etatGeneral === "En service"
                        ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                        : depart.etatGeneral === "Hors service"
                        ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                        : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {depart.etatGeneral}
                  </span> */}
                  {depart.valorisation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300">
                        <Tag className="h-5 w-5" />
                      </button>
                      
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}