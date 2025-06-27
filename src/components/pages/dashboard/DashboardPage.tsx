/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  MapPin,
  DollarSign,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  typeActifs,
  actifsByRegion,
  etatActifs,
  evolutionValeur,
} from "../../../data/dashboard";
import type { ActifByRegion, KPICardProps } from "./types";

export default function DashboardPage() {
  const totalActifs = typeActifs.reduce((sum, item) => sum + item.value, 0);
  const valeurTotale = actifsByRegion.reduce(
    (sum, region) => sum + region.valeur,
    0
  );

  const KPICard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = "teal",
  }: KPICardProps) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div
          className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${
            color === "teal"
              ? "from-teal-500 to-teal-600"
              : color === "cyan"
              ? "from-cyan-500 to-cyan-600"
              : "from-emerald-500 to-emerald-600"
          }`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend === "up"
                ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const formatCurrency = (value: number | bigint) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-2 md:p-4">
      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
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
                  26 Juin 2025
                </p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard
            title="Total des Actifs"
            value={totalActifs.toLocaleString()}
            subtitle="Équipements répertoriés"
            icon={Activity}
            trend="up"
            trendValue="+5.2%"
            color="teal"
          />
          <KPICard
            title="Valeur Totale"
            value={formatCurrency(valeurTotale)}
            subtitle="Patrimoine électrique"
            icon={DollarSign}
            trend="up"
            trendValue="+3.8%"
            color="cyan"
          />
          <KPICard
            title="Zones Couvertes"
            value="10"
            subtitle="Régions du Cameroun"
            icon={MapPin}
            color="emerald"
          />
          <KPICard
            title="Actifs Critiques"
            value="1,000"
            subtitle="Nécessitent maintenance"
            icon={AlertTriangle}
            trend="down"
            trendValue="-2.1%"
            color="teal"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Répartition par Type d'Actifs */}
          <div className="bg-white col-span-2 dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              Répartition par Type d'Actifs
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full h-64 md:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeActifs}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeActifs.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: { toLocaleString: () => any }) => [
                        value.toLocaleString(),
                        "Nombre",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 w-full">
                {typeActifs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* État des Actifs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              État des Actifs
            </h3>
            <div className="space-y-3 md:space-y-4">
              {etatActifs.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.etat === "Excellent"
                          ? "bg-emerald-500"
                          : item.etat === "Bon"
                          ? "bg-teal-500"
                          : item.etat === "Moyen"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm md:text-base font-medium text-gray-900 dark:text-white">
                      {item.etat}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                      {item.count.toLocaleString()}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 ml-1 md:ml-2">
                      ({item.pourcentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                  Taux de disponibilité
                </span>
                <span className="text-xl md:text-2xl font-bold text-teal-600 dark:text-teal-400">
                  91%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Répartition par Région */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              Actifs par Région
            </h3>
            <div className="h-64 md:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={actifsByRegion.slice(0, 6) as ActifByRegion[]}
                  margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="region"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis fontSize={12} tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "#111827",
                    }}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === "transformateurs"
                        ? "Transformateurs"
                        : name === "lignes"
                        ? "Lignes"
                        : "Postes",
                    ]}
                  />
                  <Bar
                    dataKey="transformateurs"
                    fill="#0D9488"
                    name="transformateurs"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="lignes"
                    fill="#06B6D4"
                    name="lignes"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="postes"
                    fill="#14B8A6"
                    name="postes"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Évolution de la Valeur */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
              Évolution de la Valeur du Patrimoine
            </h3>
            <div className="h-64 md:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={evolutionValeur}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="mois"
                    fontSize={12}
                    tick={{ fill: "#6b7280" }}
                  />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderColor: "#e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      color: "#111827",
                    }}
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === "valeur"
                        ? "Valeur Patrimoine"
                        : "Coûts Maintenance",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="valeur"
                    stroke="#0D9488"
                    fill="url(#colorValeur)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="maintenance"
                    stroke="#06B6D4"
                    fill="url(#colorMaintenance)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="colorValeur"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#0D9488"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorMaintenance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#06B6D4"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section - Top Régions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            Classement des Régions par Valeur d'Actifs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            {actifsByRegion
              .sort((a, b) => b.valeur - a.valeur)
              .slice(0, 5)
              .map((region, index) => (
                <div
                  key={region.region}
                  className="p-3 md:p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <span
                      className={`text-base md:text-lg font-bold ${
                        index === 0
                          ? "text-yellow-600 dark:text-yellow-400"
                          : index === 1
                          ? "text-gray-600 dark:text-gray-300"
                          : index === 2
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-1">
                    {region.region}
                  </h4>
                  <p className="text-xs md:text-sm font-semibold text-teal-600 dark:text-teal-400 mb-1 md:mb-2">
                    {formatCurrency(region.valeur)}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Transformateurs: {region.transformateurs}</div>
                    <div>Lignes: {region.lignes}</div>
                    <div>Postes: {region.postes}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
