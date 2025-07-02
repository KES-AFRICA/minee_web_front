import { useMemo, useState } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  HardHat,
  Zap,
  Battery,
  Activity,
  AlertTriangle,
  MapPin,
  Tag,
  Printer,
  X,
} from "lucide-react";
import type { Asset } from "./types";
import { ActifsData } from "../../../data/actif";
import QRCode from "react-qr-code";
import { Pagination } from "antd";

const PAGE_SIZE = 5;

export default function AssetManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>(ActifsData as Asset[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [criticalityFilter, setCriticalityFilter] = useState<string>("");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  // Fonction pour ouvrir le modal des étiquettes
  const openLabelsModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsLabelsModalOpen(true);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? asset.type === typeFilter : true;
    const matchesStatus = statusFilter ? asset.status === statusFilter : true;
    const matchesCriticality = criticalityFilter
      ? asset.criticality === criticalityFilter
      : true;
    return matchesSearch && matchesType && matchesStatus && matchesCriticality;
  });

  // pagination
  const paginatedActifs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAssets.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAssets]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Transformateur":
        return <Zap className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case "Ligne":
        return (
          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case "Poste":
        return (
          <HardHat className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        );
      case "Compteur":
        return (
          <Battery className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        );
      default:
        return (
          <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const generateQRContent = (asset: Asset) => {
    return `ENEO Asset ID: ${asset.id}\nName: ${asset.name}\nType: ${asset.type}\nLocation: ${asset.location}\nLast Inspection: ${asset.lastInspection}`;
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className=" mx-auto">
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
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Ajouter un actif</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className=" shadow-md p-4 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou ID..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="relative min-w-[150px]">
                <select
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="Transformateur">Transformateur</option>
                  <option value="Ligne">Ligne</option>
                  <option value="Poste">Poste</option>
                  <option value="Compteur">Compteur</option>
                  <option value="Générateur">Générateur</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative min-w-[150px]">
                <select
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="Hors service">Hors service</option>
                  <option value="En panne">En panne</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative min-w-[150px]">
                <select
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                  value={criticalityFilter}
                  onChange={(e) => setCriticalityFilter(e.target.value)}
                >
                  <option value="">Toutes criticités</option>
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actif
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
                {paginatedActifs.length > 0 ? (
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
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  asset.type === "Transformateur"
                                    ? "bg-teal-500"
                                    : asset.type === "Ligne"
                                    ? "bg-blue-500"
                                    : asset.type === "Poste source"
                                    ? "bg-amber-500"
                                    : asset.type === "Compteur"
                                    ? "bg-purple-500"
                                    : "bg-gray-500"
                                }`}
                              ></span>
                              {asset.type} • ID: {asset.id}
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
                            onClick={() => openLabelsModal(asset)}
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
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Aucun actif trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4 p-4 bg-teal-800/25 dark:bg-teal-900/20 rounded-b-xl">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={filteredAssets.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Ajouter un nouvel actif
              </h2>
              <button
                onClick={() => setIsAddAssetOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="assetName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Nom de l'actif
                </label>
                <input
                  type="text"
                  id="assetName"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Transformateur Principal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="assetType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Type d'actif
                  </label>
                  <select
                    id="assetType"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Transformateur">Transformateur</option>
                    <option value="Ligne">Ligne</option>
                    <option value="Poste">Poste</option>
                    <option value="Compteur">Compteur</option>
                    <option value="Générateur">Générateur</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="assetId"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    ID de l'actif
                  </label>
                  <input
                    type="text"
                    id="assetId"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="TR-2024-XXXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="assetLocation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Localisation
                </label>
                <input
                  type="text"
                  id="assetLocation"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Douala, Bonabéri"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="assetStatus"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Statut
                  </label>
                  <select
                    id="assetStatus"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Hors service">Hors service</option>
                    <option value="En panne">En panne</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="assetCriticality"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Criticité
                  </label>
                  <select
                    id="assetCriticality"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Haute">Haute</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Basse">Basse</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="installationDate"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Date d'installation
                  </label>
                  <input
                    type="date"
                    id="installationDate"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="assetValue"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Valeur (XAF)
                  </label>
                  <input
                    type="number"
                    id="assetValue"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    placeholder="25000000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddAssetOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors"
                >
                  Enregistrer l'actif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Labels Modal */}
      {isLabelsModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl  p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Étiquettes d'actif
              </h2>
              <button
                onClick={() => setIsLabelsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="w-[300px] h-auto border border-gray-200 dark:border-gray-700 p-4">
              <div className=" items-center mb-2">
                <div className="flex flex-col items-center">
                  <h3 className="font-bold text-gray-900 text-center dark:text-white">
                    ENEO <br />{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      INVENTAIRE DES ACTIFS
                    </span>
                  </h3>{" "}
                  <span className="inline-block w-48 h-px bg-gray-200 my-2"></span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between ">
                    <p className="text-xs font-semibold"> Code:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      #{selectedAsset.id}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Type:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {selectedAsset.type}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Statut:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {selectedAsset.status}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Inspection:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {selectedAsset.lastInspection}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs font-semibold">Criticité:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {selectedAsset.criticality}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 items-center justify-center">
                  <span className="inline-block w-48 h-px bg-current  my-2"></span>
                  <div>
                    <QRCode
                      value={generateQRContent(selectedAsset)}
                      size={70}
                      level="Q"
                      className="w-40 h-40"
                    />{" "}
                    <p className="text-xs text-center text-gray-600 dark:text-gray-300">
                      {selectedAsset.id}
                    </p>
                  </div>
                  <span className="inline-block w-48 h-px  bg-current  my-2"></span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2 w-full">
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors text-xs flex items-center gap-1">
                <Printer className="h-3 w-3" />
                Imprimer
              </button>
              <button
                onClick={() => setIsLabelsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
