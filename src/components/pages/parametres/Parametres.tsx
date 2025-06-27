import { useTheme } from "../../../hooks/useTheme";

export default function Parametres() {

  const { getThemeClass, cn } = useTheme();
  return (
    <div>
      <div className="border-t border-teal-100 dark:border-teal-700/50 mt-2 pt-2">
        <p className="text-gray-800 dark:text-gray-200">
          Contenu avec bordure thématique
        </p>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Titre
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Description avec thème adaptatif
          </p>
        </div>
      </div>
      <div
        className={cn(
          "border-t mt-2 pt-2",
          getThemeClass("border-teal-100", "border-teal-700/50")
        )}
      >
        <p className={getThemeClass("text-gray-800", "text-gray-200")}>
          Contenu avec bordure thématique
        </p>
      </div>
    </div>
  );
}
