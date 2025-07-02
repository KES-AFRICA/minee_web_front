/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import Statistics from "./Statistics";
import { BarChart3, ChartArea } from "lucide-react";
import Valorisations from "./Valorisations";
import { inventaireActifs, inventaireDeparts } from "@/data/indexActifs";
import Sig from "./SIG";

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [currentView, setCurrentView] = useState<"SIG" | "Valorisations">(
    "SIG"
  );
  const [selectedRegion, setSelectedRegion] = useState("Toutes");
  const [selectedCommune, setSelectedCommune] = useState("Toutes");
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  });

  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalValorisation = useMemo(() => {
    return inventaireActifs.reduce((sum, actif) => {
      return sum + (actif.valorisation || 0);
    }, 0);
  }, []);

  const totalActifs = inventaireActifs.length;
  // calcule des actifs critiques
  const totalActifsParType = useMemo(() => {
    return inventaireActifs.reduce((acc, actif) => {
      acc[actif.etatVisuel] = (acc[actif.etatVisuel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const totalDeparts = inventaireDeparts.length;
  const regions = useMemo(() => {
    const regionSet = new Set(
      inventaireActifs.map((actif: { region: any }) => actif.region)
    );
    return ["Toutes", ...Array.from(regionSet)];
  }, []);

  const communes = useMemo(() => {
    let filteredActifs = inventaireActifs;
    if (selectedRegion !== "Toutes") {
      filteredActifs = inventaireActifs.filter(
        (actif) => actif.region === selectedRegion
      );
    }
    const communeSet = new Set(filteredActifs.map((actif) => actif.commune));
    return ["Toutes", ...Array.from(communeSet)];
  }, [selectedRegion]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4">
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl  font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
              Inventaire et Valorisation des Actifs Électriques
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              ENEO - Tableau de Bord Exécutif
            </p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="text-right">
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Dernière mise à jour
              </p>
              <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                <div className=" bg-teal-600 text-xs md:text-sm p-1  rounded-xl text-white flex items-center justify-center">
                  {currentTime.toLocaleTimeString()}
                </div>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentView(
                    currentView === "SIG" ? "Valorisations" : "SIG"
                  )
                }
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                {currentView === "SIG" ? (
                  <BarChart3 className="w-5 h-5" />
                ) : (
                  <ChartArea className="w-5 h-5" />
                )}
                <span>
                  {currentView === "SIG"
                    ? "Valorisations"
                    : "Système information graphique"}
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="w-[50vw] grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Région
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCommune("Toutes");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commune
            </label>
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {communes.map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedRegion("Toutes");
                setSelectedCommune("Toutes");
              }}
              className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <Statistics
          totalActifs={totalActifs}
          formatCurrency={formatCurrency}
          totalValorisation={totalValorisation}
          totalActifsParType={totalActifsParType}
          totalDeparts={totalDeparts}
        />

        {currentView === "Valorisations" && <Valorisations />}
        {currentView === "SIG" && (
          <Sig
            selectedRegion={selectedRegion}
            selectedCommune={selectedCommune}
          />
        )}
      </div>
    </div>
  );
}
