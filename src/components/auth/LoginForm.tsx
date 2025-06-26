import { useState } from "react";
import { Eye, EyeOff, Zap, CheckCircle, Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ArcticElecLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Connexion en cours...");
    toast.success("Connexion en cours...");
    navigate("/");
    // Logique de connexion ici
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Section principale de connexion */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 order-2 lg:order-1">
        <div className="max-w-md w-full space-y-6 lg:space-y-8 py-8 lg:py-0">
          {/* Logo et titre */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 sm:h-16 sm:w-16 bg-gradient-to-br from-emerald-500 to-emeral-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Bienvenue
            </h2>
            <p className="text-gray-600 text-sm px-4 sm:px-0">
              Connectez-vous à votre compte ARCTIC-ELEC Admin
            </p>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl sm:rounded-2xl border border-gray-100 mx-2 sm:mx-0">
            <div className="space-y-4 sm:space-y-6">
              {/* Champ Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 transition-all duration-200 text-sm sm:text-base"
                  placeholder="admin@eneo.cm"
                />
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-2.5 pr-10 sm:px-4 sm:py-3 sm:pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 transition-all duration-200 text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Se connecter
                </button>
              </div>
            </div>

            {/* Compte de démonstration */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-100">
              <div className="flex items-center mb-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">
                  Compte de démonstration
                </span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div className="break-all">
                  <strong>Email:</strong> admin@eneo.cm
                </div>
                <div>
                  <strong>Mot de passe:</strong> admin123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite avec informations */}
      <div className="flex items-center  lg:flex-1 bg-gradient-to-br bg-cyan-600 relative overflow-hidden order-1 lg:order-2 min-h-[300px] lg:min-h-screen">
        {/* Éléments décoratifs */}
        <div className="absolute top-10 right-10 lg:top-20 lg:right-20 w-16 h-16 lg:w-32 lg:h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 left-10 lg:bottom-20 lg:left-20 w-12 h-12 lg:w-24 lg:h-24 bg-green-500/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 lg:w-16 lg:h-16 bg-orange-400/20 rounded-full"></div>

        <div className="flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 py-8 lg:py-16 text-white relative z-10 w-full">
          {/* Logo principal */}
          <div className="mb-6 lg:mb-8 text-center  lg:text-left">
            <h1 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4">
              ARCTIC-ELEC
            </h1>
            <p className="text-blue-100 text-base lg:text-lg leading-relaxed px-4 lg:px-0">
              Inventaire et valorisation intelligente des actifs électriques
              ENEO
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
              <span className="text-blue-100 text-sm lg:text-base">
                Surveillance en temps réel des équipements
              </span>
            </div>

            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
              <span className="text-blue-100 text-sm lg:text-base">
                Analyses et rapports détaillés
              </span>
            </div>

            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
              <span className="text-blue-100 text-sm lg:text-base">
                Interface sécurisée et moderne
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
