import { useState } from "react";
import { PlusCircle, ChevronDown, Search } from "lucide-react";
import { UserRoles, Users } from "../../../data/utiliateur";

import AddUtilisateur from "./AddUtilisateur";
import UtilisateurKPI from "./UtilisateurKPI";
import UtilisateurTable from "./UtilisateurTable";

const PAGE_SIZE = 10;
export default function Utilisateur() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(Users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [structureFilter, setStructureFilter] = useState<string>("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role?.name === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    const matchesStructure = structureFilter
      ? user.structure?.name === structureFilter
      : true;
    return matchesSearch && matchesRole && matchesStatus && matchesStructure;
  });
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const handlePageChange = (page: number) => setCurrentPage(page);

  const deleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-2">
      <div className=" mb-6 ">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Ajouter un utilisateur</span>
          </button>
          <div className="relative flex-1 bg-white dark:bg-gray-800 rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={structureFilter}
                onChange={(e) => setStructureFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
              >
                <option value="">Toutes les structures</option>
                {Users.map((user) => (
                  <option key={user.id} value={user.structure?.name}>
                    {user.structure?.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tous les rôles</option>
                {UserRoles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
                <option value="Bloqué">Bloqué</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <UtilisateurKPI />

      {/* Users Table */}
      <UtilisateurTable
        paginatedUsers={paginatedUsers}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        deleteUser={deleteUser}
        filteredUsers={filteredUsers}
      />

      {/* Add User Modal */}
      {isAddUserOpen && <AddUtilisateur setIsAddUserOpen={setIsAddUserOpen} />}
    </div>
  );
}
