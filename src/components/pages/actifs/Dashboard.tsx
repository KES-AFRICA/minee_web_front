import { AlertCircle, TrendingUp, Users, Map, Layers, Tag, Home } from "lucide-react";
import { useState, type JSX } from "react";
import type { Actif } from "@/data";

export default function Dashboard({
  filteredActifs,
  getAssetIcon,
}: {
  filteredActifs: Actif[];
  getAssetIcon: (type: string) => JSX.Element;
}) {
  // Calcul des statistiques en temps réel basées sur les actifs filtrés
  const calculateStats = (actifs: Actif[]) => {
    const stats = {
      total: actifs.length,
      parType: {} as Record<string, number>,
      parTypeDeBien: {} as Record<string, number>,
      parRegion: {} as Record<string, number>,
      parDepartement: {} as Record<string, number>,
      parCommune: {} as Record<string, number>,
      parQuartier: {} as Record<string, number>,
      parNature: {} as Record<string, number>,
      parEtat: { "Bon": 0, "Moyen": 0, "Passable": 0, "Mauvais": 0 },
    };

    actifs.forEach((actif) => {
      // Statistiques par type
      stats.parType[actif.type] = (stats.parType[actif.type] || 0) + 1;
      stats.parTypeDeBien[actif.TypeDeBien] = (stats.parTypeDeBien[actif.TypeDeBien] || 0) + 1;

      // Statistiques géographiques
      stats.parRegion[actif.region] = (stats.parRegion[actif.region] || 0) + 1;
      stats.parDepartement[actif.departement] = (stats.parDepartement[actif.departement] || 0) + 1;
      stats.parCommune[actif.commune] = (stats.parCommune[actif.commune] || 0) + 1;
      stats.parQuartier[actif.quartier] = (stats.parQuartier[actif.quartier] || 0) + 1;

      // Statistiques par nature du bien
      stats.parNature[actif.natureDuBien] = (stats.parNature[actif.natureDuBien] || 0) + 1;

      // Statistiques par état
      if ('etatVisuel' in actif) {
        const etat = actif.etatVisuel;
        if (etat === "Bon" || etat === "Moyen" || etat === "Passable" || etat === "Mauvais") {
          stats.parEtat[etat]++;
        }
      }
    });

    return stats;
  };

  const stats = calculateStats(filteredActifs);
  const activePercentage = (stats.parEtat["Bon"] / stats.total) * 100;
  const uniqueRegions = Object.keys(stats.parRegion).length;
  const uniqueDepartements = Object.keys(stats.parDepartement).length;
  const uniqueCommunes = Object.keys(stats.parCommune).length;
  const [activeTab, setActiveTab] = useState('Régions');
const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
const [communeSearch, setCommuneSearch] = useState('');
const [quartierSearch, setQuartierSearch] = useState('');
const [selectedCommune, setSelectedCommune] = useState('');

const handleSort = (key: string) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};

  return (
    <div className="space-y-6 mb-6">
      {/* KPI Cards - Première ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Actifs Filtrés
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                En Bon État
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.parEtat["Bon"]}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {activePercentage.toFixed(1)}% du parc filtré
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
                Types D'actif
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats.parType).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Zones Couvertes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {uniqueCommunes}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {uniqueRegions} régions • {uniqueDepartements} départements
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards - Deuxième ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Nature des Biens
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats.parNature).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Quartiers Couverts
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(stats.parQuartier).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                État Moyen/Passable
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.parEtat["Moyen"] + stats.parEtat["Passable"] + stats.parEtat["Mauvais"]}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Type de biens
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.parTypeDeBien ? Object.keys(stats.parTypeDeBien).length : 0}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Répartition par Type ({Object.keys(stats.parType).length})
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.parType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAssetIcon(type)}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${(count / stats.total) * 100}%` }}
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
            Répartition Géographique
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Régions
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uniqueRegions} régions
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{ width: `${(uniqueRegions / 10) * 100}%` }} // 10 étant un max théorique
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Départements
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uniqueDepartements} départements
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-purple-600"
                  style={{ width: `${(uniqueDepartements / 20) * 100}%` }} // 20 étant un max théorique
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Communes
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {uniqueCommunes} communes
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-green-600"
                  style={{ width: `${(uniqueCommunes / 50) * 100}%` }} // 50 étant un max théorique
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quartiers
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.keys(stats.parQuartier).length} quartiers
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-amber-600"
                  style={{ width: `${(Object.keys(stats.parQuartier).length / 100) * 100}%` }} // 100 étant un max théorique
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau récapitulatif */}
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    Synthèse Géographique Complète
  </h3>

  {/* Onglets */}
  <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
    {['Régions', 'Départements', 'Communes', 'Quartiers'].map((tab) => (
      <button
        key={tab}
        className={`px-4 py-2 font-medium text-sm ${activeTab === tab 
          ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Tableau Régions */}
  {activeTab === 'Régions' && (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('region')}>
              <div className="flex items-center">
                Région
                {sortConfig.key === 'region' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nombre d'actifs
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Pourcentage
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(stats.parRegion)
            .sort((a, b) => b[1] - a[1])
            .map(([region, count]) => (
              <tr key={region} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1">{(count / stats.total * 100).toFixed(1)}%</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Tableau Départements */}
  {activeTab === 'Départements' && (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Département
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Région
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nombre d'actifs
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(stats.parDepartement)
            .sort((a, b) => b[1] - a[1])
            .map(([departement, count]) => {
              const region = filteredActifs.find(a => a.departement === departement)?.region || 'Inconnue';
              return (
                <tr key={departement} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {departement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  )}

  {/* Tableau Communes */}
  {activeTab === 'Communes' && (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher une commune..."
          className="pl-8 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          value={communeSearch}
          onChange={(e) => setCommuneSearch(e.target.value)}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Commune
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Département
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actifs
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(stats.parCommune)
            .filter(([commune]) => 
              commune.toLowerCase().includes(communeSearch.toLowerCase())
            )
            .sort((a, b) => b[1] - a[1])
            .map(([commune, count]) => {
              const dept = filteredActifs.find(a => a.commune === commune)?.departement || 'Inconnu';
              return (
                <tr key={commune} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {commune}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {dept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  )}

  {/* Tableau Quartiers */}
  {activeTab === 'Quartiers' && (
    <div className="overflow-x-auto">
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Rechercher un quartier..."
          className="pl-8 pr-4 py-2 flex-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          value={quartierSearch}
          onChange={(e) => setQuartierSearch(e.target.value)}
        />
        <select
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white text-sm"
          value={selectedCommune}
          onChange={(e) => setSelectedCommune(e.target.value)}
        >
          <option value="">Toutes communes</option>
          {Object.keys(stats.parCommune).map(commune => (
            <option key={commune} value={commune}>{commune}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Quartier
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Commune
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actifs
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {Object.entries(stats.parQuartier)
            .filter(([quartier]) => 
              quartier.toLowerCase().includes(quartierSearch.toLowerCase()) &&
              (selectedCommune === '' || 
               filteredActifs.some(a => a.quartier === quartier && a.commune === selectedCommune))
            )
            .sort((a, b) => b[1] - a[1])
            .map(([quartier, count]) => {
              const commune = filteredActifs.find(a => a.quartier === quartier)?.commune || 'Inconnue';
              return (
                <tr key={quartier} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {quartier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {commune}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {count}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  )}
</div>
    </div>
  );
}