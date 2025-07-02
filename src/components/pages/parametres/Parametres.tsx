import { Bell, LogOut, User,  Users2, ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Utilisateur from "../utilisateur/Utilisateur";
import Profile from "./component/Profile";
import Notifications from "./component/Notifications";

/* eslint-disable @typescript-eslint/no-unused-vars */
const tabRoutes = {
  profile: "/parametres/profile",
  notifications: "/parametres/notifications",
  utilisateurs: "/parametres/utilisateurs",
};

const tabConfig = {
  profile: { label: "Profile Utilisateur", icon: User },
  utilisateurs: { label: "Utilisateurs", icon: Users2 },
  notifications: { label: "Notifications", icon: Bell },
};

export default function Parametres() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Détermine l'onglet actif en fonction de l'URL
  const getInitialTab = useCallback(() => {
    const path = location.pathname;
    const currentTab = Object.entries(tabRoutes).find(
      ([_, route]) => path === route || path.startsWith(route)
    );
    return currentTab ? currentTab[0] : "profile";
  }, [location.pathname]);

  type TabKey = keyof typeof tabRoutes;
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab() as TabKey);
  const handleTabChange = (value: string): void => {
    const tabValue = value as TabKey;
    setActiveTab(tabValue);
    navigate(tabRoutes[tabValue]);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const currentTab = getInitialTab();
    if (currentTab !== activeTab) {
      setActiveTab(currentTab as TabKey);
    }
    if (currentTab === "profile" && location.pathname === "/parametres") {
      navigate(tabRoutes.profile);
    }
  }, [activeTab, getInitialTab, location.pathname, navigate]);
  const ActiveIcon = tabConfig[activeTab].icon;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Paramètres de l'Application
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gérer vos préférences et configurations
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 min-w-48"
          >
            <ActiveIcon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium flex-1 text-left">
              {tabConfig[activeTab].label}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6">
        {isDropdownOpen && (
          <div className="absolute right-10 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="py-2">
              {Object.entries(tabConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleTabChange(key)}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                      activeTab === key
                        ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{config.label}</span>
                  </button>
                );
              })}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

              <button
                onClick={() => alert("Déconnexion effectuée")}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex-1">
          {activeTab === "utilisateurs" && <Utilisateur />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "notifications" && <Notifications />}
        </div>

        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
