/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useMemo } from "react";
import { MapPin, Filter, Building2 } from "lucide-react";
import { regionsData } from "../../../data/dashboard";

function RegionalClass({
  formatCurrency,
}: {
  formatCurrency: (value: number | bigint) => string;
}) {
  type RegionKey = keyof typeof regionsData;
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | "">("");
  const [selectedCommunes, setSelectedCommunes] = useState<string[]>([]);
  const [selectedActifTypes, setSelectedActifTypes] = useState<string[]>([]);

  const formatNumber = (value: number | bigint) => {
    return new Intl.NumberFormat("fr-FR").format(value);
  };
  const communes =
    selectedRegion && selectedRegion in regionsData
      ? regionsData[selectedRegion].communes
      : [];

  const filteredData = useMemo(() => {
    if (!selectedRegion) return [];

    const regionCommunes = regionsData[selectedRegion].communes;
    const communesToShow =
      selectedCommunes.length > 0
        ? regionCommunes.filter((c: { name: any }) =>
            selectedCommunes.includes(c.name)
          )
        : regionCommunes;

    return communesToShow.map(
      (commune: {
        name: string;
        actifs: {
          transformateurs: number;
          lignes: number;
          postes: number;
          poteaux: number;
        };
      }) => {
        const actifs = commune.actifs;
        const total = Object.values(actifs).reduce(
          (sum: number, val: any) => sum + Number(val),
          0
        );
        const valeurEstimee = total * 125000; // Estimation de valeur

        return {
          name: commune.name,
          actifs: commune.actifs,
          totalActifs: total,
          valeurEstimee,
        };
      }
    );
  }, [selectedRegion, selectedCommunes]);

  const handleCommuneToggle = (communeName: any) => {
    setSelectedCommunes((prev) =>
      prev.includes(communeName)
        ? prev.filter((c) => c !== communeName)
        : [...prev, communeName]
    );
  };

  const handleActifTypeToggle = (actifName: string) => {
    setSelectedActifTypes((prev) =>
      prev.includes(actifName)
        ? prev.filter((a) => a !== actifName)
        : [...prev, actifName]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6">
      {/* Filtres */}
      <div>
        {/* Sélection Région */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-gray-900">Région</h3>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value as RegionKey | "");
                setSelectedCommunes([]);
              }}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5"
            >
              <option value="">Toutes les Régions</option>
              {Object.keys(regionsData).map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Communes</h3>
              {selectedRegion && (
                <span className="text-sm text-gray-500">
                  ({communes.length})
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedRegion ? (
                communes.map((commune: { name: string }) => (
                  <label
                    key={commune.name}
                    className="flex items-center cursor-pointer group p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCommunes.includes(commune.name)}
                      onChange={() => handleCommuneToggle(commune.name)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <span className=" text-gray-900 font-medium transition-colors">
                      {commune.name}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 italic p-2">
                  Sélectionnez d'abord une région
                </p>
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Types d'Actifs
              </h3>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {typeActifs.map(
                (actif: {
                  name: boolean;
                  color: any;
                  value: number | bigint;
                }) => {
                  return (
                    <label
                      key={actif.name}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedActifTypes.includes(actif.name)}
                        onChange={() => handleActifTypeToggle(actif.name)}
                        className="w-4 h-4 focus:ring-2 rounded"
                        style={{ accentColor: actif.color }}
                      />
                      <span className="text-gray-900 font-medium group-hover:opacity-80 transition-opacity text-sm">
                        {actif.name}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        {formatNumber(actif.value)}
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        {/* Classement des Communes */}
        {filteredData.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Classement des Communes - {selectedRegion}
            </h3>
            {filteredData
              .sort(
                (a: { valeurEstimee: number }, b: { valeurEstimee: number }) =>
                  b.valeurEstimee - a.valeurEstimee
              )
              .map(
                (
                  commune: {
                    name: string;
                    valeurEstimee: number;
                    actifs: {
                      transformateurs: number;
                      lignes: number;
                      postes: number;
                      poteaux: number;
                    };
                    totalActifs: number;
                  },
                  index: number
                ) => (
                  <div
                    key={commune.name}
                    className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-lg font-bold px-3 py-1 rounded-full ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <MapPin className="w-5 h-5 text-gray-500" />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      {commune.name}
                    </h4>

                    <p className="text-sm font-semibold text-teal-600 mb-3">
                      {formatCurrency(commune.valeurEstimee)}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        Transformateurs:{" "}
                        <span className="font-semibold">
                          {commune.actifs.transformateurs}
                        </span>
                      </div>
                      <div>
                        Lignes:{" "}
                        <span className="font-semibold">
                          {commune.actifs.lignes}
                        </span>
                      </div>
                      <div>
                        Postes:{" "}
                        <span className="font-semibold">
                          {commune.actifs.postes}
                        </span>
                      </div>
                      <div>
                        Poteaux:{" "}
                        <span className="font-semibold">
                          {commune.actifs.poteaux}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">
                        Total Actifs: {formatNumber(commune.totalActifs)}
                      </div>
                    </div>
                  </div>
                )
              )}
          </div>
        )}

        {/* Message d'état vide */}
        {!selectedRegion && (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sélectionnez une région pour commencer
            </h3>
            <p className="text-gray-600">
              Choisissez une région pour voir le classement des communes et
              leurs actifs électriques.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegionalClass;
