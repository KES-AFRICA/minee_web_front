import { User, UserCheck, UserX, Shield } from "lucide-react";
import { Users } from "../../../data/utiliateur";

export default function UtilisateurKPI() {
  const stats = [
    {
      label: "Total Utilisateurs",
      value: Users.length,
      icon: User,
      bgColor: "bg-cyan-100 dark:bg-cyan-900/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      borderColor: "border-cyan-200 dark:border-cyan-800",
    },
    {
      label: "Utilisateurs Actifs",
      value: Users.filter((user) => user.status === "Actif").length,
      icon: UserCheck,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Utilisateurs Inactifs",
      value: Users.filter((user) => user.status === "Inactif").length,
      icon: UserX,
      bgColor: "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
      borderColor: "border-teal-200 dark:border-teal-800",
    },
    {
      label: "Utilisateurs Bloqués",
      value: Users.filter((user) => user.status === "Bloqué").length,
      icon: Shield,
      bgColor: "bg-red-100 dark:bg-red-900/50",
      iconColor: "text-red-600 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
    },
  ];

  return (
    <div className="h-auto bg-gray-50 dark:bg-gray-900 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`
                  relative overflow-hidden rounded-2xl shadow-md bg-white dark:bg-gray-800/10 border border-gray-100 dark:border-gray-700
                  transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1
                  group cursor-pointer
                `}
            >
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col justify-start ">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`
                      p-3 rounded-xl ${stat.iconColor} 
                      backdrop-blur-sm ${stat.bgColor}
                      group-hover:scale-110 transition-transform duration-300
                    `}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>{" "}
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </p>
                  </div>
                  <div className="flex justify-center  items-center ">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>

                {/* Barre de progression décorative */}
                {/* <div className="mt-4 h-1 bg-white/30 dark:bg-gray-700/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stat.iconColor.replace(
                      "text-",
                      "bg-"
                    )} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${Math.min(
                        (stat.value / Users.length) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
