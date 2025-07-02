/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapPin, BarChart3, Activity } from "lucide-react";
import { inventaireActifs, inventaireDeparts } from "@/data/indexActifs";
import { Pagination } from "antd";
import ReactECharts from "echarts-for-react";

const page_size = 5;
function Valorisations() {
  const [currentPageDeparts, setCurrentPageDeparts] = useState(1);
  // Génère un objet de valorisation par type à partir des actifs
  const valorisationData = useMemo(() => {
    return inventaireActifs.reduce((acc, actif) => {
      if (!acc[actif.type]) {
        acc[actif.type] = 0;
      }
      acc[actif.type] += actif.valorisation;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Calculs des données pour les graphiques
  const valorisationParType = useMemo(() => {
    return Object.entries(valorisationData).map(([type, value]) => ({
      type: type.replace(/_/g, " "),
      valorisation: value,
      nombre: inventaireActifs.filter((a) => a.type === type).length,
    }));
  }, [valorisationData]);

  const valorisationParCommune = useMemo(() => {
    const communeData = inventaireActifs
      .filter(
        (actif) => actif.region === "Littoral" || actif.region === "Centre"
      )
      .reduce(
        (
          acc: {
            [key: string]: {
              commune: string;
              valorisation: number;
              nombre: number;
              region: string;
            };
          },
          actif
        ) => {
          if (!acc[actif.commune]) {
            acc[actif.commune] = {
              commune: actif.commune,
              valorisation: 0,
              nombre: 0,
              region: actif.region,
            };
          }
          acc[actif.commune].valorisation += actif.valorisation;
          acc[actif.commune].nombre += 1;
          return acc;
        },
        {}
      );
    return Object.values(communeData);
  }, []);

  const valorisationParDepart = useMemo(() => {
    return inventaireDeparts.map((depart) => {
      // Calculer la valorisation totale des actifs de ce départ
      const valorisationTotale = depart.actifs.reduce((total, actifId) => {
        const actif = inventaireActifs.find((a) => a.id === actifId);
        return total + (actif?.valorisation || 0);
      }, 0);

      return {
        id: depart.id,
        nom: depart.nom,
        valorisation: valorisationTotale,
        nombreActifs: depart.actifs.length,
        posteOrigine: depart.posteOrigine,
        type: depart.typeDepart,
        etat: depart.etatGeneral,
        regions: depart.zonesGeographiques.regions.join(", "),
        communes: depart.zonesGeographiques.communes.join(", "),
      };
    });
  }, []);
  
  const paginatedDepartsTable = useMemo(() => {
    const start = (currentPageDeparts - 1) * page_size;
    return valorisationParDepart.slice(start, start + page_size);
  }, [currentPageDeparts, valorisationParDepart]);

  const handlePageChangeDeparts = (page: number) => {
    setCurrentPageDeparts(page);
  };
  return (
    <div className="min-h-screen">
      <div className=" mx-auto ">
        <div className="space-y-1">
          {/* Graphiques de Valorisation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800  rounded-lg shadow p-6">
              <h3 className="text-lg dark:text-white font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Valorisation par Actif
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={valorisationParType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="type"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}M FCFA`, "Valorisation"]}
                  />
                  <Bar dataKey="valorisation" fill="#008080" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Valorisation par Commune (Littoral & Centre)
              </h3>
              <div style={{ width: "100%", height: "350px" }}>
                <ReactECharts
                  option={{
                    backgroundColor: "transparent",
                    tooltip: {
                      trigger: "item",
                      formatter: (params: { value: any; name: any }) => {
                        const value =
                          typeof params.value === "number"
                            ? params.value
                            : Number(params.value);
                        return `${params.name}<br/>${value.toFixed(1)}M FCFA`;
                      },
                    },
                    series: [
                      {
                        name: "Valorisation",
                        type: "pie",
                        radius: [20, "80%"],
                        center: ["50%", "55%"],
                        roseType: "area",
                        itemStyle: {
                          borderRadius: 5,
                          borderColor: "#fff",
                          borderWidth: 2,
                        },
                        label: {
                          show: true,
                          formatter: "{b}: {c}M FCFA",
                          fontSize: 11,
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: 13,
                            fontWeight: "bold",
                          },
                        },
                        data: valorisationParCommune.map((item) => ({
                          name: item.commune,
                          value:
                            typeof item.valorisation === "number"
                              ? item.valorisation
                              : Number(item.valorisation),
                        })),
                      },
                    ],
                    color: [
                      "#0097a7",
                      "#80cbc4",
                      "#004d40",
                      "#ff9800",
                      "#a4de6c",
                      "#00e5ff",
                      "#03a9f4",
                    ], // Gardez les couleurs similaires
                  }}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 gap-6">
            <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-orange-600" />
                Valorisation par Départ
              </h3>
              {/* <div className="mb-8">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={valorisationParDepart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="nom"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}M FCFA`, "Valorisation"]}
                    />
                    <Bar dataKey="valorisation" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}

              {/* Tableau des départs */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Départ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Régions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Communes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre d'Actifs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valorisation (M FCFA)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedDepartsTable
                      .sort((a, b) => b.valorisation - a.valorisation)
                      .map((depart, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {depart.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {depart.nom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {depart.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {depart.regions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {depart.communes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {depart.nombreActifs}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                            {depart.valorisation.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4 p-4 rounded-b-xl border-t border-gray-200">
                  <Pagination
                    current={currentPageDeparts}
                    pageSize={page_size}
                    total={valorisationParDepart.length}
                    onChange={handlePageChangeDeparts}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Valorisations;
