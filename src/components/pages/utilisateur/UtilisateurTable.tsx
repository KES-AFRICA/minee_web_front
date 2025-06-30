import { Ban, Edit2 } from "lucide-react";
import type { User } from "./types";
import { Pagination } from "antd";

export default function UtilisateurTable({
  paginatedUsers,
  currentPage,
  handlePageChange,
  deleteUser,
  filteredUsers,
  PAGE_SIZE = 10,
}: {
  paginatedUsers: User[];
  currentPage: number;
  handlePageChange: (page: number) => void;
  deleteUser: (id: string) => void;
  filteredUsers: User[];
  PAGE_SIZE?: number;
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
                Utilisateurs
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Rôle
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Structure
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Statut
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
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt=""
                          />
                        ) : (
                          <span className="text-teal-600 dark:text-teal-400 font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Crée le: {user.createdAt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role?.name === "Administrateur systeme"
                          ? "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300"
                          : user.role?.name === "Administrateur Kes " ||
                            user.role?.name === "Administrateur Eneo"
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                          : user.role?.name === "Collecteur"
                          ? "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {user.role?.name}
                    </span>
                  </td>
                  <td className="px-6 dark:text-gray-300 font-semibold py-4 whitespace-nowrap">
                    {user.structure?.name.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Actif"
                          ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                          : user.status === "Inactif"
                          ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                          : "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        title="Modifier"
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        title="Bloquer"
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <Ban className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  Aucun utilisateur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <div className="flex justify-end mt-4 p-4 rounded-b-xl border-t border-gray-200">
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={filteredUsers.length}
          pageSize={PAGE_SIZE}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
