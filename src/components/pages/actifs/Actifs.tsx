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
import { DepartDetailsModal } from "./components/DepartDetailsModal";
import { DepartTable } from "./components/DepartTable";
import { DepartDashboard } from "./components/DepartDashboard";
import CommuneDashboard from "./components/CommuneDashboard";
import CommuneTable from "./components/CommuneTable";

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
  const [activeTab, setActiveTab] = useState<"actifs" | "departs" | "communes">("actifs");
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
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "communes"
                ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("communes")}
            >
            Communes
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
              {/* Région */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setCommuneFilter("");
                setDepartementFilter("");
              }}
              >
              <option value="">Toutes les régions</option>
              {Array.from(new Set(allActifs.map((a) => a.region)))
                .filter(Boolean)
                .map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
                ))}
              </select>

              {/* Département */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={departementFilter}
              onChange={(e) => {
                setDepartementFilter(e.target.value);
                setCommuneFilter("");
              }}
              disabled={!regionFilter}
              >
              <option value="">Tous les départements</option>
              {regionFilter &&
                Array.from(
                new Set(
                  allActifs
                  .filter((a) => a.region === regionFilter)
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

              {/* Commune */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              disabled={!regionFilter && !departementFilter}
              >
              <option value="">Toutes les communes</option>
              {Array.from(
                new Set(
                allActifs
                  .filter(
                  (a) =>
                    (!regionFilter || a.region === regionFilter) &&
                    (!departementFilter ||
                    a.departement === departementFilter)
                  )
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

              {/* Type d'actif */}
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

              {/* Type de bien */}
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

              {/* Mode d'acquisition */}
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

              {/* Nature du bien */}
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
            </div>
            ) : activeTab === "departs" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Région */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setDepartementFilter("");
                setCommuneFilter("");
                setSelectedDepart("");
              }}
              >
              <option value="">Toutes les régions</option>
              {Array.from(new Set(allDeparts.flatMap((d) => d.zonesGeographiques.regions)))
                .filter(Boolean)
                .map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
                ))}
              </select>

              {/* Département */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={departementFilter}
              onChange={(e) => {
                setDepartementFilter(e.target.value);
                setCommuneFilter("");
                setSelectedDepart("");
              }}
              disabled={!regionFilter}
              >
              <option value="">Tous les départements</option>
              {regionFilter &&
                Array.from(
                new Set(
                  allDeparts
                  .filter((d) =>
                    d.zonesGeographiques.regions.includes(regionFilter)
                  )
                  .flatMap((d) => d.zonesGeographiques.departements)
                )
                )
                .filter(Boolean)
                .map((departement) => (
                  <option key={departement} value={departement}>
                  {departement}
                  </option>
                ))}
              </select>

              {/* Commune */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={communeFilter}
              onChange={(e) => {
                setCommuneFilter(e.target.value);
                setSelectedDepart("");
              }}
              disabled={!regionFilter && !departementFilter}
              >
              <option value="">Toutes les communes</option>
              {Array.from(
                new Set(
                allDeparts
                  .filter(
                  (d) =>
                    (!regionFilter ||
                    d.zonesGeographiques.regions.includes(regionFilter)) &&
                    (!departementFilter ||
                    d.zonesGeographiques.departements.includes(departementFilter))
                  )
                  .flatMap((d) => d.zonesGeographiques.communes)
                )
              )
                .filter(Boolean)
                .map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
                ))}
              </select>

              {/* Départ */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={selectedDepart}
              onChange={(e) => setSelectedDepart(e.target.value)}
              >
              <option value="">Tous les départs</option>
              {allDeparts
                .filter(
                (depart) =>
                  (!regionFilter ||
                  depart.zonesGeographiques.regions.includes(regionFilter)) &&
                  (!departementFilter ||
                  depart.zonesGeographiques.departements.includes(departementFilter)) &&
                  (!communeFilter ||
                  depart.zonesGeographiques.communes.includes(communeFilter))
                )
                .map((depart) => (
                <option key={depart.id} value={depart.id}>
                  {depart.nom}
                </option>
                ))}
              </select>
            </div>
            ) : (
            // Communes tab
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Région */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setDepartementFilter("");
                setCommuneFilter("");
              }}
              >
              <option value="">Toutes les régions</option>
              {Array.from(new Set(allActifs.map((a) => a.region)))
                .filter(Boolean)
                .map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
                ))}
              </select>

              {/* Département */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={departementFilter}
              onChange={(e) => {
                setDepartementFilter(e.target.value);
                setCommuneFilter("");
              }}
              disabled={!regionFilter}
              >
              <option value="">Tous les départements</option>
              {regionFilter &&
                Array.from(
                new Set(
                  allActifs
                  .filter((a) => a.region === regionFilter)
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

              {/* Commune */}
              <select
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              disabled={!regionFilter && !departementFilter}
              >
              <option value="">Toutes les communes</option>
              {Array.from(
                new Set(
                allActifs
                  .filter(
                  (a) =>
                    (!regionFilter || a.region === regionFilter) &&
                    (!departementFilter ||
                    a.departement === departementFilter)
                  )
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
        ) : activeTab === "departs" ? (
          currentView === "dashboard" ? (
            <DepartDashboard
              departs={allDeparts}
              actifs={filteredActifs}
              selectedDepart={selectedDepart}
            />
          ) : (
            <div>
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
          )
        ) : (
          // Communes tab
          currentView === "dashboard" ? (
            <CommuneDashboard
              actifs={filteredActifs}
            PAGE_SIZE = {PAGE_SIZE}
            />
          ) : (
            <CommuneTable
           actifs={filteredActifs}
            PAGE_SIZE = {PAGE_SIZE}
              />
          )
        )}
      </div>
    </div>
  );
}



// Nouveau composant pour le dashboard des départs

