import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  MapPin,
  AlertTriangle,
  Activity,
} from "lucide-react";
import type { KPICardProps } from "./types";
import { useEffect, useState } from "react";

const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "teal",
  delay = 0,
}: KPICardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    teal: {
      gradient: "from-teal-400 via-teal-500 to-teal-600",
      glow: "shadow-teal-500/30",
      bg: "bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
      border: "border-teal-200/50 dark:border-teal-500/30",
    },
    cyan: {
      gradient: "from-cyan-400 via-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/30",
      bg: "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
      border: "border-cyan-200/50 dark:border-cyan-500/30",
    },
    emerald: {
      gradient: "from-emerald-400 via-emerald-500 to-green-500",
      glow: "shadow-emerald-500/30",
      bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
      border: "border-emerald-200/50 dark:border-emerald-500/30",
    },
    amber: {
      gradient: "from-amber-400 via-orange-500 to-red-500",
      glow: "shadow-amber-500/30",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
      border: "border-amber-200/50 dark:border-amber-500/30",
    },
  };

  const currentColor = colorClasses[color];
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-700 ease-out transform hover:scale-105 cursor-pointer
        ${currentColor.bg} ${currentColor.border} border-2
        backdrop-blur-xl bg-opacity-80 dark:bg-opacity-30
        hover:shadow-sm ${currentColor.glow}
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div
          className={`relative p-4 rounded-2xl bg-gradient-to-br ${currentColor.gradient} ${currentColor.glow}  group-hover:shadow-xs transition-all duration-300`}
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
};

export default function Statistics({
  totalActifs,
  formatCurrency,
  totalValorisation,
  totalActifsParType,
  totalDeparts,
}: {
  totalActifs: number;
  totalDeparts: number;
  formatCurrency: (value: number | bigint) => string;
  totalValorisation: number;
  totalActifsParType: number | Record<string, number>;
}) {
  return (
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
        title="Actifs critiques"
        value={
          typeof totalActifsParType === "number"
            ? totalActifsParType
            : Object.keys(totalActifsParType).length
        }
        subtitle="Necessitant une maintenance "
        icon={AlertTriangle}
        trend="down"
        trendValue="-2.1%"
        color="amber"
      />
      <KPICard
        title="Valeur Net Comptable"
        value={formatCurrency(totalValorisation * 1000000)}
        subtitle="Patrimoine électrique"
        icon={DollarSign}
        trend="up"
        trendValue="+3.8%"
        color="cyan"
      />
      <KPICard
        title="Total des Départs"
        value={totalDeparts}
        subtitle="Departs repertoriés"
        icon={MapPin}
        color="emerald"
      />
    </div>
  );
}
