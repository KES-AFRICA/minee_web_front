import { currentUser } from "@/data/utiliateur";
import { Save, User, Edit2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  type ProfileData = {
    fullName: string;
    email: string;
    position: string;
    phone: string;
  };

  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    position: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState<ProfileData>({
    fullName: "",
    email: "",
    position: "",
    phone: "",
  });

  // Initialiser les données du formulaire
  useEffect(() => {
    const initialData = {
      fullName: currentUser.fullName,
      email: currentUser.email,
      position: currentUser.position,
      phone: currentUser.phone,
    };
    setFormData(initialData);
    setOriginalData(initialData);
  }, []);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Simulation d'une sauvegarde
    setTimeout(() => {
      console.log("Données sauvegardées:", formData);
      setOriginalData(formData);
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès!");
    }, 500);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    toast.error("Modifications annulées");
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      toast.info("Mode édition activé");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="text-teal-600 dark:text-teal-400" />
          Informations du Profil
        </h2>

        <button
          onClick={toggleEdit}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isEditing
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Annuler l'édition
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Modifier
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Informations de base non modifiables */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg h-fit">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informations système
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                ID Utilisateur:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {currentUser.id}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rôle:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {currentUser.role.name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Structure:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {currentUser.structure.name}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-600 pb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Statut:
              </span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  currentUser.status === "Actif"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {currentUser.status}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date de création:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {currentUser.createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire modifiable */}
        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Informations personnelles
          </h3>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom Complet
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white">
                  {formData.fullName}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Adresse Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white">
                  {formData.email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Poste
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white">
                  {formData.position}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Téléphone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white">
                  {formData.phone}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Save className="h-5 w-5" />
                Sauvegarder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
