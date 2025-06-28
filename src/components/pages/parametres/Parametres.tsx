import { useState } from "react";
import {
  User,  
  Lock,
  Bell,
  Globe,
  Shield,
  Database,
  DownloadCloud,
  Key,
  LogOut,
  Save,
  X,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Jean Dupont",
    email: "jean.dupont@eneo.cm",
    position: "Responsable Inventaire",
    phone: "+237 6 94 12 34 56",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "fr",
    notifications: true,
    darkMode: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Soumettre les modifications
    alert("Paramètres sauvegardés avec succès!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="text-teal-600 dark:text-teal-400" />
            Paramètres de l'Application
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gérer vos préférences et configurations
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 h-fit">
            <nav className="space-y-1 p-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "profile"
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profil Utilisateur</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "security"
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Lock className="h-5 w-5" />
                <span>Sécurité</span>
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "preferences"
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Bell className="h-5 w-5" />
                <span>Préférences</span>
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "data"
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Database className="h-5 w-5" />
                <span>Gestion des Données</span>
              </button>
              <button
                onClick={() => setActiveTab("integrations")}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "integrations"
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span>Intégrations</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <button
                onClick={() => alert("Déconnexion effectuée")}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
            {/* Profil Utilisateur */}
            {activeTab === "profile" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <User className="text-teal-600 dark:text-teal-400" />
                  Informations du Profil
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Poste
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}

            {/* Sécurité */}
            {activeTab === "security" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Lock className="text-teal-600 dark:text-teal-400" />
                  Sécurité du Compte
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Mot de Passe Actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Nouveau Mot de Passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white pr-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum 8 caractères avec chiffres, majuscules et symboles
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Confirmer le Nouveau Mot de Passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white pr-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Key className="text-amber-600 dark:text-amber-400" />
                    Authentification à Deux Facteurs
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Actuellement:{" "}
                        <span className="font-medium">Inactive</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Améliorez la sécurité de votre compte
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors text-sm"
                    >
                      Activer 2FA
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Mettre à jour
                  </button>
                </div>
              </form>
            )}

            {/* Préférences */}
            {activeTab === "preferences" && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Bell className="text-teal-600 dark:text-teal-400" />
                  Préférences de l'Application
                </h2>

                <div className="space-y-6 mb-6">
                  <div>
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Langue
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="darkMode"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Mode Sombre
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Activer/désactiver l'apparence sombre
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="darkMode"
                        name="darkMode"
                        checked={formData.darkMode}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label
                        htmlFor="notifications"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Notifications
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Recevoir des notifications importantes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        checked={formData.notifications}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    Sauvegarder
                  </button>
                </div>
              </form>
            )}

            {/* Gestion des Données */}
            {activeTab === "data" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Database className="text-teal-600 dark:text-teal-400" />
                  Gestion des Données
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <DownloadCloud className="text-blue-600 dark:text-blue-400" />
                      Export des Données
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Exportez l'ensemble des données d'inventaire pour
                      sauvegarde ou analyse externe.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Export CSV
                      </button>
                      <button className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Export Excel
                      </button>
                      <button className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Export PDF
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Database className="text-amber-600 dark:text-amber-400" />
                      Sauvegarde des Données
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Dernière sauvegarde: 24/10/2023 à 02:00
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Fréquence: Quotidienne
                    </p>
                    <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Sauvegarder maintenant
                    </button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <h3 className="font-medium text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                      <X className="text-red-600 dark:text-red-400" />
                      Zone Critique
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Ces actions sont irréversibles. Veuillez procéder avec
                      prudence.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          confirm(
                            "Êtes-vous sûr de vouloir réinitialiser toutes les préférences?"
                          )
                        }
                        className="px-4 py-2 bg-white dark:bg-gray-600 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-300 rounded-lg shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Réinitialiser les préférences
                      </button>
                      <button
                        onClick={() =>
                          confirm(
                            "Êtes-vous sûr de vouloir supprimer toutes les données locales?"
                          )
                        }
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                      >
                        Supprimer données locales
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Intégrations */}
            {activeTab === "integrations" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Globe className="text-teal-600 dark:text-teal-400" />
                  Intégrations
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <img
                        src="/icons/google-drive.svg"
                        alt="Google Drive"
                        className="h-5 w-5"
                      />
                      Google Drive
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Connectez votre compte Google Drive pour sauvegarder et
                      partager des rapports.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors">
                      Connecter Google Drive
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <img
                        src="/icons/microsoft.svg"
                        alt="Microsoft 365"
                        className="h-5 w-5"
                      />
                      Microsoft 365
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Intégration avec Excel Online et SharePoint pour la
                      collaboration.
                    </p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors">
                      Connecter Microsoft 365
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <img
                        src="/icons/slack.svg"
                        alt="Slack"
                        className="h-5 w-5"
                      />
                      Slack
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Recevez des notifications directement dans vos canaux
                      Slack.
                    </p>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors">
                      Connecter Slack
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
