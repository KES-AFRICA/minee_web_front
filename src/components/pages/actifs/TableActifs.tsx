import type { Actif } from "@/data";
import { Pagination } from "antd";
import {MapPin, Tag} from "lucide-react";
import { useState, type JSX } from "react";
import { ActifDetailsModal } from "./components/ActifDetailsModal";

export default function TableActifs({
  paginatedActifs,
  currentPage,
  handlePageChange,
  getAssetIcon,
  filteredActifs,
  PAGE_SIZE = 10,
}: {
  paginatedActifs: Actif[];
  currentPage: number;
  handlePageChange: (page: number) => void;
  getAssetIcon: (type: string) => JSX.Element;
  PAGE_SIZE?: number;
  filteredActifs: Actif[];
}) {
  const getEtat = (actif: Actif) => {
    if ('etatVisuel' in actif) {
      return actif.etatVisuel;
    }
    return 'Inconnu';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const [selectedActif, setSelectedActif] = useState<Actif | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actif
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Localisation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                État
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date Mise en Service
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedActifs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucun actif trouvé
                </td>
              </tr>
            ) : (
              paginatedActifs.map((actif) => (
                <tr
                  onClick={() => {
                    setSelectedActif(actif);
                    setIsModalOpen(true);
                  }}
                 key={actif.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                        {getAssetIcon(actif.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {actif.designationGenerale}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Code: {actif.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {actif.quartier}, {actif.commune}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {actif.region}, {actif.departement}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {actif.type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getEtat(actif) === "Bon"
                                ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                                : getEtat(actif) === "Moyen"
                                ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                                : getEtat(actif) === "Passable"
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                                : getEtat(actif) === "Mauvais"
                                ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                        }`}
                    >
                        {getEtat(actif)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(actif.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300">
                        <Tag className="h-5 w-5" />
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
          total={filteredActifs.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
      {isModalOpen && selectedActif && (
        <div>
          <ActifDetailsModal 
          actif={selectedActif} 
          isOpen={isModalOpen} 
          onClose={!isModalOpen ? () => {} : () => setIsModalOpen(false)}
           />
        </div>
      )}
    </div>
  );
}