import { Link, useLocation, useNavigate } from "react-router-dom";

import { navigationLinks } from "./navigationData";
import { type JSX } from "react";
import {
  Settings,
  ChevronRight,
  LayoutDashboard,
  Boxes,
  Map,
  LogOut,
  ChartBar,
  UserCheck,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "./Layout";

interface SidebarProps {
  onItemClick?: () => void;
}

const iconMapping: Record<string, JSX.Element> = {
  dashboard: <LayoutDashboard className="w-5 h-5" />,
  immobilisations: <Boxes className="w-5 h-5" />,
  carte: <Map className="w-5 h-5" />,
  rapport: <ChartBar className="w-5 h-5" />,
  parametres: <Settings className="w-5 h-5" />,
  suivi_inventaire: <UserCheck className="w-5 h-5" />,
};

const Sidebar = ({ onItemClick }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();

  const isActiveLink = (href: string) => {
    return (
      location.pathname === href ||
      (href !== "/" && location.pathname.startsWith(href))
    );
  };

  const handleLogout = () => {
    // AuthService.logout();
    navigate("/login");
  };

  return (
    <div
      className={cn(
        "h-full bg-gradient-to-br bg-white dark:bg-gray-900 shadow-lg  transition-all duration-300 ease-in-out border-r border-teal-200/50 dark:border-teal-700/50",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header Section */}
      <div className="relative p-6 pb-4 border-b border-teal-200/30 dark:border-teal-700/30">
        {/* Logo Container */}
        <div className="relative z-10 flex flex-row gap-2 items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emeral-600 rounded-lg flex items-center justify-center  ring-2 ring-white/20 transition-transform hover:scale-105">
            <Zap className="w-6 h-6 text-white" />
          </div>

          {/* Title - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="ml-2 transition-opacity duration-300">
              <h2 className="text-xl font-bold text-teal-700 dark:text-teal-200 uppercase tracking-wider leading-tight">
                GEO-FIN
              </h2>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigationLinks.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.items.map((link) => {
                const isActive = isActiveLink(link.href);

                return (
                  <div key={link.name} className="relative group">
                    <Link
                      to={link.href}
                      onClick={onItemClick}
                      className={cn(
                        "relative flex items-center rounded-xl transition-all duration-300 ease-out",
                        "hover:bg-white/10 hover:backdrop-blur-sm hover:shadow-lg",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800",
                        isCollapsed
                          ? "px-3 py-3 justify-center"
                          : "px-4 py-3 hover:translate-x-1"
                      )}
                    >
                      {/* Background gradient for active state */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r bg-teal-100 dark:from-teal-800 dark:to-cyan-900 rounded-xl opacity-100" />
                      )}

                      {/* Icon Container */}
                      <div
                        className={cn(
                          "relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-teal-200 dark:bg-teal-900 text-teal-700 dark:text-teal-200"
                            : "text-black dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300"
                        )}
                      >
                        {link.iconName && iconMapping[link.iconName]}
                      </div>

                      {/* Text - Hidden when collapsed */}
                      {!isCollapsed && (
                        <>
                          <span
                            className={cn(
                              "relative z-10 ml-3 text-sm font-medium transition-colors duration-300",
                              isActive
                                ? "text-teal-900 dark:text-teal-100"
                                : "text-black dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-200"
                            )}
                          >
                            {link.name}
                          </span>

                          {/* Active indicator */}
                          {isActive && (
                            <div className="relative z-10 ml-auto">
                              <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-300" />
                            </div>
                          )}
                        </>
                      )}

                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg">
                        {link.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/10 ">
        <div className="relative group">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/20 dark:hover:bg-teal-950/30 rounded-lg transition-all duration-200 text-sm font-medium group",
              isCollapsed ? "justify-center" : "justify-center"
            )}
          >
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>

          {/* Tooltip for logout when collapsed */}
          {isCollapsed && (
            <div className="absolute left-full ml-3 bottom-3 bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg">
              Déconnexion
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
