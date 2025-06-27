import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Palette,
  Sun,
  Moon,
  Monitor,
  ChevronRight,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

interface HeaderProps {
  mobileMenuTrigger?: React.ReactNode;
}

const Header = ({ mobileMenuTrigger }: HeaderProps) => {

  const { theme, setTheme, } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
      setIsNotificationOpen(false);
      setIsThemeOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const getCurrentPath = (path: string) => {
    const parts = path.split("/");
    return parts[parts.length - 1] || "Tableau de bord";
  };

  const handleLogout = () => {
    // AuthService.logout();
    navigate("/login");
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const themeOptions = [
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
    { value: "system", label: "Système", icon: Monitor },
  ];

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-teal-200/30 dark:border-teal-700/30">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section - Mobile Menu + Title */}
        <div className="flex items-center gap-4">
          {mobileMenuTrigger}
          <div className="hidden sm:block">
            <h1 className="text-xl capitalize font-bold text-teal-800 dark:text-teal-200">
              {getCurrentPath(window.location.pathname)}
            </h1>
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 group"
            >
              <Bell className="w-5 h-5 text-teal-600 dark:text-teal-300 group-hover:text-teal-700 dark:group-hover:text-teal-200 transition-colors" />
            </button>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-300 group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-teal-100 dark:ring-teal-800 group-hover:ring-teal-200 dark:group-hover:ring-teal-700 transition-all">
                <User className="w-5 h-5 text-white" />
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-teal-800 dark:text-teal-200">
                  Admin
                </div>
                <div className="text-xs text-teal-600 dark:text-teal-400">
                  Administrateur
                </div>
              </div>

              {/* Chevron */}
              <ChevronDown className="w-4 h-4 text-teal-500 dark:text-teal-400 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-all duration-300 group-hover:rotate-180" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-teal-100 dark:border-teal-700/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-teal-100 dark:border-teal-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-800 dark:text-teal-200">
                        Admin
                      </div>
                      <div className="text-xs text-teal-600 dark:text-teal-400">
                        admin@eneo.com
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => navigate("/parametres")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Paramètres</span>
                  </button>

                  {/* Theme Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsThemeOpen(!isThemeOpen);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Thème</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getThemeIcon()}
                        <ChevronRight
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isThemeOpen ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Theme Sub-dropdown */}
                    {isThemeOpen && (
                      <div className="absolute right-full top-0 ml-2 w-44 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-teal-100 dark:border-teal-700/50 py-2 z-50 animate-in slide-in-from-left-2 duration-200">
                        {themeOptions.map((option) => {
                          const IconComponent = option.icon;
                          const isActive = theme === option.value;

                          return (
                            <button
                              key={option.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTheme(
                                  option.value as "light" | "dark" | "system"
                                );
                                setIsThemeOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 group ${
                                isActive
                                  ? "bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200"
                                  : "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                              }`}
                            >
                              <IconComponent
                                className={`w-4 h-4 ${
                                  isActive
                                    ? "text-teal-600 dark:text-teal-300"
                                    : ""
                                }`}
                              />
                              <span className="flex-1 text-left">
                                {option.label}
                              </span>
                              {isActive && (
                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-teal-100 dark:border-teal-700/50 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group rounded-lg mx-2"
                    >
                      <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
