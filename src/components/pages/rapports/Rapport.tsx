import { getAllActifs, type Actif } from "@/data/indexActifs";
import {
  Download,
  FileText,
  BarChart2,
  Filter,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function Rapport() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] =
    useState("Standard (PDF)");
  const [selectedPeriod, setSelectedPeriod] = useState("Toutes données");
  const [selectedDetail, setSelectedDetail] = useState("Synthétique");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = (type: string) => {
    console.log(`Génération du rapport ${type}`);
    toast.success(`Rapport ${type} généré avec succès!`);
  };

  const exportToExcel = () => {
    setIsGenerating(true);

    try {
      // Récupérer tous les actifs
      const actifs: Actif[] = getAllActifs();

      // Préparer les données pour Excel
      const data = actifs.map((actif) => ({
        ID: actif.id,
        "Désignation Générale": actif.designationGenerale,
        Type: actif.type,
        "Type de Bien": actif.TypeDeBien,
        "Nature du Bien": actif.natureDuBien,
        "Mode d'Acquisition": actif.modeDacquisition,
        Région: actif.region,
        Département: actif.departement,
        Commune: actif.commune,
        Quartier: actif.quartier,
        Rue: actif.rue,
        "Date d'Acquisition": actif.modeDacquisition,
        Valorisation: actif.valorisation,
        "Durée de Vie": actif.anneeMiseEnService,
        "État Technique": actif.etatVisuel,
        "PersonnelKES ": actif.personnelKES,
        "PersonnelENEO ": actif.personnelENEO,
        "PersonnelMINEE ": actif.personnelMINEE,
        PersonnelARSEL: actif.personnelARSEL,
        CodificationDecoupageENEO: actif.codificationDecoupageENEO,
        Longitude: actif.geolocalisation?.longitude,
        Latitude: actif.geolocalisation?.latitude,
      }));

      // Créer un nouveau classeur
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Ajouter la feuille au classeur
      XLSX.utils.book_append_sheet(wb, ws, "Actifs");

      // Générer le fichier Excel
      XLSX.writeFile(
        wb,
        `Rapport_Actifs_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast.success("Export Excel des actifs réussi!");
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      toast.error("Une erreur est survenue lors de l'export");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className=" mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Rapports d'Inventaire
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Générez et exportez les rapports des actifs, départs et
              valorisations
            </p>
          </div>

          <div className="flex gap-3">
            {/* Dropdown Menu Custom */}
            <div className="relative">
              <button
                disabled={isGenerating}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Download size={16} />
                {isGenerating ? "Génération..." : "Exporter"}
                <ChevronDown size={16} className="opacity-50" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        generateReport("actifs");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Liste des Actifs (Excel)
                    </button>
                    <button
                      onClick={() => {
                        generateReport("departs");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Liste des Départs (Excel)
                    </button>
                    <button
                      onClick={() => {
                        generateReport("valorisation");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Rapport de Valorisation
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={() => {
                        generateReport("synthese");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Synthèse Globale
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Printer size={16} />
              Imprimer
            </button>
          </div>
        </div>

        {/* Options de rapport */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => exportToExcel()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <FileText size={20} className="text-blue-500" />
              Rapport Actifs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Liste complète des actifs avec détails techniques et localisation
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                exportToExcel();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={isGenerating}
            >
              {isGenerating ? "Génération..." : "Exporter Excel"}
            </button>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => generateReport("departs")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <BarChart2 size={20} className="text-green-500" />
              Rapport Départs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Synthèse des départs avec actifs associés et zones couvertes
            </p>
            <button
              onClick={() => generateReport("departs")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Exporter
            </button>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => generateReport("valorisation")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Filter size={20} className="text-cyan-500" />
              Rapport Valorisation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Analyse des valorisations par région, type et état technique
            </p>
            <button
              onClick={() => generateReport("valorisation")}
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              Exporter
            </button>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => generateReport("synthese")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Download size={20} className="text-orange-500" />
              Synthèse Globale
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rapport complet avec statistiques et indicateurs clés
            </p>
            <button
              onClick={() => generateReport("synthese")}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Exporter
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Filter size={20} />
            Options de Génération
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de Rapport
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>Standard (PDF)</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
                <option>JSON</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>Toutes données</option>
                <option>Dernier mois</option>
                <option>Dernier trimestre</option>
                <option>Dernière année</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Niveau de Détail
              </label>
              <select
                value={selectedDetail}
                onChange={(e) => setSelectedDetail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option>Synthétique</option>
                <option>Standard</option>
                <option>Détaillé</option>
                <option>Technique complet</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Appliquer Filtres
            </button>
            <button
              onClick={() => generateReport("custom")}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Générer Rapport Personnalisé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
