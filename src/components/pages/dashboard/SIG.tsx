/* eslint-disable @typescript-eslint/no-explicit-any */
import { inventaireActifs, inventaireDeparts } from "@/data/indexActifs";
import { useMemo, useState, type Key } from "react";
import ReactECharts from "echarts-for-react";
import { Colors } from "./types";
import { Pagination } from "antd";

const page_size = 5;
export default function Sig({
  selectedRegion,
  selectedCommune,
}: {
  selectedRegion: string;
  selectedCommune: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"departs" | "regions">("departs");
  const handleTabChange = (tab: "departs" | "regions") => {
    setActiveTab(tab);
  };
  // Données filtrées pour les actifs
  const filteredActifs = useMemo(() => {
    return inventaireActifs.filter((actif) => {
      const regionMatch =
        selectedRegion === "Toutes" || actif.region === selectedRegion;
      const communeMatch =
        selectedCommune === "Toutes" || actif.commune === selectedCommune;
      return regionMatch && communeMatch;
    });
  }, [selectedRegion, selectedCommune]);

  // Données pour les départements avec actifs filtrés
  const departsData = useMemo(() => {
    return inventaireDeparts
      .map((depart) => {
        const actifsInDepart = depart.actifs.filter((actifId) =>
          filteredActifs.some((actif) => actif.id === actifId)
        ).length;

        return {
          ...depart,
          nombreActifs: actifsInDepart,
          color: Colors[inventaireDeparts.indexOf(depart) % Colors.length],
        };
      })
      .filter((depart) => depart.nombreActifs > 0);
  }, [filteredActifs]);

  // Données par région FILTRÉES
  const regionData = useMemo(() => {
    type RegionMapValue = {
      name: string;
      value: number;
      communes: Set<string>;
      types: { [type: string]: number };
    };
    const regionMap: { [region: string]: RegionMapValue } = {};

    // Utiliser filteredActifs au lieu de inventaireActifs
    filteredActifs.forEach((actif) => {
      if (!regionMap[actif.region]) {
        regionMap[actif.region] = {
          name: actif.region,
          value: 0,
          communes: new Set(),
          types: {},
        };
      }
      regionMap[actif.region].value += 1;
      regionMap[actif.region].communes.add(actif.commune);

      if (!regionMap[actif.region].types[actif.type]) {
        regionMap[actif.region].types[actif.type] = 0;
      }
      regionMap[actif.region].types[actif.type] += 1;
    });

    return Object.values(regionMap).map((region, index) => ({
      ...region,
      communes: Array.from(region.communes),
      color: Colors[index % Colors.length],
    }));
  }, [filteredActifs]);

  // pagination pour les tables des departs et regions
  const pagination = useMemo(() => {
    const startIndex = (currentPage - 1) * page_size;
    const endIndex = startIndex + page_size;
    return departsData.slice(startIndex, endIndex);
  }, [currentPage, departsData]);

  const paginationRegion = useMemo(() => {
    const startIndex = (currentPage - 1) * page_size;
    const endIndex = startIndex + page_size;
    return regionData.slice(startIndex, endIndex);
  }, [currentPage, regionData]);
  // Types d'actifs présents dans les données filtrées
  const availableTypes = useMemo(() => {
    return [...new Set(filteredActifs.map((actif) => actif.type))];
  }, [filteredActifs]);

  // Configuration AMÉLIORÉE pour le graphique en barres (régions)
  const barOption = {
    backgroundColor: "transparent",
    title: {
      text: "Immobilisations par Région",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: "#374151",
      },
      formatter: (params: any[]) => {
        let result = `<div style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${params[0].axisValue}</div>`;
        let total = 0;
        params.forEach((param: { seriesName: any; value: any; color: any }) => {
          if (param.value > 0) {
            result += `<div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="display: inline-block; width: 12px; height: 12px; background-color: ${param.color}; border-radius: 2px; margin-right: 8px;"></span>
              <span style="flex: 1;">${param.seriesName}: <strong>${param.value}</strong></span>
            </div>`;
            total += param.value;
          }
        });
        result += `<div style="border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 4px; font-weight: bold;">Total: ${total}</div>`;
        return result;
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "20%",
      top: "25%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: regionData.map((region) => region.name),
      axisLabel: {
        rotate: 45,
        fontSize: 11,
        color: "#6b7280",
        margin: 10,
      },
      axisLine: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
      axisTick: {
        lineStyle: {
          color: "#e5e7eb",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "Nombre d'actifs",
      nameTextStyle: {
        fontSize: 12,
        color: "#6b7280",
        padding: [0, 0, 0, -5],
      },
      axisLabel: {
        fontSize: 11,
        color: "#6b7280",
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#f3f4f6",
          type: "dashed",
        },
      },
    },
    // CORRECTION: Utiliser seulement les types disponibles dans les données filtrées
    series: availableTypes.map((type, index) => ({
      name: type.replace(/_/g, " "),
      type: "bar",
      stack: "total",
      data: regionData.map((region) => region.types[type] || 0),
      itemStyle: {
        color: Colors[index % Colors.length],
        borderRadius: [2, 2, 0, 0],
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 8,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
      },
      barMaxWidth: 60,
    })),
    animationDuration: 1000,
    animationEasing: "cubicOut",
  };

  // Configuration pour le graphique en secteurs (départements)
  const pieOption = {
    backgroundColor: "transparent",
    title: {
      text: "Répartition des immobilisations par Départs",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#374151",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: { name: string; value: any; percent: any }) => {
        const depart = departsData.find((d) => d.nom === params.name);
        return `
            <strong>${params.name}</strong><br/>
            Actifs: ${params.value}<br/>
            Pourcentage: ${params.percent}%<br/>
            Type: ${depart?.typeDepart}<br/>
            Longueur: ${depart?.longueurTotale} km<br/>
          `;
      },
    },
    series: [
      {
        type: "pie",
        radius: ["30%", "60%"],
        center: ["35%", "50%"],
        data: departsData.map((depart) => ({
          name: depart.nom,
          value: depart.nombreActifs,
          itemStyle: {
            color: depart.color,
            borderRadius: 5,
            borderColor: "#fff",
            borderWidth: 2,
          },
        })),
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}\n{c} actifs",
          fontSize: 10,
          fontWeight: "normal",
          color: "#374151",
          minMargin: 5,
          lineHeight: 12,
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5,
          smooth: false,
          lineStyle: {
            color: "#999",
            width: 1,
          },
        },
        avoidLabelOverlap: true,
      },
    ],
  };

  const totalActifsType = useMemo(() => {
    // Utiliser filteredActifs au lieu de inventaireActifs pour que le filtre fonctionne
    return filteredActifs.reduce((acc, actif) => {
      const type = actif.type;
      if (!acc[type]) {
        acc[type] = {
          name: type,
          value: 0,
          color: Colors[Object.keys(acc).length % Colors.length],
        };
      }
      acc[type].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number; color?: string }>);
  }, [filteredActifs]);

  // comptage des actifs par etat FILTRÉS
  const totalActifsEtat = useMemo(() => {
    const stats = filteredActifs.reduce((acc, actif) => {
      const etat = actif.etatVisuel;
      if (!acc[etat]) {
        acc[etat] = { etat, count: 0, pourcentage: 0 };
      }
      acc[etat].count += 1;
      return acc;
    }, {} as Record<string, { etat: string; count: number; pourcentage: number }>);

    // Calculer les pourcentages
    const total = filteredActifs.length;
    Object.values(stats).forEach((stat) => {
      stat.pourcentage = Math.round((stat.count / total) * 100);
    });

    return stats;
  }, [filteredActifs]);

  // Fonction pour obtenir la couleur selon l'état
  const getEtatColor = (etat: string) => {
    switch (etat) {
      case "Excellent":
        return "bg-emerald-500";
      case "Bon":
        return "bg-teal-500";
      case "Moyen":
        return "bg-yellow-500";
      case "Mauvais":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEtatBgColor = (etat: string) => {
    switch (etat) {
      case "Excellent":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
      case "Bon":
        return "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800";
      case "Moyen":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "Mauvais":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 h-[500px] rounded-lg p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Répartition par Type d'Actifs
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-full h-64 md:h-72 lg:h-80">
              <ReactECharts
                option={{
                  backgroundColor: "transparent",
                  tooltip: {
                    trigger: "item",
                    formatter: (params: { name: string; value: number }) => {
                      return `${
                        params.name
                      }: ${params.value.toLocaleString()} actifs`;
                    },
                  },
                  series: [
                    {
                      type: "pie",
                      radius: [50, 150],
                      center: ["50%", "50%"],
                      roseType: "area",
                      itemStyle: {
                        borderRadius: 8,
                      },
                      label: {
                        show: true,
                        position: "outside",
                        formatter: "{b}: {c} ({d}%)",
                        fontSize: 12,
                        color: "#333",
                      },
                      data: Object.values(totalActifsType).map((item) => ({
                        name: item.name,
                        value: item.value,
                        itemStyle: {
                          color: item.color || "#8884d8",
                        },
                      })),
                      labelLine: { show: false },
                      animationType: "scale",
                      animationEasing: "elasticOut",
                      animationDelay: function (idx: number) {
                        return idx * 100;
                      },
                    },
                  ],
                }}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            État des Actifs
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.values(totalActifsEtat).map(
              (
                item: {
                  etat: string;
                  count: number;
                  pourcentage: number;
                },
                index: Key | null | undefined
              ) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${getEtatBgColor(
                    item.etat
                  )} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${getEtatColor(
                          item.etat
                        )} shadow-sm`}
                      ></div>
                      <div>
                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                          {item.etat}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {item.pourcentage}% du total
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getEtatColor(
                            item.etat
                          )} transition-all duration-500`}
                          style={{ width: `${item.pourcentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.count.toLocaleString()}{" "}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          actifs
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400"></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* Graphiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="col-span-2 bg-white dark:bg-gray-800 ml-3 rounded-lg shadow-md p-6 mb-6 h-[500px]">
            <ReactECharts
              option={pieOption}
              style={{
                height: "100%",
                width: "100%",
                marginLeft: "50px",
                color: "#fff",
              }}
              opts={{ renderer: "canvas" }}
            />
          </div>

          <div className="h-[500px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
            <ReactECharts
              option={barOption}
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: "canvas" }}
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="p-2">
          <div className="mb-3 flex items-end justify-end space-x-2">
            <button
              className={`px-3 py-1 rounded-md ${
                activeTab === "departs"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => handleTabChange("departs")}
            >
              Details des departs
            </button>

            <button
              className={`px-3 py-1 rounded-md ${
                activeTab === "regions"
                  ? "bg-teal-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => handleTabChange("regions")}
            >
              Details des regions
            </button>
          </div>
          {activeTab === "departs" && (
            <div className=" bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Departs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nombre d'Actifs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actif
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Longueur (km)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        État
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pagination.map((depart) => (
                      <tr
                        key={depart.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {depart.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {depart.nombreActifs}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {depart.actifs.map((actif) => actif).join(", ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              depart.typeDepart === "Principal"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : depart.typeDepart === "Industriel"
                                ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                                : depart.typeDepart === "Commercial"
                                ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {depart.typeDepart}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {depart.longueurTotale} km
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              depart.etatGeneral === "En service"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {depart.etatGeneral}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4 p-4 border-t border-t-gray-200 dark:bg-teal-900/20 rounded-b-xl">
                <Pagination
                  current={currentPage}
                  pageSize={page_size}
                  total={pagination.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          )}
          {activeTab === "regions" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Région
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Nombre d'Actifs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Communes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        État
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paginationRegion.map((region) => (
                      <tr
                        key={region.name}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {region.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {region.value}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {region.communes.join(", ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            Actif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4 p-4 border-t border-t-gray-200  dark:bg-teal-900/20 rounded-b-xl">
                <Pagination
                  current={currentPage}
                  pageSize={page_size}
                  total={paginationRegion.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
