import { useMemo, useState } from "react";
import {
  Search,
  HardHat,
  Zap,
  Battery,
  Activity,
  AlertTriangle,
  BarChart3,
  Settings,
  Table2,
  GitBranch,
  TrendingUp,
  Map,
  Tag,
} from "lucide-react";
import Dashboard from "./Dashboard";
import TableActifs from "./TableActifs";
import {
  getActifsByCommune,
  getActifsByDepartement,
  getActifsByModeDacquisition,
  getActifsByNatureDuBien,
  getActifsByRegion,
  getActifsByType,
  getActifsByTypeDeBien,
  getAllActifs,
  getAllDeparts,
  getActifsByDepart,
} from "@/data";
import type { Actif, Depart } from "@/types";
import { DepartDetailsModal } from "./components/DepartDetailsModal";

const PAGE_SIZE = 7;

export default function ENEOAssetManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [typeDeBienFilter, setTypeDeBienFilter] = useState<string>("");
  const [modeDacquisitionFilter, setModeDacquisitionFilter] =
    useState<string>("");
  const [natureDuBienFilter, setNatureDuBienFilter] = useState<string>("");
  const [departementFilter, setDepartementFilter] = useState<string>("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [communeFilter, setCommuneFilter] = useState<string>("");
  const [currentView, setCurrentView] = useState<"table" | "dashboard">(
    "table"
  );
  const [activeTab, setActiveTab] = useState<"actifs" | "departs">("actifs");
  const [selectedDepart, setSelectedDepart] = useState<string>("");
  const [selectedDepartForModal, setSelectedDepartForModal] = useState<
    string | null
  >(null);

  // Récupération des données
  const allActifs = getAllActifs();
  const allDeparts = getAllDeparts();

  // Filtrage des actifs
  const filteredActifs = useMemo(() => {
    let result = allActifs;

    if (selectedDepart) {
      result = getActifsByDepart(selectedDepart);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (actif) =>
          actif.id.toLowerCase().includes(term) ||
          actif.designationGenerale.toLowerCase().includes(term) ||
          actif.quartier.toLowerCase().includes(term) ||
          actif.commune.toLowerCase().includes(term)
      );
    }

    if (typeFilter) {
      result = getActifsByType(
        typeFilter as
          | "LIGNE_AERIENNE"
          | "LIGNE_SOUTERRAINE"
          | "POSTE_DISTRIBUTION"
          | "TRANSFORMATEUR"
          | "CELLULE_DISTRIBUTION_PRIMAIRE"
          | "CELLULE_DISTRIBUTION_SECONDAIRE"
          | "POINT_LIVRAISON"
      );
    }

    if (regionFilter) {
      result = getActifsByRegion(regionFilter);
    }

    if (communeFilter) {
      result = getActifsByCommune(communeFilter);
    }

    if (typeDeBienFilter) {
      result = getActifsByTypeDeBien(
        typeDeBienFilter as
          | "bien privée"
          | "bien de retour"
          | "bien de reprise"
          | "bien cdi"
      );
    }

    if (modeDacquisitionFilter) {
      result = getActifsByModeDacquisition(
        modeDacquisitionFilter as
          | "directe"
          | "par projet"
          | "par immobilisation en cours"
      );
    }

    if (natureDuBienFilter) {
      result = getActifsByNatureDuBien(
        natureDuBienFilter as
          | "Concédé Etat"
          | "privée (ENEO)"
          | "Tier privée"
          | "Tier AER"
          | "Tier MINEE"
          | "Tier MUNICIPALITE"
          | "Tier industriel"
          | "Tier Riverains"
          | "Tier MINEPAT"
      );
    }

    if (departementFilter) {
      result = getActifsByDepartement(departementFilter);
    }

    return result;
  }, [
    searchTerm,
    typeFilter,
    regionFilter,
    communeFilter,
    allActifs,
    typeDeBienFilter,
    modeDacquisitionFilter,
    natureDuBienFilter,
    departementFilter,
    selectedDepart,
  ]);

  // Pagination
  const paginatedActifs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredActifs.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredActifs]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Fonction pour obtenir l'icône correspondant au type d'actif
  const getAssetIcon = (type: string) => {
    switch (type) {
      case "TRANSFORMATEUR":
        return <Zap className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case "LIGNE_AERIENNE":
      case "LIGNE_SOUTERRAINE":
        return (
          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "POSTE_DISTRIBUTION":
        return (
          <HardHat className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        );
      case "POINT_LIVRAISON":
        return (
          <Battery className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      case "CELLULE_DISTRIBUTION_PRIMAIRE":
      case "CELLULE_DISTRIBUTION_SECONDAIRE":
        return (
          <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Actifs Électriques
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Inventaire et suivi du parc d'actifs ENEO
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentView(currentView === "table" ? "dashboard" : "table")
              }
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              {currentView === "table" ? (
                <BarChart3 className="w-5 h-5" />
              ) : (
                <Table2 className="w-5 h-5" />
              )}
              <span>{currentView === "table" ? "Dashboard" : "Listes"}</span>
            </button>
          </div>
        </div>

        {/* Onglets Actifs/Départs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "actifs"
                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("actifs")}
          >
            Actifs
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "departs"
                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("departs")}
          >
            Départs
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={
                activeTab === "actifs"
                  ? "Rechercher un actif..."
                  : "Rechercher un départ..."
              }
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === "actifs" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCommuneFilter("");
                }}
              >
                <option value="">Toutes les régions</option>
                <option value="Littoral">Littoral</option>
                <option value="Centre">Centre</option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={communeFilter}
                onChange={(e) => setCommuneFilter(e.target.value)}
                disabled={!regionFilter}
              >
                <option value="">Toutes les communes</option>
                {regionFilter &&
                  Array.from(
                    new Set(
                      allActifs
                        .filter((a) => a.region === regionFilter)
                        .map((a) => a.commune)
                    )
                  )
                    .filter(Boolean)
                    .map((commune) => (
                      <option key={commune} value={commune}>
                        {commune}
                      </option>
                    ))}
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tous les types d'actif</option>
                <option value="LIGNE_AERIENNE">Ligne Aérienne</option>
                <option value="LIGNE_SOUTERRAINE">Ligne Souterraine</option>
                <option value="POSTE_DISTRIBUTION">Poste Distribution</option>
                <option value="TRANSFORMATEUR">Transformateur</option>
                <option value="CELLULE_DISTRIBUTION_PRIMAIRE">
                  Cellule Primaire
                </option>
                <option value="CELLULE_DISTRIBUTION_SECONDAIRE">
                  Cellule Secondaire
                </option>
                <option value="POINT_LIVRAISON">Point de Livraison</option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={typeDeBienFilter}
                onChange={(e) => setTypeDeBienFilter(e.target.value)}
              >
                <option value="">Tous les types de bien</option>
                <option value="bien privée">Bien privée</option>
                <option value="bien de retour">Bien de retour</option>
                <option value="bien de reprise">Bien de reprise</option>
                <option value="bien cdi">Bien CDI</option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={modeDacquisitionFilter}
                onChange={(e) => setModeDacquisitionFilter(e.target.value)}
              >
                <option value="">Tous les modes d'acquisition</option>
                <option value="directe">Directe</option>
                <option value="par projet">Par projet</option>
                <option value="par immobilisation en cours">
                  Par immobilisation en cours
                </option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={natureDuBienFilter}
                onChange={(e) => setNatureDuBienFilter(e.target.value)}
              >
                <option value="">Toutes les natures du bien</option>
                <option value="Concédé Etat">Concédé Etat</option>
                <option value="privée (ENEO)">privée (ENEO)</option>
                <option value="Tier privée">Tier privée</option>
                <option value="Tier AER">Tier AER</option>
                <option value="Tier MINEE">Tier MINEE</option>
                <option value="Tier MUNICIPALITE">Tier MUNICIPALITE</option>
                <option value="Tier industriel">Tier industriel</option>
                <option value="Tier Riverains">Tier Riverains</option>
                <option value="Tier MINEPAT">Tier MINEPAT</option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={departementFilter}
                onChange={(e) => setDepartementFilter(e.target.value)}
              >
                <option value="">Tous les départements</option>
                {Array.from(
                  new Set(
                    allActifs
                      .filter((a) => !regionFilter || a.region === regionFilter)
                      .map((a) => a.departement)
                  )
                )
                  .filter(Boolean)
                  .map((departement) => (
                    <option key={departement} value={departement}>
                      {departement}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCommuneFilter("");
                }}
              >
                <option value="">Toutes les régions</option>
                <option value="Littoral">Littoral</option>
                <option value="Centre">Centre</option>
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={selectedDepart}
                onChange={(e) => setSelectedDepart(e.target.value)}
              >
                <option value="">Tous les départs</option>
                {allDeparts
                  .filter(
                    (depart) =>
                      !regionFilter ||
                      depart.zonesGeographiques.regions.includes(regionFilter)
                  )
                  .map((depart) => (
                    <option key={depart.id} value={depart.id}>
                      {depart.nom}
                    </option>
                  ))}
              </select>

              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tous les types d'actif</option>
                <option value="LIGNE_AERIENNE">Ligne Aérienne</option>
                <option value="LIGNE_SOUTERRAINE">Ligne Souterraine</option>
                <option value="POSTE_DISTRIBUTION">Poste Distribution</option>
                <option value="TRANSFORMATEUR">Transformateur</option>
                <option value="CELLULE_DISTRIBUTION_PRIMAIRE">
                  Cellule Primaire
                </option>
                <option value="CELLULE_DISTRIBUTION_SECONDAIRE">
                  Cellule Secondaire
                </option>
                <option value="POINT_LIVRAISON">Point de Livraison</option>
              </select>
            </div>
          )}
        </div>

        {/* Contenu en fonction de l'onglet actif */}
        {activeTab === "actifs" ? (
          currentView === "dashboard" ? (
            <Dashboard
              filteredActifs={filteredActifs}
              getAssetIcon={getAssetIcon}
            />
          ) : (
            <TableActifs
              paginatedActifs={paginatedActifs}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              getAssetIcon={getAssetIcon}
              filteredActifs={filteredActifs}
              PAGE_SIZE={PAGE_SIZE}
            />
          )
        ) : currentView === "dashboard" ? (
          <DepartDashboard
            departs={allDeparts}
            actifs={filteredActifs}
            selectedDepart={selectedDepart}
          />
        ) : (
          <div className="">
            <DepartTable
              departs={allDeparts}
              actifs={filteredActifs}
              selectedDepart={selectedDepart}
              setSelectedDepart={setSelectedDepart}
              onOpenDetails={setSelectedDepartForModal}
            />
            <DepartDetailsModal
              departId={selectedDepartForModal}
              isOpen={!!selectedDepartForModal}
              onClose={() => setSelectedDepartForModal(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Nouveau composant pour le tableau des départs
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
                État
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
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      depart.etatGeneral === "En service"
                        ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
                        : depart.etatGeneral === "Hors service"
                        ? "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
                        : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
                    }`}
                  >
                    {depart.etatGeneral}
                  </span>
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

// Nouveau composant pour le dashboard des départs
function DepartDashboard({
  departs,
  actifs,
  selectedDepart,
}: {
  departs: Depart[];
  actifs: Actif[];
  selectedDepart: string;
}) {
  // Calcul des statistiques
  const stats = {
    totalDeparts: departs.length,
    totalActifs: actifs.length,
    parRegion: {} as Record<string, number>,
    parEtat: { "En service": 0, "Hors service": 0, Maintenance: 0 },
    parType: {} as Record<string, number>,
  };

  departs.forEach((depart) => {
    stats.parEtat[depart.etatGeneral] =
      (stats.parEtat[depart.etatGeneral] || 0) + 1;

    depart.zonesGeographiques.regions.forEach((region) => {
      stats.parRegion[region] = (stats.parRegion[region] || 0) + 1;
    });
  });

  actifs.forEach((actif) => {
    stats.parType[actif.type] = (stats.parType[actif.type] || 0) + 1;
  });

  const selectedDepartData = departs.find((d) => d.id === selectedDepart);

  return (
    <div className="space-y-6 mb-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Départs
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalDeparts}
              </p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
              <GitBranch className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Actifs Connectés
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalActifs}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                En Service
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.parEtat["En service"]}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {(
                  (stats.parEtat["En service"] / stats.totalDeparts) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Régions Couvertes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats.parRegion).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Détails du départ sélectionné */}
      {selectedDepartData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Détails du Départ: {selectedDepartData.nom}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Informations Générales
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">ID:</span>{" "}
                  {selectedDepartData.id}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Poste Origine:</span>{" "}
                  {selectedDepartData.posteOrigine}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date Création:</span>{" "}
                  {selectedDepartData.dateCreation}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Longueur Totale:</span>{" "}
                  {selectedDepartData.longueurTotale} km
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{" "}
                  {selectedDepartData.typeDepart}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Tension:</span>{" "}
                  {selectedDepartData.tension} V
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couverture Géographique
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Régions:</span>{" "}
                  {selectedDepartData.zonesGeographiques.regions.join(", ")}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Départements:</span>{" "}
                  {selectedDepartData.zonesGeographiques.departements.join(
                    ", "
                  )}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Communes:</span>{" "}
                  {selectedDepartData.zonesGeographiques.communes.join(", ")}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Quartiers:</span>{" "}
                  {selectedDepartData.zonesGeographiques.quartiers.join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
              Répartition des Actifs
            </h4>
            <div className="space-y-3">
              {Object.entries(stats.parType)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${(count / stats.totalActifs) * 100}%`,
                          }}
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
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par État
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.parEtat).map(([etat, count]) => (
              <div key={etat} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {etat}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        etat === "En service"
                          ? "bg-green-600"
                          : etat === "Hors service"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                      style={{
                        width: `${(count / stats.totalDeparts) * 100}%`,
                      }}
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
            Répartition par Région
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.parRegion)
              .sort((a, b) => b[1] - a[1])
              .map(([region, count]) => (
                <div key={region} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {region}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalDeparts) * 100}%`,
                        }}
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
      </div>
    </div>
  );
}
