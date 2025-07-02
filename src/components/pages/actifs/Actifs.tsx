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
import { ActifsData, ZONES_COMMUNES } from "../../../data/actif";
import Dashboard from "./Dashboard";
import TableActifs from "./TableActifs";

type RegionKey = keyof typeof ZONES_COMMUNES;
const PAGE_SIZE = 5;
export default function ENEOAssetManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const [assets, setAssets] = useState(ActifsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter] = useState<string>("");
  const [criticalityFilter] = useState<string>("");

  const [regionFilter, setRegionFilter] = useState("all");
  const [communeFilter, setCommuneFilter] = useState("all");
  const [currentView, setCurrentView] = useState<"table" | "dashboard">(
    "table"
  );

  // Nouveau state pour le formulaire
  // const [formData, setFormData] = useState({
  //   name: "",
  //   type: "Transformateur",
  //   location: "",
  //   commune: "",
  //   zone: "",
  //   status: "Actif",
  //   value: "",
  //   criticality: "Moyenne",
  //   installationDate: "",
  //   manufacturer: "",
  //   model: "",
  //   serialNumber: "",
  //   specifications: "",
  //   estimatedLifespan: "",
  // });

  // Filtrage des actifs
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter !== "" ? asset.type === typeFilter : true;
    const matchesStatus =
      statusFilter !== "" ? asset.status === statusFilter : true;
    const matchesCriticality =
      criticalityFilter !== "" ? asset.criticality === criticalityFilter : true;
    const matchesZone =
      regionFilter !== "all" ? asset.zone === regionFilter : true;
    const matchesCommune =
      communeFilter !== "all" ? asset.commune === communeFilter : true;

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus &&
      matchesCriticality &&
      matchesZone &&
      matchesCommune
    );
  });

  // pagination
  const paginatedActifs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAssets.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAssets]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Statistiques du dashboard
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const activeAssets = assets.filter(
    (asset) => asset.status === "Actif"
  ).length;
  const highCriticalityAssets = assets.filter(
    (asset) => asset.criticality === "Haute"
  ).length;

  const assetsByType = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assetsByZone = assets.reduce((acc, asset) => {
    acc[asset.zone] = (acc[asset.zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Fonctions utilitaires
  // const resetForm = () => {
  //   setFormData({
  //     name: "",
  //     type: "Transformateur",
  //     location: "",
  //     commune: "",
  //     zone: "",
  //     status: "Actif",
  //     value: "",
  //     criticality: "Moyenne",
  //     installationDate: "",
  //     manufacturer: "",
  //     model: "",
  //     serialNumber: "",
  //     specifications: "",
  //     estimatedLifespan: "",
  //   });
  // };

  // const handleInputChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //     // Reset commune when zone changes
  //     ...(name === "zone" && { commune: "" }),
  //   }));
  // };

  // const generateAssetId = (type: string) => {
  //   const prefix =
  //     type === "Transformateur"
  //       ? "TR"
  //       : type === "Ligne"
  //       ? "LG"
  //       : type === "Poste"
  //       ? "PS"
  //       : type === "Compteur"
  //       ? "CT"
  //       : "GN";
  //   const year = new Date().getFullYear();
  //   const number = String(assets.length + 1).padStart(3, "0");
  //   return `${prefix}-${year}-${number}`;
  // };

  // const addAsset = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newAsset: Asset = {
  //     id: generateAssetId(formData.type),
  //     name: formData.name,
  //     type: formData.type,
  //     location: formData.location,
  //     commune: formData.commune,
  //     zone: formData.zone,
  //     status: formData.status,
  //     value: parseInt(formData.value) || 0,
  //     criticality: formData.criticality,
  //     installationDate: formData.installationDate,
  //     lastInspection: new Date().toISOString().split("T")[0],
  //     manufacturer: formData.manufacturer,
  //     model: formData.model,
  //     serialNumber: formData.serialNumber,
  //     specifications: formData.specifications,
  //     estimatedLifespan: parseInt(formData.estimatedLifespan) || 20,
  //     currentAge: 0,
  //     depreciation: 0,
  //   };

  //   setAssets([...assets, newAsset]);
  //   setIsAddAssetOpen(false);
  //   resetForm();
  // };

  // const editAsset = (asset: Asset) => {
  //   setSelectedAsset(asset);
  //   setFormData({
  //     name: asset.name,
  //     type: asset.type,
  //     location: asset.location,
  //     commune: asset.commune,
  //     zone: asset.zone,
  //     status: asset.status,
  //     value: asset.value.toString(),
  //     criticality: asset.criticality,
  //     installationDate: asset.installationDate,
  //     manufacturer: asset.manufacturer || "",
  //     model: asset.model || "",
  //     serialNumber: asset.serialNumber || "",
  //     specifications: asset.specifications || "",
  //     estimatedLifespan: asset.estimatedLifespan?.toString() || "20",
  //   });
  //   setIsEditAssetOpen(true);
  // };

  // const updateAsset = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!selectedAsset) return;

  //   const updatedAsset: Asset = {
  //     ...selectedAsset,
  //     name: formData.name,
  //     type: formData.type,
  //     location: formData.location,
  //     commune: formData.commune,
  //     zone: formData.zone,
  //     status: formData.status,
  //     value: parseInt(formData.value) || 0,
  //     criticality: formData.criticality,
  //     installationDate: formData.installationDate,
  //     manufacturer: formData.manufacturer,
  //     model: formData.model,
  //     serialNumber: formData.serialNumber,
  //     specifications: formData.specifications,
  //     estimatedLifespan: parseInt(formData.estimatedLifespan) || 20,
  //   };

  //   setAssets(
  //     assets.map((asset) =>
  //       asset.id === selectedAsset.id ? updatedAsset : asset
  //     )
  //   );
  //   setIsEditAssetOpen(false);
  //   resetForm();
  //   setSelectedAsset(null);
  // };

  const deleteAsset = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet actif ?")) {
      setAssets(assets.filter((asset) => asset.id !== id));
    }
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
      case "Générateur":
        return (
          <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      default:
        return (
          <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  // const generateQRContent = (asset: Asset) => {
  //   return `ENEO Asset ID: ${asset.id}\nName: ${asset.name}\nType: ${asset.type}\nLocation: ${asset.location}\nCommune: ${asset.commune}\nZone: ${asset.zone}\nLast Inspection: ${asset.lastInspection}`;
  // };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(value);
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
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un actif..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  setCommuneFilter("all");
                }}
              >
                <option value="">Toutes les régions</option>
                <option value="Centre">Centre</option>
                <option value="Littoral">Littoral</option>
              </select>
            </div>

            <div className="relative">
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                value={communeFilter}
                onChange={(e) => setCommuneFilter(e.target.value)}
                disabled={regionFilter === "all"}
              >
                <option value="all">Toutes communes</option>
                {regionFilter !== "all" &&
                  ZONES_COMMUNES[regionFilter as RegionKey]?.map((commune) => (
                    <option key={commune} value={commune}>
                      {commune}
                    </option>
                  ))}
              </select>
            </div>

            <div className="relative">
              <select
                className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
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
            </div>
          </div>
        </div>

        {/* Dashboard View */}
        {currentView === "dashboard" ? (
          <Dashboard
            totalAssets={totalAssets}
            totalValue={totalValue}
            activeAssets={activeAssets}
            highCriticalityAssets={highCriticalityAssets}
            assetsByType={assetsByType}
            assetsByZone={assetsByZone}
            getAssetIcon={getAssetIcon}
            formatCurrency={formatCurrency}
          />
        ) : (
          <TableActifs
            paginatedActifs={paginatedActifs}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            deleteAsset={deleteAsset}
            getAssetIcon={getAssetIcon}
            filteredAssets={filteredAssets}
            PAGE_SIZE={PAGE_SIZE}
          />
        )}
      </div>
    </div>
  );
}
