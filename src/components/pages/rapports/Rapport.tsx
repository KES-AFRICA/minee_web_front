/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Download,
  FileText,
  BarChart2,
  Filter,
  Printer,
  ChevronDown,
  Trash2,
  Calendar,
  TrendingUp,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

export default function Rapport() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rapportsRecents, setRapportsRecents] = useState([
    {
      id: 1,
      nom: "Rapport_Actifs_2024-03-15.xlsx",
      type: "Liste des Actifs",
      taille: "2.3 MB",
      dateGeneration: "2024-03-15",
      status: "Complété",
      nombreActifs: 1250,
    },
    {
      id: 2,
      nom: "Rapport_Valorisation_2024-03-10.pdf",
      type: "Rapport de Valorisation",
      taille: "1.8 MB",
      dateGeneration: "2024-03-10",
      status: "Complété",
      nombreActifs: 890,
    },
    {
      id: 3,
      nom: "Synthese_Globale_2024-03-05.xlsx",
      type: "Synthèse Globale",
      taille: "3.1 MB",
      dateGeneration: "2024-03-05",
      status: "Complété",
      nombreActifs: 1450,
    },
    {
      id: 4,
      nom: "Rapport_Departs_2024-02-28.xlsx",
      type: "Liste des Départs",
      taille: "1.2 MB",
      dateGeneration: "2024-02-28",
      status: "Complété",
      nombreActifs: 520,
    },
    {
      id: 5,
      nom: "Rapport_Actifs_2024-02-20.xlsx",
      type: "Liste des Actifs",
      taille: "2.1 MB",
      dateGeneration: "2024-02-20",
      status: "En cours",
      nombreActifs: 1180,
    },
  ]);

  // Données fictives pour le graphique d'inflation des valeurs
  const donneesInflation = [
    { annee: "2019", valeurTotale: 450000000, inflation: 0 },
    { annee: "2020", valeurTotale: 520000000, inflation: 15.6 },
    { annee: "2021", valeurTotale: 650000000, inflation: 25.0 },
    { annee: "2022", valeurTotale: 780000000, inflation: 20.0 },
    { annee: "2023", valeurTotale: 920000000, inflation: 17.9 },
    { annee: "2024", valeurTotale: 1150000000, inflation: 25.0 },
  ];

  const generateReport = (type: string) => {
    console.log(`Génération du rapport ${type}`);
    // Simulation d'ajout d'un nouveau rapport
    const nouveauRapport = {
      id: rapportsRecents.length + 1,
      nom: `Rapport_${type}_${new Date().toISOString().split("T")[0]}.xlsx`,
      type: type,
      taille: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      dateGeneration: new Date().toISOString().split("T")[0],
      status: "Complété",
      nombreActifs: Math.floor(Math.random() * 1000 + 500),
    };
    setRapportsRecents([nouveauRapport, ...rapportsRecents]);
  };

  const exportToExcel = () => {
    setIsGenerating(true);

    setTimeout(() => {
      generateReport("Actifs Excel");
      setIsGenerating(false);
    }, 2000);
  };

  const supprimerRapport = (id: number) => {
    setRapportsRecents(rapportsRecents.filter((rapport) => rapport.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complété":
        return "text-green-600 bg-green-100";
      case "En cours":
        return "text-yellow-600 bg-yellow-100";
      case "Erreur":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatNumber = (num: number | bigint) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatCurrency = (value: bigint | ValueType) => {
    let numericValue: number | bigint;
    if (typeof value === "number" || typeof value === "bigint") {
      numericValue = value;
    } else if (Array.isArray(value) && typeof value[0] === "number") {
      numericValue = value[0];
    } else if (
      typeof value === "object" &&
      value !== null &&
      "value" in value &&
      typeof (value as any).value === "number"
    ) {
      numericValue = (value as any).value;
    } else {
      numericValue = 0;
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
      <div className=" space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Rapports
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Générez et exportez les rapports des immobilisations, départs et
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
                        generateReport("Liste des Actifs");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Liste des Actifs (Excel)
                    </button>
                    <button
                      onClick={() => {
                        generateReport("Liste des Départs");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Liste des Départs (Excel)
                    </button>
                    <button
                      onClick={() => {
                        generateReport("Rapport de Valorisation");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Rapport de Valorisation
                    </button>
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={() => {
                        generateReport("Synthèse Globale");
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

        {/* Graphique d'inflation des valeurs */}
        <div className="w-full flex items-center bg-white  dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="w-[80%]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-blue-500" />
              Évolution des VNC
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donneesInflation}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="annee"
                    tick={{ fill: "currentColor" }}
                    tickLine={{ stroke: "currentColor" }}
                  />
                  <YAxis
                    yAxisId="valeur"
                    orientation="left"
                    tick={{ fill: "currentColor" }}
                    tickLine={{ stroke: "currentColor" }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <YAxis
                    yAxisId="inflation"
                    orientation="right"
                    tick={{ fill: "currentColor" }}
                    tickLine={{ stroke: "currentColor" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid rgb(75 85 99)",
                      borderRadius: "6px",
                      color: "white",
                    }}
                    formatter={(value, name) => {
                      if (name === "Valeur Totale") {
                        return [formatCurrency(value), name];
                      }
                      return [`${value}%`, name];
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="valeur"
                    type="monotone"
                    dataKey="valeurTotale"
                    stroke="#00bfa5"
                    strokeWidth={3}
                    name="Valeur Totale"
                    dot={{ fill: "#00bfa5", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    yAxisId="inflation"
                    type="monotone"
                    dataKey="inflation"
                    stroke="#03a9f4"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Taux d'Inflation (%)"
                    dot={{ fill: "#004d40", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 flex flex-col  gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Valeur Actuelle
              </p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                {formatCurrency(1150000000)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Croissance 2024
              </p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                +25.0%
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Croissance Moyenne
              </p>
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                +20.7%
              </p>
            </div>
          </div>
        </div>

        {/* Tableau des rapports récents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Calendar size={20} />
            Rapports Récents
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Nom du fichier
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Taille
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Actifs
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rapportsRecents.map((rapport) => (
                  <tr
                    key={rapport.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {rapport.nom}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {rapport.type}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {rapport.taille}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {rapport.dateGeneration}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          rapport.status
                        )}`}
                      >
                        {rapport.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {formatNumber(rapport.nombreActifs)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Visualiser"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Télécharger"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => supprimerRapport(rapport.id)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rapportsRecents.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucun rapport récent disponible
              </p>
            </div>
          )}
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
            onClick={() => generateReport("Liste des Départs")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <BarChart2 size={20} className="text-green-500" />
              Rapport Départs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Synthèse des départs avec actifs associés et zones couvertes
            </p>
            <button
              onClick={() => generateReport("Liste des Départs")}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Exporter
            </button>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => generateReport("Rapport de Valorisation")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Filter size={20} className="text-cyan-500" />
              Rapport Valorisation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Analyse des valorisations par région, type et état technique
            </p>
            <button
              onClick={() => generateReport("Rapport de Valorisation")}
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
            >
              Exporter
            </button>
          </div>

          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => generateReport("Synthèse Globale")}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Download size={20} className="text-orange-500" />
              Synthèse Globale
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Rapport complet avec statistiques et indicateurs clés
            </p>
            <button
              onClick={() => generateReport("Synthèse Globale")}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
