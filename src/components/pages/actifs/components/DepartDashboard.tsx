import type { Actif, Depart } from "@/types";
import { Activity, GitBranch, TrendingUp, Map } from "lucide-react";

export function DepartDashboard({
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